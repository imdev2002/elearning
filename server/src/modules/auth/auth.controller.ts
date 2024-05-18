import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import passport from '../../configs/passport';
import { sign, verify } from 'jsonwebtoken';
import Welcome from '../../email/templates/welcome';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import sendEmail from '../../email/process';
import { render } from '@react-email/render';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import HttpException from '../../exceptions/http-exception';
import { Platform, ReqUser, RoleEnum, UserRole } from '../../global';
import commonUtil from '../../util/common.util';
import VerifyEmail from '../../email/templates/verify';
import ResetPassword from '../../email/templates/reset';

export default class AuthController extends BaseController {
  public path = '/api/v1/auth';
  private client: OAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'postmessage',
  );

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      this.path,
      passport.authenticate('google', { scope: ['profile', 'email'] }),
    );
    this.router.get(
      `${this.path}/redirect`,
      passport.authenticate('google', { session: false }),
      this.redirect,
    );
    this.router.post(`${this.path}/login`, this.login);
    this.router.post(
      `${this.path}/refresh`,
      passport.authenticate('jwt', { session: false }),
      this.refresh,
    );
    this.router.post(
      `${this.path}/logout`,
      passport.authenticate('jwt', { session: false }),
      this.logout,
    );
    this.router.post(`${this.path}/local/register`, this.registerLocal);
    this.router.post(`${this.path}/local/login`, this.loginLocal);
    this.router.post(`${this.path}/local/password`, this.changePassword);
    this.router.post(`${this.path}/local/reset`, this.resetPassword);
  }

  upsertUser = async (
    email: string,
    picture: string,
    family_name: string,
    given_name: string,
    sub: string,
  ) => {
    let user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
    if (!user && email) {
      await this.prisma.user.create({
        data: {
          email,
          firstName: given_name,
          lastName: family_name,
          avatar: picture,
          roles: {
            create: {
              role: { connect: { name: RoleEnum.USER } },
            },
          },
          platform: Platform.GOOGLE,
          isVerified: true,
        },
      });
      await this.prisma.cart.create({
        data: { user: { connect: { email } } },
      });
      const emailHtml = render(Welcome({ userFirstName: given_name || '' }));
      await sendEmail(emailHtml, email, 'Your Adventure Begins with DKE!');
    } else {
      const data: any = {
        email,
        platform: Platform.GOOGLE,
        isVerified: true,
      };
      if (user?.syncWithGoogle) {
        data.firstName = given_name;
        data.lastName = family_name;
        data.avatar = picture;
      }
      await this.prisma.user.update({
        where: { email },
        data,
      });
    }
    user = await this.prisma.user.findFirst({
      where: { email },
      include: { roles: { include: { role: true } } },
    });
    return user;
  };

  generateAccessToken = (user: {
    id: number;
    email: string;
    roles: UserRole[];
  }) => {
    return sign({ user }, process.env.SECRET || '', { expiresIn: '7d' });
  };

  generateRefreshToken = (user: {
    id: number;
    email: string;
    roles: UserRole[];
  }) => {
    return sign({ user }, process.env.REFRESH_SECRET || '', {
      expiresIn: '14d',
    });
  };

  redirect = async (req: Request, res: Response) => {
    try {
      const accessToken = this.generateAccessToken(req.user as ReqUser);
      const refreshToken = this.generateRefreshToken(req.user as ReqUser);
      await this.prisma.user.update({
        where: {
          email: (req.user as ReqUser).email,
        },
        data: {
          refreshToken,
        },
      });

      return res.status(200).send({ accessToken, refreshToken });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  login = async (req: Request, res: Response) => {
    try {
      let email, picture, family_name, given_name, sub;
      if (req.body.accessToken && !req.body.token) {
        const { data } = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${req.body.accessToken}` },
          },
        );
        email = data.email;
        email = `${commonUtil
          .replaceAll(email?.split('@')[0] as string, '.', '')
          .toLowerCase()}@${email?.split('@')[1]}`;
        picture = data.picture;
        family_name = data.family_name;
        given_name = data.given_name;
        sub = data.sub;
      } else if (req.body.token && !req.body.accessToken) {
        const { token } = req.body;
        const ticket = await this.client.verifyIdToken({
          idToken: token,
          // audience: process.env.CLIENT_ID,
        });
        const payload = ticket.getPayload() as TokenPayload;
        email = payload.email;
        email = `${commonUtil
          .replaceAll(email?.split('@')[0] as string, '.', '')
          .toLowerCase()}@${email?.split('@')[1]}`;
        picture = payload.picture;
        family_name = payload.family_name;
        given_name = payload.given_name;
        sub = payload.sub;
      } else {
        throw new HttpException(400, 'Missing accessToken or credentials');
      }

      const data = await this.upsertUser(
        email,
        picture,
        family_name,
        given_name,
        sub,
      );
      if (data && data.id && data?.email && data.roles) {
        const accessToken = this.generateAccessToken({
          id: data.id,
          email: data.email,
          roles: data.roles as UserRole[],
        });

        const refreshToken = this.generateRefreshToken({
          id: data.id,
          email: data.email,
          roles: data.roles as UserRole[],
        });
        await this.prisma.user.update({
          where: {
            email: data.email,
          },
          data: {
            refreshToken,
          },
        });

        return res.status(200).json({
          accessToken,
          refreshToken,
          data,
        });
      }
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.body.refreshToken;
      const payload = verify(refreshToken, process.env.REFRESH_SECRET || '');
      if (
        !payload ||
        !(await this.prisma.user.findFirst({ where: { refreshToken } }))
      ) {
        throw new HttpException(401, 'Invalid refreshToken');
      }

      const newRefreshToken = this.generateRefreshToken(req.user as ReqUser);
      const accessToken = this.generateAccessToken(req.user as ReqUser);
      await this.prisma.user.update({
        where: {
          email: (req.user as ReqUser).email,
        },
        data: {
          refreshToken: newRefreshToken,
        },
      });
      res.json({ accessToken, newRefreshToken });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      await this.prisma.user.update({
        where: {
          email: (req.user as ReqUser).email,
        },
        data: {
          refreshToken: null,
        },
      });
      res.status(200).send('Logout successfully');
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  registerLocal = async (req: Request, res: Response) => {
    try {
      const { password, confirmPassword } = req.body;
      let { email } = req.body;
      email = `${commonUtil
        .replaceAll(email?.split('@')[0] as string, '.', '')
        .toLowerCase()}@${email?.split('@')[1]}`;
      const existUser = await this.prisma.user.findFirst({ where: { email } });
      if (existUser) {
        throw new HttpException(400, 'Email already exist');
      }
      if (confirmPassword !== password) {
        throw new HttpException(400, 'Passwords are not the same');
      }
      if (!commonUtil.validatePassword(password)) {
        throw new HttpException(
          400,
          'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
        );
      }
      const salt = bcrypt.genSaltSync(10);
      const newPassword = bcrypt.hashSync(password, salt);
      let verifyCode = commonUtil.generateRandomString(10);
      const username = email.split('@')[0];
      while (await this.prisma.user.findFirst({ where: { verifyCode } })) {
        verifyCode = commonUtil.generateRandomString(10);
      }
      await this.prisma.user.create({
        data: {
          email,
          username,
          password: newPassword,
          salt,
          roles: { create: { role: { connect: { name: RoleEnum.USER } } } },
          platform: Platform.LOCAL,
          isVerified: false,
          verifyCode,
        },
      });
      await this.prisma.cart.create({
        data: { user: { connect: { email } } },
      });
      res.status(200).json({ email });
      const emailHtml = render(
        VerifyEmail({
          userFirstName: email.split('@')[0],
          verifyLink: `${process.env.PUBLIC_URL}/verify?verify=${verifyCode}`,
        }),
      );
      await sendEmail(emailHtml, email, `Let's verify your email address!`);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  loginLocal = async (req: Request, res: Response) => {
    try {
      const { password } = req.body;
      let { email } = req.body;
      email = `${commonUtil
        .replaceAll(email?.split('@')[0] as string, '.', '')
        .toLowerCase()}@${email?.split('@')[1]}`;
      const user = await this.prisma.user.findFirst({
        where: { email },
        include: { roles: { include: { role: true } } },
      });
      if (!user || !bcrypt.compareSync(password, user.password || '')) {
        throw new HttpException(401, 'Username or password was wrong');
      }
      if (user && user.id && user?.email && user.roles) {
        const accessToken = this.generateAccessToken({
          id: user.id,
          email: user.email,
          roles: user.roles as UserRole[],
        });

        const refreshToken = this.generateRefreshToken({
          id: user.id,
          email: user.email,
          roles: user.roles as UserRole[],
        });
        await this.prisma.user.update({
          where: {
            email,
          },
          data: { refreshToken },
        });

        return res.status(200).json({
          accessToken,
          refreshToken,
          user: { email, id: user.id },
        });
      }
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  changePassword = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const { password, confirmPassword, oldPassword } = req.body;
      if (confirmPassword !== password) {
        throw new HttpException(400, 'Passwords are not the same');
      }
      const user = await this.prisma.user.findFirst({
        where: { email: reqUser.email, isVerified: true },
        include: { roles: { include: { role: true } } },
      });
      if (!user) {
        throw new HttpException(400, 'Invalid email address');
      }
      if (!commonUtil.validatePassword(password)) {
        throw new HttpException(
          400,
          'Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character',
        );
      }
      if (!bcrypt.compareSync(oldPassword, user.password as string)) {
        throw new HttpException(400, 'Old password is not correct');
      }
      const newPassword = bcrypt.hashSync(password, user.salt as string);
      await this.prisma.user.update({
        where: { email: reqUser.email },
        data: {
          password: newPassword,
        },
      });
      return res.status(200).json({ email: reqUser.email });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const user = await this.prisma.user.findFirst({
        where: { email, isVerified: true },
        include: { roles: { include: { role: true } } },
      });
      if (!user) {
        throw new HttpException(400, 'Invalid email address');
      }
      if (
        !(
          !user.lastReset ||
          new Date().getTime() - user.lastReset.getTime() > 1296000000
        )
      ) {
        throw new HttpException(
          400,
          'You can only reset password every 15 days',
        );
      }
      let newPassword = commonUtil.generateRandomPassword();
      const salt = user.salt || bcrypt.genSaltSync(10);
      newPassword = bcrypt.hashSync(newPassword, salt);
      await this.prisma.user.update({
        where: { email },
        data: {
          password: newPassword,
          salt,
          lastReset: new Date(),
        },
      });
      const emailHtml = render(ResetPassword({ newPassword }));
      await sendEmail(emailHtml, email, 'We reset your password');
      return res.status(200).json({ email });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
