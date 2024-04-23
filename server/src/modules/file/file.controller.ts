import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import NotFoundException from '../../exceptions/not-found';
import { ReqUser, RoleEnum } from '../../global';
import path from 'path';
import { createReadStream, statSync } from 'fs';
import HttpException from '../../exceptions/http-exception';
import passport from '../../configs/passport';
import { CoursedPaidStatus } from '@prisma/client';

export default class FileController extends BaseController {
  public path = '/api/v1/files';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(
      `${this.path}/:filename`,
      passport.authenticate('jwt', { session: false }),
      this.getFile,
    );
  }
  getFile = async (req: Request, res: Response) => {
    try {
      const reqUser = req.user as ReqUser;
      const filename = req.params.filename;
      console.log(filename);

      const lesson = await this.prisma.lesson.findFirst({
        where: {
          OR: [
            { localPath: `uploads/${filename}` },
            { thumbnailPath: `uploads/${filename}` },
          ],
        },
      });

      if (!lesson) {
        const course = await this.prisma.course.findFirst({
          where: { thumbnail: `uploads/${filename}` },
        });
        console.log(course);

        if (!course) {
          throw new NotFoundException('file', filename);
        }
        const imagePath = path.resolve(course.thumbnail as string);
        const stat = statSync(imagePath);
        const fileSize = stat.size;
        const head = {
          'Content-Length': fileSize,
          'Content-Type': `image/${filename.split('.')[1]}`,
        };
        res.writeHead(200, head);
        createReadStream(imagePath).pipe(res);
      } else {
        const user = await this.prisma.user.findFirst({
          where: { id: reqUser.id },
          include: {
            coursedPaid: true,
          },
        });
        if (filename.includes('video')) {
          if (
            !(
              reqUser.id === lesson.userId ||
              reqUser.roles.find((_) => _.role.name === RoleEnum.ADMIN) ||
              user?.coursedPaid.find(
                (_) =>
                  _.courseId === lesson.courseId &&
                  _.status === CoursedPaidStatus.SUCCESS,
              ) ||
              lesson.trialAllowed
            )
          ) {
            throw new HttpException(403, 'Forbidden');
          }
          const videoPath = path.resolve(lesson.localPath as string);
          const stat = statSync(videoPath);
          const fileSize = stat.size;
          const range = req.headers.range;

          if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            const chunksize = end - start + 1;
            const file = createReadStream(videoPath, { start, end });
            const head = {
              'Content-Range': `bytes ${start}-${end}/${fileSize}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
          } else {
            const head = {
              'Content-Length': fileSize,
              'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            createReadStream(videoPath).pipe(res);
          }
        } else if (filename.includes('thumbnail')) {
          const imagePath = path.resolve(lesson.thumbnailPath as string);
          const stat = statSync(imagePath);
          const fileSize = stat.size;
          const head = {
            'Content-Length': fileSize,
            'Content-Type': `image/${filename.split('.')[1]}`,
          };
          res.writeHead(200, head);
          createReadStream(imagePath).pipe(res);
        }
      }
      // throw new NotFoundException('file', filename);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
