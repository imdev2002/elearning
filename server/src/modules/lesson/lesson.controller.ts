import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import { videoUpload } from '../../configs/multer';
import NotFoundException from '../../exceptions/not-found';
import passport from '../../configs/passport';
import HttpException from '../../exceptions/http-exception';
import { LessonStatus, ReqUser, RoleEnum } from '../../global';
import path from 'path';
import { createReadStream, statSync } from 'fs';
import lessonUtil from '../../util/lesson.util';
import checkRoleMiddleware from '../../middlewares/checkRole.middleware';
import courseUtil from '../../util/course.util';

export default class LessonController extends BaseController {
  public path = '/api/v1/lessons';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
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
    this.router.patch(
      `${this.path}/:id/actions/approve`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN]),
      this.approveLesson,
    );
  }

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
  approveLesson = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const lesson = await this.prisma.lesson.findFirst({
        where: { id },
      });
      if (!lesson) {
        throw new NotFoundException('lesson', id);
      }
      await this.prisma.lesson.update({
        where: { id },
        data: {
          status: LessonStatus.APPROVED,
        },
      });
      const lessons = await this.prisma.lesson.findMany({
        where: { courseId: lesson.courseId },
      });
      for (const lesson of lessons) {
        if (lesson.status !== LessonStatus.APPROVED) {
          return res.status(200).json(lesson);
        }
      }
      await this.prisma.course.update({
        where: { id: lesson.courseId },
        data: { status: LessonStatus.APPROVED },
      });
      return res.status(200).json(lessons);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
