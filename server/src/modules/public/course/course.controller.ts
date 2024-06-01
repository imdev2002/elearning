import { Request, Response } from 'express';
import { BaseController } from '../../../abstractions/base.controller';
import passport from '../../../configs/passport';
import {
  CourseCategory,
  CourseStatus,
  ReqUser,
  RoleEnum,
} from '../../../global';
import HttpException from '../../../exceptions/http-exception';
import NotFoundException from '../../../exceptions/not-found';
import xtripe from '../../../configs/xtripe';
import { CoursesPaidStatus } from '@prisma/client';
import { JwtPayload, verify } from 'jsonwebtoken';

export default class PublicCourseController extends BaseController {
  public path = '/api/v1-public/courses';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}/actions/buy`,
      passport.authenticate('jwt', { session: false }),
      this.buyAction,
    );
    this.router.post(
      `${this.path}/actions/heart`,
      passport.authenticate('jwt', { session: false }),
      this.heartAction,
    );
    this.router.post(
      `${this.path}/actions/comment`,
      passport.authenticate('jwt', { session: false }),
      this.createCommentAction,
    );
    this.router.patch(
      `${this.path}/actions/comment/:id`,
      passport.authenticate('jwt', { session: false }),
      this.updateCommentAction,
    );
    this.router.delete(
      `${this.path}/actions/comment/:id`,
      passport.authenticate('jwt', { session: false }),
      this.deleteCommentAction,
    );
    this.router.post(
      `${this.path}/actions/emoji`,
      passport.authenticate('jwt', { session: false }),
      this.emojiAction,
    );
    this.router.get(`${this.path}`, this.getCourses);
    this.router.get(`${this.path}/:id`, this.getCourse);
    this.router.post(
      `${this.path}/actions/rate`,
      passport.authenticate('jwt', { session: false }),
      this.rateAction,
    );
  }
  rateAction = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const courseId = parseInt(req.body.courseId);
      if (!courseId || isNaN(courseId)) {
        throw new HttpException(400, 'courseId is missing');
      }
      const course = await this.prisma.course.findFirst({
        where: { id: courseId },
      });
      if (!course) {
        throw new NotFoundException('course', courseId);
      }
      const paid = await this.prisma.coursesPaid.findFirst({
        where: { userId: reqUser.id, courseId },
      });
      if (!paid) {
        throw new HttpException(400, 'You have to buy this course first');
      }
      const star = parseFloat(req.body.star);
      if (!star || isNaN(star) || star < 0 || star > 5) {
        throw new HttpException(400, 'Invalid star');
      }
      const existRate = await this.prisma.rating.findFirst({
        where: { userId: reqUser.id, courseId },
      });
      if (!existRate) {
        await this.prisma.rating.create({
          data: {
            star,
            user: { connect: { id: reqUser.id } },
            course: { connect: { id: courseId } },
          },
        });
        await this.prisma.course.update({
          where: { id: courseId },
          data: { totalRating: { increment: 1 } },
        });
      } else {
        await this.prisma.rating.updateMany({
          where: { userId: reqUser.id, courseId },
          data: {
            star,
          },
        });
      }
      const rates = await this.prisma.rating.findMany({
        where: { courseId },
      });
      const avg =
        rates.reduce((acc, rate) => acc + rate.star, 0) / (rates.length || 1);
      await this.prisma.course.update({
        where: { id: courseId },
        data: { avgRating: avg },
      });
      const _ = await this.prisma.rating.findFirst({
        where: { userId: reqUser.id, courseId },
      });
      return res.status(200).json(_);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  buyAction = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const id = Number(req.body.courseId);
      const course = await this.prisma.course.findFirst({
        where: { id },
        include: { coursesPaid: true },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      if (!course.isPublic || course.status !== CourseStatus.APPROVED) {
        throw new HttpException(403, 'Forbidden');
      }

      const user = await this.prisma.user.findFirst({
        where: { id: reqUser.id },
        include: { coursesPaid: true },
      });
      if (!user) {
        throw new NotFoundException('user', reqUser.id);
      }

      for (const coursePaid of user.coursesPaid) {
        if (coursePaid.courseId === id) {
          throw new HttpException(400, 'You already bought this course');
        }
      }
      if (Number(course.priceAmount) === 0) {
        let uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        while (
          await this.prisma.coursesPaid.findFirst({
            where: { checkoutSessionId: `free-${uniqueSuffix}` },
          })
        ) {
          uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        }
        const _ = await this.prisma.coursesPaid.create({
          data: {
            user: { connect: { id: reqUser.id } },
            course: { connect: { id } },
            status: CoursesPaidStatus.SUCCESS,
            checkoutSessionId: `free-${uniqueSuffix}`,
          },
        });
        return res.status(200).json(_);
      }
      const checkout = await xtripe.checkout.sessions.create({
        line_items: [{ price: course.priceId as string, quantity: 1 }],
        mode: 'payment',
        success_url: `${process.env.PUBLIC_URL}`,
      });
      await this.prisma.coursesPaid.create({
        data: {
          user: { connect: { id: reqUser.id } },
          course: { connect: { id } },
          checkoutSessionId: checkout.id,
        },
      });
      return res.status(200).json(checkout);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  heartAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.body.courseId);
      const reqUser = req.user as ReqUser;
      const course = await this.prisma.course.findFirst({
        where: { id },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      const heart = await this.prisma.heart.findFirst({
        where: { userId: reqUser.id, courseId: id },
      });

      if (heart) {
        await this.prisma.heart.delete({
          where: {
            id: heart.id,
          },
        });
        return res.status(200).json(heart);
      }
      const newHeart = await this.prisma.heart.create({
        data: {
          user: { connect: { id: reqUser.id } },
          course: { connect: { id } },
        },
      });

      return res.status(200).json(newHeart);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  createCommentAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.body.courseId);
      const reqUser = req.user as ReqUser;
      const course = await this.prisma.course.findFirst({
        where: { id },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      const { content, level } = req.body;
      if (!content) {
        throw new HttpException(400, 'Where tf is your comment content');
      }
      let comment;
      if (level === 0) {
        comment = await this.prisma.comment.create({
          data: {
            content,
            user: { connect: { id: reqUser.id } },
            course: { connect: { id } },
            level: 0,
          },
        });
      } else if (level === 1 || level === 2) {
        const { parentId } = req.body;
        if (!(parentId || parentId == 0)) {
          throw new HttpException(400, 'parentId is missing');
        }
        comment = await this.prisma.comment.create({
          data: {
            content,
            user: { connect: { id: reqUser.id } },
            course: { connect: { id } },
            parent: { connect: { id: parentId } },
            level,
          },
        });
      } else {
        throw new HttpException(400, 'Invalid level');
      }
      return res.status(200).json(comment);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  updateCommentAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const reqUser = req.user as ReqUser;
      const comment = await this.prisma.comment.findFirst({ where: { id } });
      if (!comment) {
        throw new NotFoundException('comment', id);
      }
      if (comment.userId !== reqUser.id) {
        throw new HttpException(401, 'Unauthorized');
      }
      const { content } = req.body;
      await this.prisma.comment.update({ where: { id }, data: { content } });
      const newComment = await this.prisma.comment.findFirst({ where: { id } });
      return res.status(200).json(newComment);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  deleteCommentAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const reqUser = req.user as ReqUser;
      const comment = await this.prisma.comment.findFirst({
        where: { id },
        include: { children: { include: { children: true } } },
      });
      if (!comment) {
        throw new NotFoundException('comment', id);
      }
      if (comment.userId !== reqUser.id) {
        throw new HttpException(401, 'Unauthorized');
      }
      if (comment.level === 0) {
        const comments = await this.prisma.comment.findMany({
          where: { parentId: id },
        });
        for (const comment of comments) {
          await this.prisma.comment.deleteMany({
            where: { parentId: comment.id },
          });
          await this.prisma.comment.delete({ where: { id: comment.id } });
        }
        await this.prisma.comment.delete({ where: { id } });
      } else if (comment.level === 1) {
        await this.prisma.comment.deleteMany({
          where: { parentId: id },
        });
        await this.prisma.comment.delete({
          where: { id },
        });
      } else if (comment.level === 2) {
        await this.prisma.comment.delete({
          where: { id },
        });
      }
      return res.status(200).json(comment);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  emojiAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.body.courseId);
      const reqUser = req.user as ReqUser;
      const course = await this.prisma.course.findFirst({
        where: { id },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      const { emojiIconId } = req.body;
      const emojiIcon = await this.prisma.emojiIcon.findFirst({
        where: { id: emojiIconId },
      });
      if (!emojiIcon) {
        throw new NotFoundException('emoji icon', emojiIconId);
      }
      const emoji = await this.prisma.emoji.findFirst({
        where: {
          emojiId: emojiIconId,
          userId: reqUser.id,
          courseId: id,
        },
      });
      if (emoji) {
        await this.prisma.emoji.delete({
          where: {
            id: emoji.id,
          },
        });
        return res.status(200).json(emoji);
      }
      const newEmoji = await this.prisma.emoji.create({
        data: {
          emoji: { connect: { id: emojiIconId } },
          user: { connect: { id: reqUser.id } },
          course: { connect: { id } },
        },
      });

      return res.status(200).json(newEmoji);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getCourses = async (req: Request, res: Response) => {
    try {
      const limit = Number(req.query.limit) || 12;
      const offset = Number(req.query.offset) || 0;
      const search = req.query.search as string;
      const categories = req.query.categories || '';
      const orderBy = (req.query.orderBy as string) || 'timestamp';
      const direction = (req.query.direction as 'asc' | 'desc') || 'desc';
      const isBestSeller = req.query.isBestSeller === 'true';
      const myOwn = req.query.myOwn === 'true';
      const byAuthor = Number(req.query.byAuthor) || -1;

      const query: any = {
        where: {
          isPublic: true,
          status: CourseStatus.APPROVED,
        },

        orderBy: [
          {
            [orderBy]: direction,
          },
        ],
      };
      if (categories) {
        const category = String(categories).split(',') as CourseCategory[];
        query.where.category = {
          in: category,
        };
      }
      if (byAuthor !== -1) {
        query.where.userId = byAuthor;
      }
      if (myOwn) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).send('No token provided');
        }
        const reqUser = (
          verify(token, process.env.SECRET as string) as JwtPayload
        ).user as ReqUser;
        if (!reqUser.roles.some((_) => _.role.name === RoleEnum.AUTHOR)) {
          throw new HttpException(403, 'Forbidden');
        }
        query.where.userId = reqUser.id;
        query.where.isPublic = undefined;
        query.where.status = undefined;
      }
      if (search) {
        query.where.OR = [
          {
            courseName: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            descriptionMD: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            user: { firstName: { contains: search, mode: 'insensitive' } },
          },
          {
            user: { lastName: { contains: search, mode: 'insensitive' } },
          },
        ];
      }
      const total = await this.prisma.course.count({
        where: { ...query.where },
      });
      if (!isBestSeller) {
        query.take = limit;
        query.skip = offset;
      }

      const courses = await this.prisma.course.findMany({
        ...query,
        include: {
          rating: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          coursesPaid: {
            where: { status: CoursesPaidStatus.SUCCESS },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          hearts: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          emojis: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          parts: {
            include: {
              lessons: {
                include: {
                  comments: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          email: true,
                          avatar: true,
                        },
                      },
                    },
                  },
                  hearts: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          email: true,
                          avatar: true,
                        },
                      },
                    },
                  },
                  emojis: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          email: true,
                          avatar: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      let bestSellerCourses = [] as any[];
      if (isBestSeller) {
        courses.sort((a: any, b: any) => {
          return b.coursesPaid.length - a.coursesPaid.length;
        });
        bestSellerCourses = courses.slice(offset, offset + limit);
      }
      return res.status(200).json({
        courses: isBestSeller ? bestSellerCourses : courses,
        total,
        page: offset / limit + 1,
        limit,
      });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getCourse = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const course = await this.prisma.course.findFirst({
        where: { id, isPublic: true, status: CourseStatus.APPROVED },
        include: {
          rating: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          coursesPaid: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          hearts: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          emojis: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatar: true,
                },
              },
            },
          },
          parts: {
            include: {
              lessons: {
                include: {
                  comments: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          email: true,
                          avatar: true,
                        },
                      },
                    },
                  },
                  hearts: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          email: true,
                          avatar: true,
                        },
                      },
                    },
                  },
                  emojis: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          firstName: true,
                          lastName: true,
                          email: true,
                          avatar: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      if (!course) {
        throw new NotFoundException('course', id);
      }
      return res.status(200).json(course);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
