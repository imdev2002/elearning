import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import passport from '../../configs/passport';
import HttpException from '../../exceptions/http-exception';
import NotFoundException from '../../exceptions/not-found';
import { ReqUser, RoleEnum } from '../../global';
import { Platform } from '@prisma/client';

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
      passport.authenticate('jwt', { session: false }),
      this.getUserDetail,
    );
    this.router.get(
      `${this.path}/users/profile`,
      passport.authenticate('jwt', { session: false }),
      this.getProfile,
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
      const dataUpdate = req.body;
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) {
        throw new NotFoundException('user', id);
      }
      if (userRoles.find((userRole) => userRole.role.name === RoleEnum.ADMIN)) {
        const updateUser = await this.prisma.user.update({
          where: { id: id },
          data: dataUpdate,
        });
        return res.status(200).send(updateUser);
      }
      const checkOwner = user?.email === (req.user as ReqUser).email;
      if (!checkOwner) {
        throw new HttpException(401, 'Unauthorized');
      }
      const updateUser = await this.prisma.user.update({
        where: { id: id },
        data: dataUpdate,
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
      const user = await this.prisma.user.findFirst({ where: { id } });
      if (!user) {
        throw new NotFoundException('user', id);
      }
      return res.status(200).send(user);
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
}
