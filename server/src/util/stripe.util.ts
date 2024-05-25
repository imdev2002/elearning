import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';
import { CoursesPaidStatus } from '../global';

const stripeUtil = {
  prisma: new PrismaClient(),
  checkoutSessionAsyncPaymentFailed: async (
    checkoutSessionAsyncPaymentFailed: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.async_payment_failed
    const checkoutSessionId = checkoutSessionAsyncPaymentFailed.id;
    const coursesPaid = await stripeUtil.prisma.coursesPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursesPaid) {
      return;
    }
    await stripeUtil.prisma.coursesPaid.updateMany({
      where: { checkoutSessionId: checkoutSessionId },
      data: { status: CoursesPaidStatus.FAILED },
    });
  },
  checkoutSessionAsyncPaymentSucceeded: async (
    checkoutSessionAsyncPaymentSucceeded: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.async_payment_succeeded
    const checkoutSessionId = checkoutSessionAsyncPaymentSucceeded.id;
    const coursesPaid = await stripeUtil.prisma.coursesPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursesPaid) {
      return;
    }
    await stripeUtil.prisma.coursesPaid.updateMany({
      where: { checkoutSessionId: checkoutSessionId },
      data: { status: CoursesPaidStatus.SUCCESS },
    });
  },
  checkoutSessionCompleted: async (
    checkoutSessionCompleted: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.completed
    const checkoutSessionId = checkoutSessionCompleted.id;

    const coursesPaid = await stripeUtil.prisma.coursesPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursesPaid) {
      return;
    }
    await stripeUtil.prisma.coursesPaid.updateMany({
      where: { checkoutSessionId: checkoutSessionId },
      data: { status: CoursesPaidStatus.SUCCESS },
    });
  },
  checkoutSessionExpired: async (
    checkoutSessionExpired: Stripe.Checkout.Session,
  ) => {
    // Then define and call a function to handle the event checkout.session.expired
    const checkoutSessionId = checkoutSessionExpired.id;

    const coursesPaid = await stripeUtil.prisma.coursesPaid.findFirst({
      where: { checkoutSessionId: checkoutSessionId },
    });
    if (!coursesPaid) {
      return;
    }
    await stripeUtil.prisma.coursesPaid.updateMany({
      where: { checkoutSessionId: checkoutSessionId },
      data: { status: CoursesPaidStatus.EXPIRED },
    });
  },
};

export default stripeUtil;
