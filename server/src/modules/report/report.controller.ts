import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import passport from '../../configs/passport';
import {
  CoursesPaidStatus,
  CourseStatus,
  ReqUser,
  RoleEnum,
} from '../../global';
import checkRoleMiddleware from '../../middlewares/checkRole.middleware';
import DataUtil from '../../util/data.util';

export default class ReportController extends BaseController {
  public path = '/api/v1/reports';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}/total`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN]),
      this.getTotalReport,
    );
    this.router.get(
      `${this.path}/authors`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN]),
      this.getReportByAuthors,
    );
    this.router.get(
      `${this.path}/courses/stars`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.AUTHOR]),
      this.getReportByCoursesStar,
    );
  }
  getTotalReport = async (req: Request, res: Response) => {
    try {
      const groupBy = req.query.groupBy as string;
      const startDate = (req.query.startDate as string) || 0;
      const endDate = (req.query.endDate as string) || Date.now();

      const courses = await this.prisma.course.findMany({
        where: {
          status: CourseStatus.APPROVED,
          coursesPaid: { some: { status: CoursesPaidStatus.SUCCESS } },
        },
        include: {
          coursesPaid: {
            where: {
              status: CoursesPaidStatus.SUCCESS,
              updatedAt: { gte: new Date(startDate), lte: new Date(endDate) },
            },
            orderBy: { updatedAt: 'desc' },
          },
        },
      });
      if (groupBy === 'day') {
        const result = courses.reduce((acc: any, course) => {
          const date = course.coursesPaid[0].updatedAt
            .toISOString()
            .split('T')[0];
          if (!acc[date]) {
            acc[date] = { total: 0, revenue: 0.0 };
          }
          const length = course.coursesPaid.filter(
            (cp) => cp.updatedAt.toISOString().split('T')[0] === date,
          ).length;
          acc[date].total += length;
          acc[date].revenue += length * course.priceAmount;
          return acc;
        }, {});
        return res.status(200).json(result);
      }
      if (groupBy === 'month') {
        const result = courses.reduce((acc: any, course) => {
          const date = course.coursesPaid[0].updatedAt
            .toISOString()
            .split('T')[0]
            .slice(0, 7);
          if (!acc[date]) {
            acc[date] = { total: 0, revenue: 0.0 };
          }
          const length = course.coursesPaid.filter(
            (cp) =>
              cp.updatedAt.toISOString().split('T')[0].slice(0, 7) === date,
          ).length;
          acc[date].total += length;
          acc[date].revenue += length * course.priceAmount;
          return acc;
        }, {});
        return res.status(200).json(result);
      }
      if (groupBy === 'year') {
        const result = courses.reduce((acc: any, course) => {
          const date = course.coursesPaid[0].updatedAt
            .toISOString()
            .split('T')[0]
            .slice(0, 4);
          if (!acc[date]) {
            acc[date] = { total: 0, revenue: 0.0 };
          }
          const length = course.coursesPaid.filter(
            (cp) =>
              cp.updatedAt.toISOString().split('T')[0].slice(0, 4) === date,
          ).length;
          acc[date].total += length;
          acc[date].revenue += length * course.priceAmount;
          return acc;
        }, {});
        return res.status(200).json(result);
      }
      return res.status(200).json({});
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getReportByAuthors = async (req: Request, res: Response) => {
    try {
      const authors = await this.prisma.user.findMany({
        where: { roles: { some: { role: { name: RoleEnum.AUTHOR } } } },
      });
      const groupBy = req.query.groupBy as string;
      const startDate = (req.query.startDate as string) || 0;
      const endDate = (req.query.endDate as string) || Date.now();
      const limit = parseInt((req.query.limit as string) || '5');

      if (groupBy === 'day') {
        const authorIds = authors.map((author) => author.id);
        const courses = await this.prisma.course.findMany({
          where: {
            status: CourseStatus.APPROVED,
            coursesPaid: { some: { status: CoursesPaidStatus.SUCCESS } },
            userId: { in: authorIds },
          },
          include: {
            user: true,
            coursesPaid: {
              where: {
                status: CoursesPaidStatus.SUCCESS,
                updatedAt: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
              orderBy: { updatedAt: 'desc' },
            },
          },
        });
        const result = courses.reduce((acc: any, course) => {
          const date = course.coursesPaid[0].updatedAt
            .toISOString()
            .split('T')[0];
          if (!acc[date]) {
            acc[date] = {};
          }
          if (!acc[date][course.userId]) {
            acc[date][course.userId] = {
              author: {
                firstName: course.user.firstName,
                lastName: course.user.lastName,
                avatar: course.user.avatar,
                email: course.user.email,
              },
              total: 0,
              revenue: 0.0,
            };
          }
          const length = course.coursesPaid.filter(
            (cp) => cp.updatedAt.toISOString().split('T')[0] === date,
          ).length;
          acc[date][course.userId].total += length;
          acc[date][course.userId].revenue += length * course.priceAmount;
          return acc;
        }, {});
        return res
          .status(200)
          .json(DataUtil.processAuthorReport(result, limit));
      }
      if (groupBy === 'month') {
        const authorIds = authors.map((author) => author.id);
        const courses = await this.prisma.course.findMany({
          where: {
            status: CourseStatus.APPROVED,
            coursesPaid: { some: { status: CoursesPaidStatus.SUCCESS } },
            userId: { in: authorIds },
          },
          include: {
            user: true,
            coursesPaid: {
              where: {
                status: CoursesPaidStatus.SUCCESS,
                updatedAt: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
              orderBy: { updatedAt: 'desc' },
            },
          },
        });
        const result = courses.reduce((acc: any, course) => {
          const date = course.coursesPaid[0].updatedAt
            .toISOString()
            .split('T')[0]
            .slice(0, 7);
          if (!acc[date]) {
            acc[date] = {};
          }
          if (!acc[date][course.userId]) {
            acc[date][course.userId] = {
              author: {
                firstName: course.user.firstName,
                lastName: course.user.lastName,
                avatar: course.user.avatar,
                email: course.user.email,
              },
              total: 0,
              revenue: 0.0,
            };
          }
          const length = course.coursesPaid.filter(
            (cp) =>
              cp.updatedAt.toISOString().split('T')[0].slice(0, 7) === date,
          ).length;
          acc[date][course.userId].total += length;
          acc[date][course.userId].revenue += length * course.priceAmount;
          return acc;
        }, {});
        return res
          .status(200)
          .json(DataUtil.processAuthorReport(result, limit));
      }
      if (groupBy === 'year') {
        const authorIds = authors.map((author) => author.id);
        const courses = await this.prisma.course.findMany({
          where: {
            status: CourseStatus.APPROVED,
            coursesPaid: { some: { status: CoursesPaidStatus.SUCCESS } },
            userId: { in: authorIds },
          },
          include: {
            user: true,
            coursesPaid: {
              where: {
                status: CoursesPaidStatus.SUCCESS,
                updatedAt: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
              orderBy: { updatedAt: 'desc' },
            },
          },
        });
        const result = courses.reduce((acc: any, course) => {
          const date = course.coursesPaid[0].updatedAt
            .toISOString()
            .split('T')[0]
            .slice(0, 4);
          if (!acc[date]) {
            acc[date] = {};
          }
          if (!acc[date][course.userId]) {
            acc[date][course.userId] = {
              author: {
                firstName: course.user.firstName,
                lastName: course.user.lastName,
                avatar: course.user.avatar,
                email: course.user.email,
              },
              total: 0,
              revenue: 0.0,
            };
          }
          const length = course.coursesPaid.filter(
            (cp) =>
              cp.updatedAt.toISOString().split('T')[0].slice(0, 4) === date,
          ).length;
          acc[date][course.userId].total += length;
          acc[date][course.userId].revenue += length * course.priceAmount;
          return acc;
        }, {});
        return res
          .status(200)
          .json(DataUtil.processAuthorReport(result, limit));
      }
      return res.status(200).json({});
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getReportByCoursesStar = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const courses = await this.prisma.course.findMany({
        where: { userId: reqUser.id, status: CourseStatus.APPROVED },
      });
      const coursesIds = courses.map((course) => course.id);
      const stars = await this.prisma.rating.findMany({
        where: { courseId: { in: coursesIds } },
        include: { course: true },
      });
      const result = stars.reduce((acc: any, star) => {
        if (!acc[star.courseId]) {
          acc[star.courseId] = [
            { star: 1, total: 0 },
            { star: 2, total: 0 },
            { star: 3, total: 0 },
            { star: 4, total: 0 },
            { star: 5, total: 0 },
            { avgStar: 0, total: 0 },
          ];
        }
        acc[star.courseId][star.star - 1].total += 1;
        acc[star.courseId][5].total = star.course.totalRating;
        acc[star.courseId][5].avgStar = star.course.avgRating;
        return acc;
      }, {});
      return res
        .status(200)
        .json(await DataUtil.processStarReport(result, this.prisma));
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
