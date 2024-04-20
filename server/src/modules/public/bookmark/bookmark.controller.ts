import { stat } from 'fs';
import { BaseController } from '../../../abstractions/base.controller';
import passport from '../../../configs/passport';
import { Request, Response } from 'express';
import { ReqUser } from '../../../global';
import NotFoundException from '../../../exceptions/not-found';

export default class PublicCourseController extends BaseController {
  public path = '/api/v1-public/bookmarks';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      this.getBookmarks,
    );
    this.router.post(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      this.addBookmark,
    );
    this.router.delete(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      this.removeBookmark,
    );
  }
  getBookmarks = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const userId = reqUser.id;
      const bookmarks = await this.prisma.bookmark.findMany({
        where: { userId },
        orderBy: { timestamp: 'desc' },
      });
      return res.status(200).json(bookmarks);
    } catch (e: any) {
      console.log(e);
      return res.status(e.status || 500).json({
        status: e.status || 500,
        message: e.message || 'Internal Server Error',
      });
    }
  };
  addBookmark = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const userId = reqUser.id;
      const { courseId, lessonId } = req.body;
      let bookmark;
      if (!courseId || isNaN(courseId)) {
        const course = await this.prisma.course.findFirst({
          where: { id: courseId },
        });
        if (!course) {
          throw new NotFoundException('course', courseId);
        }
        const _ = await this.prisma.bookmark.findFirst({
          where: { courseId, userId },
        });
        if (_) {
          throw new Error('Bookmark already exists');
        }
        bookmark = await this.prisma.bookmark.create({
          data: {
            course: { connect: { id: courseId } },
            user: { connect: { id: userId } },
          },
        });
      } else if (!lessonId || isNaN(lessonId)) {
        const lesson = await this.prisma.lesson.findFirst({
          where: { id: lessonId },
        });
        if (!lesson) {
          throw new NotFoundException('lesson', lessonId);
        }
        const _ = await this.prisma.bookmark.findFirst({
          where: { lessonId, userId },
        });
        if (_) {
          throw new Error('Bookmark already exists');
        }
        bookmark = await this.prisma.bookmark.create({
          data: {
            lesson: { connect: { id: lessonId } },
            user: { connect: { id: userId } },
          },
        });
      } else {
        throw new Error('Invalid courseId or lessonId provided');
      }
      return res.status(200).json(bookmark);
    } catch (e: any) {
      console.log(e);
      return res.status(e.status || 500).json({
        status: e.status || 500,
        message: e.message || 'Internal Server Error',
      });
    }
  };
  removeBookmark = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const userId = reqUser.id;
      const { id } = req.params;
      const bookmark = await this.prisma.bookmark.findFirst({
        where: { id: parseInt(id) },
      });
      if (!bookmark) {
        throw new NotFoundException('bookmark', id);
      }
      if (bookmark.userId !== userId) {
        throw new Error('Unauthorized');
      }
      await this.prisma.bookmark.delete({ where: { id: parseInt(id) } });
      return res.status(200).json(bookmark);
    } catch (e: any) {
      console.log(e);
      return res.status(e.status || 500).json({
        status: e.status || 500,
        message: e.message || 'Internal Server Error',
      });
    }
  };
}
