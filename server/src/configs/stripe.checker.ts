import { CronJob } from 'cron';
import xtripe from './xtripe';
import stripeUtil from '../util/stripe.util';
import { CoursesPaidStatus } from '../global';

const StripeChecker = new CronJob(
  '0 */5 * * * *',
  async function () {
    const coursesPaids = await stripeUtil.prisma.coursesPaid.findMany({
      where: { status: { not: CoursesPaidStatus.SUCCESS } },
    });
    for (const _ of coursesPaids) {
      const session = await xtripe.checkout.sessions.retrieve(
        _.checkoutSessionId as string,
      );
      if (session.payment_status === 'paid') {
        await stripeUtil.checkoutSessionAsyncPaymentSucceeded(session);
        continue;
      }
      if (session.payment_status === 'unpaid') {
        if (session.expires_at > Date.now()) {
          return await stripeUtil.checkoutSessionExpired(session);
        }
        await stripeUtil.checkoutSessionAsyncPaymentFailed(session);
      }
    }
  },
  null,
  false,
);

export default StripeChecker;
