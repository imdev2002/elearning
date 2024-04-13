import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import { videoUpload } from '../../configs/multer';
import NotFoundException from '../../exceptions/not-found';
import passport from '../../configs/passport';
import HttpException from '../../exceptions/http-exception';
import { LessonStatus, ReqUser } from '../../global';
import path from 'path';
import { createReadStream, statSync } from 'fs';
import lessonUtil from '../../util/lesson.util';

export default class LessonController extends BaseController {
  public path = '/api/v1/lessons';

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
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      videoUpload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ]),
      this.createLesson,
    );
    this.router.get(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      this.getLessons,
    );
    this.router.get(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      this.getLesson,
    );
    this.router.patch(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      videoUpload.fields([
        { name: 'video', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ]),
      this.updateLesson,
    );
    this.router.delete(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      this.deleteLesson,
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
  createLesson = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      if (!req.files) {
        throw new NotFoundException('video', 0);
      }
      let { video, thumbnail } = req.files as any;
      if (!(video.length === 1 && thumbnail.length === 1)) {
        throw new HttpException(400, 'Missing file');
      }
      video = video[0];
      thumbnail = thumbnail[0];
      const {
        lessonName,
        lessonNumber,
        partNumber,
        trialAllowed,
        descriptionMD,
        courseId,
      } = req.body;
      if (
        !lessonName ||
        !lessonNumber ||
        !descriptionMD ||
        !partNumber ||
        !courseId
      ) {
        throw new HttpException(400, 'Missing fields');
      }
      const lesson = await this.prisma.lesson.create({
        data: {
          lessonName,
          lessonNumber: Number(lessonNumber),
          partNumber: Number(partNumber),
          trialAllowed: trialAllowed || false,
          descriptionMD,
          course: { connect: { id: Number(courseId) } },
          status: LessonStatus.PENDING,
          localPath: video.path,
          thumbnailPath: thumbnail.path,
          filename: video.filename,
          user: { connect: { id: (req.user as ReqUser).id } },
        },
      });
      const newLesson = await lessonUtil.getLesson(
        this.prisma,
        lesson.id,
        reqUser.id,
      );
      res.status(200).json(newLesson);
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
      const lesson = await lessonUtil.getLesson(this.prisma, id, reqUser.id);
      if (!lesson) {
        throw new NotFoundException('lesson', id);
      }
      return res.status(200).json(lesson);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getLessons = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const limit = Number(req.query.limit) || 12;
      const offset = Number(req.query.offset) || 0;
      const lessons = await lessonUtil.getLessons(
        this.prisma,
        reqUser.id,
        limit,
        offset,
      );
      res.status(200).json(lessons);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  updateLesson = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const id = Number(req.params.id);
      const lesson = await this.prisma.lesson.findUnique({
        where: { id, userId: reqUser.id },
      });
      if (!lesson) {
        throw new NotFoundException('lesson', id);
      }
      const {
        lessonName,
        lessonNumber,
        partNumber,
        trialAllowed,
        descriptionMD,
      } = req.body;

      await this.prisma.lesson.update({
        where: { id, userId: reqUser.id },
        data: {
          lessonName: lessonName || lesson.lessonName,
          lessonNumber: Number(lessonNumber) || lesson.lessonNumber,
          partNumber: Number(partNumber) || lesson.partNumber,
          trialAllowed: trialAllowed || lesson.trialAllowed,
          descriptionMD: descriptionMD || lesson.descriptionMD,
          status: LessonStatus.PENDING,
          localPath: (req.file as any)?.video[0]?.path || lesson.localPath,
          thumbnailPath:
            (req.file as any)?.thumbnail[0]?.path || lesson.thumbnailPath,
          filename: (req.file as any)?.video[0]?.filename || lesson.filename,
        },
      });
      const newLesson = await lessonUtil.getLesson(this.prisma, id, reqUser.id);
      res.status(200).json(newLesson);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  deleteLesson = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const id = Number(req.params.id);
      const lesson = await lessonUtil.getLesson(this.prisma, id, reqUser.id);
      if (!lesson) {
        throw new NotFoundException('lesson', id);
      }
      return res.status(200).json(lesson);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
