import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import passport from '../../configs/passport';
import HttpException from '../../exceptions/http-exception';
import NotFoundException from '../../exceptions/not-found';
import {
  CourseCategory,
  CoursesPaidStatus,
  FormStatus,
  ReqUser,
  RoleEnum,
} from '../../global';
import { Platform } from '@prisma/client';
import { videoUpload } from '../../configs/multer';

export default class UserController extends BaseController {
  public path = '/api/v1/users';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}/new-user`,
      passport.authenticate('jwt', { session: false }),
      this.newUser,
    );
    // get list
    this.router.get(
      this.path,
      passport.authenticate('jwt', { session: false }),
      this.getUsers,
    );
    // add user
    this.router.post(
      this.path,
      passport.authenticate('jwt', { session: false }),
      this.addUser,
    );
    // update user
    this.router.patch(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      videoUpload.fields([{ name: 'avatar', maxCount: 1 }]),
      this.updateUser,
    );
    // delete user
    this.router.delete(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      this.deleteUser,
    );
    // get user detail
    this.router.get(
      `${this.path}/:id`,
      // passport.authenticate('jwt', { session: false }),
      this.getUserDetail,
    );
    this.router.get(
      `${this.path}/users/profile`,
      passport.authenticate('jwt', { session: false }),
      this.getProfile,
    );
    this.router.post(`${this.path}/verify`, this.verifyUser);
    this.router.post(
      `${this.path}/author/verify`,
      passport.authenticate('jwt', { session: false }),
      videoUpload.fields([
        { name: 'frontIdCard', maxCount: 1 },
        { name: 'backIdCard', maxCount: 1 },
        { name: 'selfie', maxCount: 1 },
      ]),
      this.authorVerify,
    );
    this.router.get(
      `${this.path}/actions/hearted`,
      passport.authenticate('jwt', { session: false }),
      this.getHearted,
    );
    this.router.get(
      `${this.path}/actions/bought`,
      passport.authenticate('jwt', { session: false }),
      this.getBought,
    );
    this.router.get(
      `${this.path}/actions/progress`,
      passport.authenticate('jwt', { session: false }),
      this.getProgress,
    );
    this.router.get(
      `${this.path}/actions/forms`,
      passport.authenticate('jwt', { session: false }),
      this.getMyForms,
    );
    this.router.patch(
      `${this.path}/actions/forms`,
      passport.authenticate('jwt', { session: false }),
      this.updateMyForm,
    );
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      const userRoles = (req.user as ReqUser).roles;
      let limit = req.query.limit || 12;
      limit = +limit;
      let offset = req.query.offset || 0;
      offset = +offset;
      const query = {
        skip: offset,
        take: limit,
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      };
      for (const userRole of userRoles) {
        if (userRole.role.name === RoleEnum.ADMIN) {
          const users = await this.prisma.user.findMany(query);
          return res.status(200).send(users);
        }
      }
      throw new HttpException(401, 'Unauthorized');
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  // add user
  addUser = async (req: Request, res: Response) => {
    try {
      const { email, firstName, lastName, avatar } = req.body;

      const existingUser = await this.prisma.user.findFirst({
        where: { email: email },
      });
      if (existingUser) {
        throw new HttpException(400, 'Email already in use');
      }
      const userRole = await this.prisma.role.findFirst({
        where: { name: RoleEnum.USER },
      });
      if (!userRole || userRole.id) {
        throw new HttpException(500, 'Internal server error');
      }
      const user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          avatar,
          roles: {
            create: [
              {
                role: { connect: { name: RoleEnum.USER } },
              },
            ],
          },
          platform: Platform.GOOGLE,
        },
      });
      await this.prisma.cart.create({
        data: { user: { connect: { email } } },
      });
      res.status(201).send(user);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const userRoles = (req.user as ReqUser).roles;
      const id = Number(req.params.id);
      const {
        username,
        firstName,
        lastName,
        phone,
        gender,
        birthday,
        syncWithGoogle,
      } = req.body;
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) {
        throw new NotFoundException('user', id);
      }
      if (
        !(
          userRoles.find((userRole) => userRole.role.name === RoleEnum.ADMIN) ||
          user?.email === (req.user as ReqUser).email
        )
      ) {
        throw new HttpException(401, 'Unauthorized');
      }
      const usernameExist = await this.prisma.user.findFirst({
        where: { username, id: { not: id } },
      });
      if (usernameExist) {
        throw new HttpException(400, 'Username already exists');
      }
      const data: any = {
        username: username || user.username,
        firstName: firstName || '',
        lastName: lastName || '',
        phone: phone || '',
        gender: gender || '',
        birthday: birthday || new Date(),
        syncWithGoogle: syncWithGoogle === 'true' || false,
      };

      if ((req.files as any)?.avatar) {
        if ((req.files as any)?.avatar[0]?.path) {
          console.log('HERE');

          data.avatar = (req.files as any)?.avatar[0]?.path;
        }
      }
      const updateUser = await this.prisma.user.update({
        where: { id: id },
        data,
      });
      return res.status(200).send(updateUser);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const userRoles = (req.user as ReqUser).roles;
      const id = Number(req.params.id);
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) {
        throw new NotFoundException('user', id);
      }
      if (
        (req.user as ReqUser).id === id ||
        userRoles.find((userRole) => {
          if (userRole.role.name === RoleEnum.ADMIN) {
            return true;
          }
        })
      ) {
        await this.prisma.user.delete({
          where: { id: id },
        });
      }
      return res.status(200).send(user);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  getUserDetail = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await this.prisma.user.findFirst({
        where: { id },
        include: { roles: { include: { role: { select: { name: true } } } } },
      });
      if (!user) {
        throw new NotFoundException('user', id);
      }
      const { refreshToken, password, salt, ...data } = user;
      return res.status(200).send(data);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getProfile = async (req: Request, res: Response) => {
    try {
      const user = await this.prisma.user.findFirst({
        where: { id: (req.user as ReqUser).id },
        include: {
          roles: {
            include: {
              role: true,
              user: true,
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('user', (req.user as ReqUser).id);
      }
      const { platform, refreshToken, firstTime, roles, ...data } = user;
      res.status(200).json(data);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  newUser = async (req: Request, res: Response) => {
    try {
      const user = req.user as ReqUser;
      await this.prisma.user.update({
        where: { id: user.id },
        data: { isNewUser: false },
      });
      const newUser = await this.prisma.user.findFirst({
        where: { id: user.id },
      });
      return res.status(200).send(newUser);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  verifyUser = async (req: Request, res: Response) => {
    try {
      const { verifyCode } = req.body;
      const user = await this.prisma.user.findFirst({ where: { verifyCode } });
      if (!user) {
        throw new NotFoundException('user', verifyCode);
      }
      await this.prisma.user.update({
        where: { id: user.id },
        data: { verifyCode: '', isVerified: true },
      });
      user.verifyCode = '';
      user.isVerified = true;
      return res.status(200).send(user);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  authorVerify = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      if (!req.files) {
        throw new HttpException(400, 'Please upload files');
      }
      let { frontIdCard, backIdCard, selfie } = req.files as any;
      console.log(req.files);
      frontIdCard = frontIdCard[0];
      backIdCard = backIdCard[0];
      selfie = selfie[0];
      const { real_firstName, real_lastName, linkCV } = req.body;
      const category = req.body.category as CourseCategory;
      if (!real_firstName || !real_lastName) {
        throw new HttpException(400, 'Please provide your real name');
      }
      if (
        await this.prisma.submitForm.findFirst({
          where: { userId: reqUser.id },
        })
      ) {
        throw new HttpException(
          400,
          'You have already submitted your information',
        );
      }
      const submitForm = await this.prisma.submitForm.create({
        data: {
          user: { connect: { id: reqUser.id } },
          real_firstName,
          real_lastName,
          frontIdCard: frontIdCard.path,
          backIdCard: backIdCard.path,
          selfie: selfie.path,
          linkCV,
          category,
        },
      });
      return res.status(200).json(submitForm);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getHearted = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const lessonHearted = await this.prisma.heart.findMany({
        where: {
          userId: reqUser.id,
          lessonId: { not: null },
        },
        include: {
          lesson: true,
        },
      });
      const courseHearted = await this.prisma.heart.findMany({
        where: { userId: reqUser.id, courseId: { not: null } },
        include: { course: true },
      });
      return res.status(200).json({ lessonHearted, courseHearted });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getBought = async (req: Request, res: Response) => {
    try {
      const course = await this.prisma.coursesPaid.findMany({
        where: {
          userId: (req.user as ReqUser).id,
          status: CoursesPaidStatus.SUCCESS,
        },
        include: { course: true },
      });
      return res.status(200).json(course);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getProgress = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const lessons = await this.prisma.lessonDone.findMany({
        where: { userId: reqUser.id },
        include: { lesson: { include: { part: true } } },
      });
      const _ = [] as { courseId: number; lessons: any[] }[];
      const __ = [] as number[];
      for (const lesson of lessons) {
        if (!__.includes(lesson.lesson.part.courseId)) {
          __.push(lesson.lesson.part.courseId);
        }
      }
      for (const id of __) {
        _.push({
          courseId: id,
          lessons: lessons.filter(
            (lesson) => lesson.lesson.part.courseId === id,
          ),
        });
      }
      return res.status(200).json(_);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getMyForms = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const forms = await this.prisma.submitForm.findMany({
        where: { userId: reqUser.id },
      });
      return res.status(200).json(forms);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  updateMyForm = async (req: Request, res: Response) => {
    try {
      const myForm = await this.prisma.submitForm.findFirst({
        where: { userId: (req.user as ReqUser).id },
      });
      if (!myForm) {
        throw new NotFoundException('form', (req.user as ReqUser).id);
      }
      const now = new Date();
      const is15Days =
        now.getTime() - myForm.updatedAt.getTime() > 15 * 24 * 60 * 60 * 1000;
      if (!(is15Days && myForm.status === FormStatus.REJECTED)) {
        throw new HttpException(400, 'You can only update form every 15 days');
      }
      const { real_firstName, real_lastName, linkCV } = req.body;
      const category = req.body.category as CourseCategory;
      if (!real_firstName || !real_lastName) {
        throw new HttpException(400, 'Please provide your real name');
      }
      if (!linkCV) {
        throw new HttpException(400, 'Please provide your CV');
      }
      const submitForm = await this.prisma.submitForm.update({
        where: { id: myForm.id },
        data: {
          real_firstName,
          real_lastName,
          linkCV,
          category,
          status: FormStatus.PENDING,
        },
      });
      return res.status(200).json(submitForm);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
