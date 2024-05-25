import { BaseController } from '../../../abstractions/base.controller';
import passport from '../../../configs/passport';
import { Request, Response } from 'express';
import { CoursesPaidStatus, CourseStatus, ReqUser } from '../../../global';
import NotFoundException from '../../../exceptions/not-found';
import HttpException from '../../../exceptions/http-exception';
import xtripe from '../../../configs/xtripe';

export default class CartController extends BaseController {
  public path = '/api/v1-public/carts';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      this.getCart,
    );
    this.router.post(
      `${this.path}/actions/add`,
      passport.authenticate('jwt', { session: false }),
      this.addToCart,
    );
    this.router.post(
      `${this.path}/actions/remove`,
      passport.authenticate('jwt', { session: false }),
      this.removeFromCart,
    );
    this.router.post(
      `${this.path}/actions/clear`,
      passport.authenticate('jwt', { session: false }),
      this.clearCart,
    );
    this.router.post(
      `${this.path}/actions/checkout`,
      passport.authenticate('jwt', { session: false }),
      this.checkout,
    );
  }
  addToCart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const cart = await this.prisma.cart.findFirst({
        where: { userId: reqUser.id },
      });
      if (!cart) {
        throw new NotFoundException('cart', reqUser.id);
      }
      const courseId = parseInt(req.body.courseId || '-1');
      if (courseId === -1) {
        throw new HttpException(400, 'Course id is required');
      }
      const course = await this.prisma.course.findFirst({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('course', courseId);
      }
      if (course.status !== CourseStatus.APPROVED) {
        throw new HttpException(400, 'Course is not approved');
      }
      const cOC = await this.prisma.coursesOnCarts.findFirst({
        where: { cartId: cart.id, courseId },
      });
      if (cOC) {
        throw new Error('Course already added to cart');
      }
      const isBought = await this.prisma.coursesPaid.findFirst({
        where: {
          courseId,
          userId: reqUser.id,
          status: CoursesPaidStatus.SUCCESS,
        },
      });
      if (isBought) {
        throw new HttpException(400, 'Course already bought');
      }
      await this.prisma.coursesOnCarts.create({
        data: {
          cart: { connect: { id: cart.id } },
          course: { connect: { id: courseId } },
        },
      });
      const _ = await this.prisma.cart.findUnique({
        where: { id: cart.id },
        include: { coursesOnCarts: { include: { course: true } } },
      });
      return res.status(201).json(_);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  removeFromCart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const cart = await this.prisma.cart.findFirst({
        where: { userId: reqUser.id },
      });
      if (!cart) {
        throw new NotFoundException('cart', reqUser.id);
      }
      const { courseIds } = req.body;
      for (const __ of courseIds) {
        const courseId = parseInt(__);
        const course = await this.prisma.course.findFirst({
          where: { id: courseId },
        });
        if (!course) {
          continue;
        }
        const cOC = await this.prisma.coursesOnCarts.findFirst({
          where: { cartId: cart.id, courseId },
        });
        if (!cOC) {
          continue;
        }
        await this.prisma.coursesOnCarts.deleteMany({
          where: { cartId: cart.id, courseId },
        });
      }

      const _ = await this.prisma.cart.findUnique({
        where: { id: cart.id },
        include: { coursesOnCarts: { include: { course: true } } },
      });
      return res.status(200).json(_);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  clearCart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const cart = await this.prisma.cart.findFirst({
        where: { userId: reqUser.id },
      });
      if (!cart) {
        throw new NotFoundException('cart', reqUser.id);
      }
      await this.prisma.coursesOnCarts.deleteMany({
        where: { cartId: cart.id },
      });
      const _ = await this.prisma.cart.findUnique({
        where: { id: cart.id },
        include: { coursesOnCarts: { include: { course: true } } },
      });
      return res.status(200).json(_);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getCart = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const cart = await this.prisma.cart.findFirst({
        where: { userId: reqUser.id },
        include: { coursesOnCarts: { include: { course: true } } },
      });
      if (!cart) {
        throw new NotFoundException('cart', reqUser.id);
      }
      return res.status(200).json(cart);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  checkout = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const cart = await this.prisma.cart.findFirst({
        where: { userId: reqUser.id },
        include: { coursesOnCarts: { include: { course: true } } },
      });
      if (!cart) {
        throw new NotFoundException('cart', reqUser.id);
      }
      if (cart.coursesOnCarts.length === 0) {
        throw new HttpException(400, 'Cart is empty');
      }
      let { courseIds } = req.body;
      if (courseIds instanceof String) {
        courseIds = JSON.parse(courseIds as string);
      }
      const gonnaCheckout = [];
      for (const _ of courseIds) {
        const courseId = parseInt(_);
        const course = await this.prisma.course.findFirst({
          where: { id: courseId },
        });
        if (!course) {
          continue;
        }
        if (course.status !== CourseStatus.APPROVED) {
          continue;
        }
        const cOC = await this.prisma.coursesOnCarts.findFirst({
          where: { cartId: cart.id, courseId },
        });
        if (!cOC) {
          continue;
        }
        const isBought = await this.prisma.coursesPaid.findFirst({
          where: {
            courseId: courseId,
            userId: reqUser.id,
            status: CoursesPaidStatus.SUCCESS,
          },
        });
        if (isBought) {
          continue;
        }
        await this.prisma.coursesOnCarts.deleteMany({
          where: { cartId: cart.id, courseId },
        });
        gonnaCheckout.push(course);
      }
      if (gonnaCheckout.length === 0) {
        throw new HttpException(400, 'No course to checkout');
      }
      for (let i = 0; i < gonnaCheckout.length; i++) {
        const _ = gonnaCheckout[i];
        if (_.priceAmount !== 0) {
          continue;
        }
        let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        while (
          await this.prisma.coursesPaid.findFirst({
            where: { checkoutSessionId: `free-${uniqueSuffix}` },
          })
        ) {
          uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        }
        await this.prisma.coursesPaid.create({
          data: {
            course: { connect: { id: _.id } },
            user: { connect: { id: reqUser.id } },
            checkoutSessionId: `free-${uniqueSuffix}`,
            status: CoursesPaidStatus.SUCCESS,
          },
        });
        const cOC = await this.prisma.coursesOnCarts.findFirst({
          where: { courseId: _.id, cartId: cart.id },
        });
        if (cOC) {
          await this.prisma.coursesOnCarts.deleteMany({
            where: { courseId: _.id, cartId: cart.id },
          });
        }
        gonnaCheckout.splice(i, 1);
      }
      const line_items = gonnaCheckout.map((_) => ({
        price: _.priceId as string,
        quantity: 1,
      }));
      const checkout = await xtripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${process.env.PUBLIC_URL}`,
      });
      for (const _ of gonnaCheckout) {
        await this.prisma.coursesPaid.create({
          data: {
            course: { connect: { id: _.id } },
            user: { connect: { id: reqUser.id } },
            checkoutSessionId: checkout.id,
            status: CoursesPaidStatus.PENDING,
          },
        });
        const cOC = await this.prisma.coursesOnCarts.findFirst({
          where: { courseId: _.id, cartId: cart.id },
        });
        if (cOC) {
          await this.prisma.coursesOnCarts.deleteMany({
            where: { courseId: _.id, cartId: cart.id },
          });
        }
      }
      return res.status(201).json(checkout);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
