import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { CoursedPaidStatus } from '../global';

const stripeUtil = {
  prisma: new PrismaClient(),
  checkoutSessionAsyncPaymentFailed: async (
    checkoutSessionAsyncPaymentFailed: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.async_payment_failed
    const checkoutSessionId = checkoutSessionAsyncPaymentFailed.id;
    const coursedPaid = await stripeUtil.prisma.coursedPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursedPaid) {
      return;
    }
    // await stripeUtil.prisma.coursedPaid.updateMany({
    //   where: { checkoutSessionId: checkoutSessionId },
    //   data: { status: CoursedPaidStatus.FAILED },
    // });
    await stripeUtil.prisma.coursedPaid.deleteMany({
      where: { checkoutSessionId: checkoutSessionId },
    });
  },
  checkoutSessionAsyncPaymentSucceeded: async (
    checkoutSessionAsyncPaymentSucceeded: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.async_payment_succeeded
    const checkoutSessionId = checkoutSessionAsyncPaymentSucceeded.id;
    const coursedPaid = await stripeUtil.prisma.coursedPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursedPaid) {
      return;
    }
    await stripeUtil.prisma.coursedPaid.updateMany({
      where: { checkoutSessionId: checkoutSessionId },
      data: { status: CoursedPaidStatus.SUCCESS },
    });
  },
  checkoutSessionCompleted: async (
    checkoutSessionCompleted: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.completed
    const checkoutSessionId = checkoutSessionCompleted.id;

    const coursedPaid = await stripeUtil.prisma.coursedPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursedPaid) {
      return;
    }
    await stripeUtil.prisma.coursedPaid.updateMany({
      where: { checkoutSessionId: checkoutSessionId },
      data: { status: CoursedPaidStatus.SUCCESS },
    });
  },
  checkoutSessionExpired: async (
    checkoutSessionExpired: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.expired
    const checkoutSessionId = checkoutSessionExpired.id;

    const coursedPaid = await stripeUtil.prisma.coursedPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursedPaid) {
      return;
    }
    // await stripeUtil.prisma.coursedPaid.updateMany({
    //   where: { checkoutSessionId: checkoutSessionId },
    //   data: { status: CoursedPaidStatus.EXPIRED },
    // });
    await stripeUtil.prisma.coursedPaid.deleteMany({
      where: { checkoutSessionId: checkoutSessionId },
    });
  },
};

export default stripeUtil;
