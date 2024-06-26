import express, { NextFunction, Request, Response } from 'express';
import { BaseController } from './abstractions/base.controller';
import UserController from './modules/user/user.controller';
import errorMiddleware from './middlewares/error.middleware';
import AuthController from './modules/auth/auth.controller';
import cors from 'cors';
import EmojiController from './modules/emoji/emoji.controller';
import CourseController from './modules/course/course.controller';
import LessonController from './modules/lesson/lesson.controller';
import FileController from './modules/file/file.controller';
import PublicCourseController from './modules/public/course/course.controller';
import PublicLessonController from './modules/public/lesson/lesson.controller';
import FormController from './modules/form/form.controller';
import BookmarkController from './modules/public/bookmark/bookmark.controller';
import TestController from './modules/test/test.controller';
import CartController from './modules/public/cart/cart.controller';
import ReportController from './modules/report/report.controller';

const controllers = [
  new UserController(),
  new AuthController(),
  new EmojiController(),
  new CourseController(),
  new LessonController(),
  new FileController(),
  new PublicCourseController(),
  new PublicLessonController(),
  new FormController(),
  new BookmarkController(),
  new TestController(),
  new CartController(),
  new ReportController(),
];

class App {
  public app: express.Application;
  public port: number | string;

  constructor(port: number | string) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded());
    this.app.use(cors());
  }

  private initializeErrorHandling() {
    this.app.use(this.errorHandle);
    this.app.use(errorMiddleware);
  }

  private errorHandle(req: Request, res: Response, next: NextFunction) {
    try {
    } catch (e: any) {
      next(e);
    }
  }

  private initializeControllers(controllers: BaseController[]) {
    this.app.get('/', (request, response) => {
      response.send('Application is running');
    });
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
}

export default App;
