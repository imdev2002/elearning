import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import { videoUpload } from '../../configs/multer';
import NotFoundException from '../../exceptions/not-found';
import passport from '../../configs/passport';
import HttpException from '../../exceptions/http-exception';
import { LessonStatus, LessonType, ReqUser, RoleEnum } from '../../global';
import lessonUtil from '../../util/lesson.util';
import checkRoleMiddleware from '../../middlewares/checkRole.middleware';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { DeleteUtil } from '../../util/delete.util';

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
      const lessonType =
        (req.body.lessonType as LessonType) || LessonType.VIDEO;
      if (lessonType === LessonType.VIDEO) {
        if (!req.files) {
          throw new NotFoundException('video', 0);
        }
        let { video, thumbnail } = req.files as any;
        if (!(video.length === 1 && thumbnail.length === 1)) {
          throw new HttpException(400, 'Missing file');
        }
        video = video[0];
        thumbnail = thumbnail[0];
        const { lessonName, descriptionMD } = req.body;
        const lessonNumber = parseInt(req.body.lessonNumber || '0');
        const partId = parseInt(req.body.partId || '0');
        const courseId = parseInt(req.body.courseId || '0');
        const trialAllowed = req.body.trialAllowed === 'true';
        if (
          !lessonName ||
          !lessonNumber ||
          !descriptionMD ||
          !partId ||
          !courseId
        ) {
          throw new HttpException(400, 'Missing fields');
        }
        const duration = (await getVideoDurationInSeconds(video.path)) || 0;
        const lesson = await this.prisma.lesson.create({
          data: {
            lessonName,
            lessonNumber: Number(lessonNumber),
            part: { connect: { id: Number(partId) } },
            trialAllowed: trialAllowed || false,
            descriptionMD,
            duration,
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
        await this.prisma.course.update({
          where: { id: Number(courseId) },
          data: {
            totalDuration: { increment: duration },
          },
        });
      } else if (lessonType === LessonType.TEXT) {
        const { lessonName, descriptionMD, title, content } = req.body;
        const lessonNumber = parseInt(req.body.lessonNumber || '0');
        const partId = parseInt(req.body.partId || '0');
        const courseId = parseInt(req.body.courseId || '0');
        const trialAllowed = req.body.trialAllowed === 'true';
        if (
          !lessonName ||
          !lessonNumber ||
          !descriptionMD ||
          !partId ||
          !courseId
        ) {
          throw new HttpException(400, 'Missing fields');
        }
        const lesson = await this.prisma.lesson.create({
          data: {
            lessonName,
            lessonType: LessonType.TEXT,
            lessonNumber: Number(lessonNumber),
            part: { connect: { id: Number(partId) } },
            trialAllowed: trialAllowed || false,
            descriptionMD,
            title: title || '',
            content: content || '',
            status: LessonStatus.PENDING,
            user: { connect: { id: (req.user as ReqUser).id } },
          },
        });
        const newLesson = await lessonUtil.getLesson(
          this.prisma,
          lesson.id,
          reqUser.id,
        );
        return res.status(200).json(newLesson);
      } else {
        throw new HttpException(400, 'Invalid lesson type');
      }
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
      if (
        !(
          reqUser.id === lesson.userId ||
          reqUser.roles.find((_) => _.role.name === RoleEnum.ADMIN)
        )
      ) {
        throw new HttpException(403, 'Forbidden');
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
      if (lesson.lessonType === LessonType.VIDEO) {
        const { lessonName, lessonNumber, partId, descriptionMD } = req.body;
        let trialAllowed = lesson.trialAllowed;
        if (req.body.trialAllowed) {
          trialAllowed = req.body.trialAllowed === 'true';
        }
        const data: any = {
          lessonName: lessonName || lesson.lessonName,
          lessonNumber: Number(lessonNumber) || lesson.lessonNumber,
          part: { connect: { id: Number(partId || lesson.partId) } },
          trialAllowed: trialAllowed || lesson.trialAllowed,
          descriptionMD: descriptionMD || lesson.descriptionMD,
          status: LessonStatus.PENDING,
        };
        if ((req.files as any)?.video) {
          if ((req.file as any)?.video[0]?.path) {
            const duration = await getVideoDurationInSeconds(
              (req.files as any)?.video[0]?.path,
            );
            data.duration = duration;
            data.videoPath = (req.files as any)?.video[0]?.path;
            data.localPath = (req.files as any)?.video[0]?.filename;
          }
        }
        if ((req.files as any)?.thumbnail) {
          if ((req.files as any)?.thumbnail[0]?.path) {
            data.thumbnailPath = (req.files as any)?.thumbnail[0]?.path;
          }
        }
        await this.prisma.lesson.update({
          where: { id, userId: reqUser.id },
          data,
          include: { part: true },
        });
        const newLesson = await lessonUtil.getLesson(
          this.prisma,
          id,
          reqUser.id,
        );
        return res.status(200).json(newLesson);
      } else if (lesson.lessonType === LessonType.TEXT) {
        const {
          lessonName,
          lessonNumber,
          partId,
          trialAllowed,
          descriptionMD,
          title,
          content,
        } = req.body;

        await this.prisma.lesson.update({
          where: { id, userId: reqUser.id },
          data: {
            lessonName: lessonName || lesson.lessonName,
            lessonNumber: Number(lessonNumber) || lesson.lessonNumber,
            part: { connect: { id: Number(partId || lesson.partId) } },
            trialAllowed: trialAllowed || lesson.trialAllowed,
            descriptionMD: descriptionMD || lesson.descriptionMD,
            status: LessonStatus.PENDING,
            title: title || lesson.title,
            content: content || lesson.content,
          },
          include: { part: true },
        });
        const newLesson = await lessonUtil.getLesson(
          this.prisma,
          id,
          reqUser.id,
        );
        return res.status(200).json(newLesson);
      } else {
        throw new HttpException(400, 'Invalid lesson type');
      }
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
      await DeleteUtil.deleteLesson(id);
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
        include: { part: true },
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
        where: { part: { courseId: lesson.part.courseId } },
        include: { part: true },
      });
      for (const lesson of lessons) {
        if (lesson.status !== LessonStatus.APPROVED) {
          return res.status(200).json(lesson);
        }
      }
      await this.prisma.course.update({
        where: { id: lesson.part.courseId },
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
