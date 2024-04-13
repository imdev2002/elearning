import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import passport from '../../configs/passport';
import { CourseStatus, Currency, ReqUser, RoleEnum } from '../../global';
import NotFoundException from '../../exceptions/not-found';
import HttpException from '../../exceptions/http-exception';
import commonUtil from '../../util/common.util';
import courseUtil from '../../util/course.util';
import partUtil from '../../util/part.util';
import xtripe from '../../configs/xtripe';

export default class CourseController extends BaseController {
  public path = '/api/v1/courses';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/actions/heart`,
      passport.authenticate('jwt', { session: false }),
      this.heartAction,
    );
    this.router.post(
      `${this.path}/actions/comment`,
      passport.authenticate('jwt', { session: false }),
      this.createCommentAction,
    );
    this.router.patch(
      `${this.path}/actions/comment/:id`,
      passport.authenticate('jwt', { session: false }),
      this.updateCommentAction,
    );
    this.router.delete(
      `${this.path}/actions/comment/:id`,
      passport.authenticate('jwt', { session: false }),
      this.deleteCommentAction,
    );
    this.router.post(
      `${this.path}/actions/emoji`,
      passport.authenticate('jwt', { session: false }),
      this.emojiAction,
    );
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
    this.router.get(
      `${this.path}/:id/parts`,
      passport.authenticate('jwt', { session: false }),
      this.getParts,
    );
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
  }

  heartAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.body.courseId);
      const reqUser = req.user as ReqUser;
      const course = await this.prisma.course.findFirst({
        where: { id },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      const heart = await this.prisma.heart.findFirst({
        where: { userId: reqUser.id, courseId: id },
      });

      if (heart) {
        await this.prisma.heart.delete({
          where: {
            id: heart.id,
          },
        });
        return res.status(200).json(heart);
      }
      const newHeart = await this.prisma.heart.create({
        data: {
          user: { connect: { id: reqUser.id } },
          course: { connect: { id } },
        },
      });

      return res.status(200).json(newHeart);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  createCommentAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.body.courseId);
      const reqUser = req.user as ReqUser;
      const course = await this.prisma.course.findFirst({
        where: { id },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      const { content, level } = req.body;
      if (!content) {
        throw new HttpException(400, 'Where tf is your comment content');
      }
      let comment;
      if (level === 0) {
        comment = await this.prisma.comment.create({
          data: {
            content,
            user: { connect: { id: reqUser.id } },
            course: { connect: { id } },
            level: 0,
          },
        });
      } else if (level === 1 || level === 2) {
        const { parentId } = req.body;
        if (!(parentId || parentId == 0)) {
          throw new HttpException(400, 'parentId is missing');
        }
        comment = await this.prisma.comment.create({
          data: {
            content,
            user: { connect: { id: reqUser.id } },
            course: { connect: { id } },
            parent: { connect: { id: parentId } },
          },
        });
      } else {
        throw new HttpException(400, 'Invalid level');
      }
      return res.status(200).json(comment);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  updateCommentAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const reqUser = req.user as ReqUser;
      const comment = await this.prisma.comment.findFirst({ where: { id } });
      if (!comment) {
        throw new NotFoundException('comment', id);
      }
      if (comment.userId !== reqUser.id) {
        throw new HttpException(401, 'Unauthorized');
      }
      const { content } = req.body;
      await this.prisma.comment.update({ where: { id }, data: { content } });
      const newComment = await this.prisma.comment.findFirst({ where: { id } });
      return res.status(200).json(newComment);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  deleteCommentAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const reqUser = req.user as ReqUser;
      const comment = await this.prisma.comment.findFirst({
        where: { id },
        include: { children: { include: { children: true } } },
      });
      if (!comment) {
        throw new NotFoundException('comment', id);
      }
      if (comment.userId !== reqUser.id) {
        throw new HttpException(401, 'Unauthorized');
      }
      if (comment.level === 0) {
        const comments = await this.prisma.comment.findMany({
          where: { parentId: id },
        });
        for (const comment of comments) {
          await this.prisma.comment.deleteMany({
            where: { parentId: comment.id },
          });
          await this.prisma.comment.delete({ where: { id: comment.id } });
        }
        await this.prisma.comment.delete({ where: { id } });
      } else if (comment.level === 1) {
        await this.prisma.comment.deleteMany({
          where: { parentId: id },
        });
        await this.prisma.comment.delete({
          where: { id },
        });
      } else if (comment.level === 2) {
        await this.prisma.comment.delete({
          where: { id },
        });
      }
      return res.status(200).json(comment);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  emojiAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.body.courseId);
      const reqUser = req.user as ReqUser;
      const course = await this.prisma.course.findFirst({
        where: { id },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      const { emojiIconId } = req.body;
      const emojiIcon = await this.prisma.emojiIcon.findFirst({
        where: { id: emojiIconId },
      });
      if (!emojiIcon) {
        throw new NotFoundException('emoji icon', emojiIconId);
      }
      const emoji = await this.prisma.emoji.findFirst({
        where: {
          emojiId: emojiIconId,
          userId: reqUser.id,
          courseId: id,
        },
      });
      if (emoji) {
        await this.prisma.emoji.delete({
          where: {
            id: emoji.id,
          },
        });
        return res.status(200).json(emoji);
      }
      const newEmoji = await this.prisma.emoji.create({
        data: {
          emoji: { connect: { id: emojiIconId } },
          user: { connect: { id: reqUser.id } },
          course: { connect: { id } },
        },
      });

      return res.status(200).json(newEmoji);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
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
      const course = await courseUtil.getCourse(this.prisma, id, reqUser.id);
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
      const {
        courseName,
        knowledgeGained,
        isPublic,
        descriptionMD,
        priceAmount,
      } = req.body;
      if (!(courseName && knowledgeGained.length > 0 && descriptionMD)) {
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
          totalPart: parts.length,
          totalLesson: lessons.length,
          status: CourseStatus.PENDING,
          priceAmount: priceAmount || 0,
          currency: Currency.USD,
        },
      });
      await xtripe.products.update(course.productId as string, {
        name: courseName,
        description: descriptionMD,
      });
      await xtripe.prices.update(course.priceId as string, {
        currency_options: {
          USD: {
            unit_amount_decimal: String(priceAmount * 100) || '000',
          },
        },
      });
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
      const { partNumber, partName } = req.body;
      if (!partNumber || !partName || !courseId) {
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
      const reqUser = req.user as ReqUser;
      const courseId = Number(req.params.id);
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
}
