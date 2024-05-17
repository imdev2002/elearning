import { BaseController } from '../../abstractions/base.controller';
import passport from '../../configs/passport';
import checkRoleMiddleware from '../../middlewares/checkRole.middleware';
import { FormStatus, ReqUser, RoleEnum } from '../../global';
import { Request, Response } from 'express';
import { render } from '@react-email/render';
import sendEmail from '../../email/process';
import AcceptForm from '../../email/templates/accept';
import RejectForm from '../../email/templates/reject';

export default class FormController extends BaseController {
  public path = '/api/v1/forms';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN]),
      this.getForms,
    );
    this.router.get(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN]),
      this.getForm,
    );
    this.router.patch(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN]),
      this.updateForm,
    );
  }

  getForms = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const forms = await this.prisma.submitForm.findMany();
      return res.status(200).json(forms);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getForm = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const form = await this.prisma.submitForm.findFirst({ where: { id } });
      return res.status(200).json(form);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  updateForm = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const id = Number(req.params.id);
      const status = req.body.status as FormStatus;
      const form = await this.prisma.submitForm.update({
        where: { id },
        data: { status: status },
        include: { user: true },
      });
      if (status === FormStatus.APPROVED) {
        const _ = await this.prisma.submitForm.findFirst({
          where: { id },
          include: { user: true },
        });
        const __ = await this.prisma.userRole.findFirst({
          where: { userId: _?.user.id, role: { name: RoleEnum.AUTHOR } },
          include: { role: true },
        });
        if (!__) {
          await this.prisma.userRole.create({
            data: {
              user: { connect: { id: _?.user.id } },
              role: { connect: { name: RoleEnum.AUTHOR } },
            },
          });
        }
        const emailHtml = render(
          AcceptForm({
            userFirstName: reqUser.email.split('@')[0],
          }),
        );
        await sendEmail(
          emailHtml,
          form.user.email,
          'Your form has been approved',
        );
      } else {
        const _ = await this.prisma.submitForm.findFirst({
          where: { id },
          include: { user: true },
        });
        const __ = await this.prisma.userRole.findFirst({
          where: { userId: _?.user.id, role: { name: RoleEnum.AUTHOR } },
          include: { role: true },
        });
        if (__ && _) {
          await this.prisma.userRole.deleteMany({
            where: {
              userId: _.user.id,
              role: { name: RoleEnum.AUTHOR },
            },
          });
        }
        const emailHtml = render(
          RejectForm({
            userFirstName: reqUser.email.split('@')[0],
          }),
        );
        await sendEmail(
          emailHtml,
          form.user.email,
          'Your form has been rejected',
        );
      }
      return res.status(200).json(form);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
