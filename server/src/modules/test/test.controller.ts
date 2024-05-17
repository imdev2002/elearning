import { render } from '@react-email/render';
import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import sendEmail from '../../email/process';
import RejectForm from '../../email/templates/reject';
import AcceptForm from '../../email/templates/accept';
import VerifyEmail from '../../email/templates/verify';
import Welcome from '../../email/templates/welcome';
import ResetPassword from '../../email/templates/reset';

export default class TestController extends BaseController {
  public path = '/api/v1/tests';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}`, this.test);
  }
  test = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      let emailHtml = render(
        RejectForm({
          userFirstName: email.split('@')[0],
        }),
      );
      await sendEmail(emailHtml, email, 'Your form has been rejected');
      emailHtml = render(
        AcceptForm({
          userFirstName: email.split('@')[0],
        }),
      );
      await sendEmail(emailHtml, email, 'Your form has been accepted');
      emailHtml = render(
        VerifyEmail({
          userFirstName: email.split('@')[0],
          verifyLink: `${process.env.PUBLIC_URL}/verify?verify=${'0000000'}`,
        }),
      );
      await sendEmail(emailHtml, email, `Let's verify your email address!`);
      emailHtml = render(Welcome({ userFirstName: email.split('@')[0] }));
      await sendEmail(emailHtml, email, 'Your Adventure Begins with DKE!');
      emailHtml = render(ResetPassword({ newPassword: 'Jjr3#cng' }));
      await sendEmail(emailHtml, email, 'Reset your password');
      return res.status(200).json({ message: 'Email sent' });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
