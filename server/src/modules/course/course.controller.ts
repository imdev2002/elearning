import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import passport from '../../configs/passport';
import {
  CourseCategory,
  CourseStatus,
  Currency,
  LessonStatus,
  ReqUser,
  RoleEnum,
} from '../../global';
import NotFoundException from '../../exceptions/not-found';
import HttpException from '../../exceptions/http-exception';
import commonUtil from '../../util/common.util';
import courseUtil from '../../util/course.util';
import partUtil from '../../util/part.util';
import xtripe from '../../configs/xtripe';
import checkRoleMiddleware from '../../middlewares/checkRole.middleware';
import { videoUpload } from '../../configs/multer';

export default class CourseController extends BaseController {
  public path = '/api/v1/courses';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      this.createCourse,
    );
    this.router.get(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      this.getCourses,
    );
    this.router.get(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      this.getCourse,
    );
    this.router.patch(
      `${this.path}/:id`,
      videoUpload.fields([{ name: 'thumbnail', maxCount: 1 }]),
      passport.authenticate('jwt', { session: false }),
      this.updateCourse,
    );
    this.router.delete(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      this.deleteCourse,
    );
    this.router.post(
      `${this.path}/:id/parts`,
      passport.authenticate('jwt', { session: false }),
      this.createPart,
    );
    this.router.get(`${this.path}/:id/parts`, this.getParts);
    this.router.get(
      `${this.path}/:id/parts/:partId`,
      passport.authenticate('jwt', { session: false }),
      this.getPart,
    );
    this.router.patch(
      `${this.path}/:id/parts/:partId`,
      passport.authenticate('jwt', { session: false }),
      this.updatePart,
    );
    this.router.delete(
      `${this.path}/:id/parts/:partId`,
      passport.authenticate('jwt', { session: false }),
      this.deletePart,
    );
    this.router.patch(
      `${this.path}/:id/actions/approve`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN]),
      this.approveCourse,
    );
  }

  createCourse = async (req: Request, res: Response) => {
    try {
      if (
        !(req.user as ReqUser).roles.find(
          (role) =>
            role.role.name === RoleEnum.ADMIN ||
            role.role.name === RoleEnum.AUTHOR,
        )
      ) {
        throw new HttpException(401, 'Access denied');
      }
      const reqUser = req.user as ReqUser;
      const courseName = `Course ${commonUtil.generateRandomString()}`;
      const product = await xtripe.products.create({
        name: courseName,
        description: courseName,
        metadata: {
          userId: reqUser.id,
        },
        active: true,
        default_price_data: {
          currency: Currency.USD,
          unit_amount_decimal: String(0 * 100),
        },
      });
      const newCourse = await this.prisma.course.create({
        data: {
          courseName,
          totalDuration: 0,
          totalLesson: 0,
          totalPart: 0,
          knowledgeGained: [],
          descriptionMD: '',
          thumbnail: '',
          category: CourseCategory.OTHER,
          isPublic: false,
          priceId: product.default_price as string,
          productId: product.id,
          user: { connect: { id: (req.user as ReqUser).id } },
        },
      });
      const course = await courseUtil.getCourse(
        this.prisma,
        newCourse.id,
        reqUser.id,
      );
      return res.status(200).json(course);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getCourses = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const limit = Number(req.query.limit) || 12;
      const offset = Number(req.query.offset) || 0;
      const courses = await courseUtil.getCourses(
        this.prisma,
        reqUser.id,
        limit,
        offset,
        !!reqUser.roles.find((role) => role.role.name === RoleEnum.ADMIN),
      );
      return res.status(200).json(courses);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getCourse = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const id = Number(req.params.id);
      const course = await courseUtil.getCourse(
        this.prisma,
        id,
        reqUser.id,
        !!reqUser.roles.find((role) => role.role.name === RoleEnum.ADMIN),
      );
      if (!course) {
        throw new NotFoundException('course', id);
      }
      return res.status(200).json(course);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  updateCourse = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const reqUser = req.user as ReqUser;
      const course = await this.prisma.course.findFirst({ where: { id } });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      let { thumbnail } = req.files as any;
      if (thumbnail) {
        thumbnail = thumbnail[0];
      } else {
        thumbnail = { path: course.thumbnail };
      }
      if (
        !(
          course?.userId === (req.user as ReqUser).id ||
          (req.user as ReqUser).roles.find(
            (role) => role.role.name === RoleEnum.ADMIN,
          )
        )
      ) {
        throw new HttpException(401, 'Access denied');
      }
      const { courseName, descriptionMD, category } = req.body;
      const isPublic = req.body.isPublic === 'true';
      const priceAmount = parseFloat(req.body.priceAmount || '0');
      const knowledgeGained =
        (JSON.parse(req.body.knowledgeGained) as string[]) || [];
      if (
        !(courseName && knowledgeGained.length > 0 && descriptionMD && category)
      ) {
        return new HttpException(400, 'missing required fields');
      }
      const parts = await this.prisma.part.findMany({
        where: { courseId: id },
      });
      const lessons = await this.prisma.lesson.findMany({
        where: { courseId: id },
      });

      await this.prisma.course.update({
        where: { id },
        data: {
          courseName,
          knowledgeGained,
          isPublic: isPublic || false,
          descriptionMD,
          category: category || CourseCategory.OTHER,
          totalPart: parts.length,
          thumbnail: thumbnail.path,
          totalLesson: lessons.length,
          status: CourseStatus.PENDING,
          priceAmount: priceAmount || 0,
          currency: Currency.USD,
        },
      });
      const _price = await xtripe.prices.create({
        currency: Currency.USD,
        unit_amount_decimal: String(priceAmount * 100) || '000',
        product: course.productId as string,
      });
      await this.prisma.course.update({
        where: { id },
        data: { priceId: _price.id },
      });
      await xtripe.products.update(course.productId as string, {
        name: courseName,
        description: descriptionMD,
        default_price: _price.id,
      });

      // await xtripe.prices.update(course.priceId as string, {
      //   currency_options: {
      //     USD: {
      //       unit_amount_decimal: String(priceAmount * 100) || '000',
      //     },
      //   },
      // });
      const newCourse = await courseUtil.getCourse(this.prisma, id, reqUser.id);
      return res.status(200).json(newCourse);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  deleteCourse = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const id = Number(req.params.id);
      const course = await courseUtil.getCourse(this.prisma, id, reqUser.id);
      if (!course) {
        throw new NotFoundException('course', id);
      }
      if (
        !(
          course.userId === reqUser.id ||
          reqUser.roles.find((role) => role.role.name === RoleEnum.ADMIN)
        )
      ) {
        throw new HttpException(403, 'Forbidden');
      }
      await this.prisma.lesson.deleteMany({ where: { courseId: id } });
      await this.prisma.comment.deleteMany({ where: { courseId: id } });
      await this.prisma.emoji.deleteMany({ where: { courseId: id } });
      await this.prisma.heart.deleteMany({ where: { courseId: id } });
      await this.prisma.part.deleteMany({ where: { courseId: id } });
      await this.prisma.certificate.deleteMany({ where: { courseId: id } });
      await this.prisma.coursedPaid.deleteMany({ where: { courseId: id } });
      await this.prisma.course.deleteMany({ where: { id } });
      return res.status(200).json(course);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  createPart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const courseId = Number(req.params.id);
      const partNumber = parseInt(req.body.partNumber);
      const { partName } = req.body;
      if (!partNumber || isNaN(partNumber) || !partName || !courseId) {
        throw new Error('Missing required fields');
      }
      const course = await this.prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('course', courseId);
      }
      if (
        !(
          course.userId === reqUser.id ||
          reqUser.roles.find((_) => _.role.name === RoleEnum.ADMIN)
        )
      ) {
        throw new Error('Not authorized');
      }
      const _ = await this.prisma.part.findFirst({
        where: { courseId, partNumber: partNumber },
      });
      if (_) {
        throw new Error('Part number already exists');
      }
      const part = await this.prisma.part.create({
        data: {
          partNumber,
          partName,
          courseId,
          description: req.body.description || `${partNumber}: ${partName}`,
        },
      });
      await partUtil.refreshPart(courseId);
      return res.status(200).json(part);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getParts = async (req: Request, res: Response) => {
    try {
      const courseId = Number(req.params.id);
      const course = await this.prisma.course.findFirst({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('course', courseId);
      }
      const parts = await this.prisma.part.findMany({
        where: { courseId },
        orderBy: { partNumber: 'asc' },
      });
      return res.status(200).json(parts);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getPart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const courseId = Number(req.params.id);
      const partId = Number(req.params.partId);
      const course = await this.prisma.course.findFirst({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('course', courseId);
      }
      if (
        !(
          course.userId === reqUser.id ||
          reqUser.roles.find((_) => _.role.name === RoleEnum.ADMIN)
        )
      ) {
        throw new Error('Not authorized');
      }
      const part = await this.prisma.part.findFirst({
        where: { courseId, id: partId },
        orderBy: { partNumber: 'asc' },
      });
      if (!part) {
        throw new NotFoundException('part', partId);
      }
      return res.status(200).json(part);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  updatePart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const courseId = Number(req.params.id);
      const partId = Number(req.params.partId);
      const { partName, partNumber } = req.body;
      if (!partName || !courseId || !partId || !partNumber) {
        throw new Error('Missing required fields');
      }
      const course = await this.prisma.course.findFirst({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('course', courseId);
      }
      if (
        !(
          course.userId === reqUser.id ||
          reqUser.roles.find((_) => _.role.name === RoleEnum.ADMIN)
        )
      ) {
        throw new Error('Not authorized');
      }
      const part = await this.prisma.part.findFirst({
        where: { id: partId, courseId },
      });
      if (!part) {
        throw new NotFoundException('part', partId);
      }
      await this.prisma.part.update({
        where: { id: partId },
        data: {
          partNumber,
          partName,
        },
      });
      await partUtil.refreshPart(courseId);
      return res.status(200).json(part);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  deletePart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const courseId = Number(req.params.id);
      const partId = Number(req.params.partId);
      const course = await this.prisma.course.findFirst({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('course', courseId);
      }
      if (
        !(
          course.userId === reqUser.id ||
          reqUser.roles.find((_) => _.role.name === RoleEnum.ADMIN)
        )
      ) {
        throw new Error('Not authorized');
      }
      const part = await this.prisma.part.findFirst({
        where: { id: partId, courseId },
      });
      if (!part) {
        throw new NotFoundException('part', partId);
      }
      await this.prisma.part.delete({
        where: { id: partId },
      });
      await partUtil.refreshPart(courseId);
      return res.status(200).json(part);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ estatus: e.status, message: e.message });
    }
  };
  approveCourse = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      let course = await this.prisma.course.findFirst({
        where: { id },
        include: {
          parts: {
            include: {
              lessons: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      for (const part of course.parts) {
        for (const lesson of part.lessons) {
          await this.prisma.lesson.update({
            where: { id: lesson.id },
            data: { status: LessonStatus.APPROVED },
          });
        }
      }
      await this.prisma.course.update({
        where: { id },
        data: { status: CourseStatus.APPROVED },
      });
      course = await this.prisma.course.findFirst({
        where: { id },
        include: {
          parts: {
            include: {
              lessons: {
                include: {
                  user: {
                    select: {
                      id: true,
                      email: true,
                      firstName: true,
                      lastName: true,
                      avatar: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return res.status(200).json(course);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
