import { BaseController } from '../../../abstractions/base.controller';
import { Request, Response } from 'express';
import passport from '../../../configs/passport';
import HttpException from '../../../exceptions/http-exception';
import NotFoundException from '../../../exceptions/not-found';
import {
  CoursedPaidStatus,
  CourseStatus,
  LessonStatus,
  ReqUser,
} from '../../../global';

export default class PublicLessonController extends BaseController {
  public path = '/api/v1-public/lessons';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
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
    this.router.post(
      `${this.path}/actions/done`,
      passport.authenticate('jwt', { session: false }),
      this.doneLessonAction,
    );
    this.router.get(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      this.getLesson,
    );
  }
  heartAction = async (req: Request, res: Response) => {
    try {
      const id = Number(req.body.lessonId);
      const reqUser = req.user as ReqUser;
      const lesson = await this.prisma.lesson.findFirst({
        where: { id },
      });
      if (!lesson) {
        throw new NotFoundException('lesson', id);
      }
      const heart = await this.prisma.heart.findFirst({
        where: { userId: reqUser.id, lessonId: id },
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
          lesson: { connect: { id } },
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
      const id = Number(req.body.lessonId);
      const reqUser = req.user as ReqUser;
      const lesson = await this.prisma.lesson.findFirst({
        where: { id },
      });
      if (!lesson) {
        throw new NotFoundException('lesson', id);
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
            lesson: { connect: { id } },
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
            lesson: { connect: { id } },
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
      const id = Number(req.body.lessonId);
      const reqUser = req.user as ReqUser;
      const lesson = await this.prisma.lesson.findFirst({
        where: { id },
      });
      if (!lesson) {
        throw new NotFoundException('lesson', id);
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
          lessonId: id,
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
          lesson: { connect: { id } },
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
  getLesson = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const id = Number(req.params.id);
      let lesson: any = await this.prisma.lesson.findFirst({
        where: {
          id,
          status: LessonStatus.APPROVED,
          part: { course: { isPublic: true, status: CourseStatus.APPROVED } },
        },
        include: { part: { include: { course: true } } },
      });
      if (!lesson) {
        throw new NotFoundException('lesson', id);
      }
      lesson = await this.prisma.lesson.findFirst({
        where: { id },
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
      });
      return res.status(200).json(lesson);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  doneLessonAction = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const lessonId = Number(req.body.lessonId);
      const lesson = await this.prisma.lesson.findFirst({
        where: { id: lessonId },
        include: { part: true },
      });
      if (!lesson || lesson.status !== LessonStatus.APPROVED) {
        throw new NotFoundException('lesson', lessonId);
      }
      const paid = await this.prisma.coursedPaid.findFirst({
        where: {
          courseId: lesson.part.courseId,
          userId: reqUser.id,
          status: CoursedPaidStatus.SUCCESS,
        },
      });
      if (!paid) {
        throw new HttpException(403, 'You have not paid for this course');
      }
      const done = await this.prisma.lessonDone.findFirst({
        where: { lessonId, userId: reqUser.id },
      });
      if (!done) {
        const done = await this.prisma.lessonDone.create({
          data: {
            lesson: { connect: { id: lessonId } },
            user: { connect: { id: reqUser.id } },
          },
        });
        const parts = await this.prisma.part.findMany({
          where: { courseId: lesson.part.courseId },
        });
        const lessons = await this.prisma.lesson.findMany({
          where: {
            partId: { in: parts.map((_) => _.id) },
            status: LessonStatus.APPROVED,
          },
        });
        const lessonCount = await this.prisma.lesson.count({
          where: {
            part: { courseId: lesson.part.courseId },
            status: LessonStatus.APPROVED,
            userId: reqUser.id,
          },
        });
        if (lessonCount === lessons.length) {
          await this.prisma.courseDone.create({
            data: {
              course: { connect: { id: lesson.part.courseId } },
              user: { connect: { id: reqUser.id } },
            },
          });
        }
        return res.status(200).json(done);
      }
      await this.prisma.lessonDone.deleteMany({
        where: { lessonId, userId: reqUser.id },
      });
      await this.prisma.courseDone.deleteMany({
        where: { courseId: lesson.part.courseId, userId: reqUser.id },
      });
      return res.status(200).json(done);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
