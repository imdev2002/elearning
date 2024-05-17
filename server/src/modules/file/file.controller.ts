import { BaseController } from '../../abstractions/base.controller';
import { Request, Response } from 'express';
import NotFoundException from '../../exceptions/not-found';
import { ReqUser, RoleEnum } from '../../global';
import path from 'path';
import { createReadStream, existsSync, statSync } from 'fs';
import HttpException from '../../exceptions/http-exception';
import passport from '../../configs/passport';
import { CoursedPaidStatus } from '@prisma/client';
import { JwtPayload, verify } from 'jsonwebtoken';
import { videoUpload } from '../../configs/multer';
import checkRoleMiddleware from '../../middlewares/checkRole.middleware';

export default class FileController extends BaseController {
  public path = '/api/v1/files';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(`${this.path}/:filename`, this.getFile);
    this.router.post(
      `${this.path}`,
      passport.authenticate('jwt', { session: false }),
      checkRoleMiddleware([RoleEnum.ADMIN, RoleEnum.AUTHOR]),
      videoUpload.fields([{ name: 'image', maxCount: 1 }]),
      this.uploadFile,
    );
  }
  uploadFile = async (req: Request, res: Response) => {
    try {
      const files = req.files as any;
      const image = files.image[0];
      return res.status(200).json({ path: image.path });
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getFile = async (req: Request, res: Response) => {
    try {
      const filename = req.params.filename;
      const isExist = existsSync(`uploads/${filename}`);
      if (!isExist) {
        throw new NotFoundException('file', filename);
      }
      const fileType = ['jpeg', 'jpg', 'png', 'gif', 'svg'].includes(
        filename.split('.')[1],
      )
        ? 'image'
        : ['mp4', 'mov'].includes(filename.split('.')[1])
        ? 'video'
        : 'unknown';
      if (fileType === 'unknown') {
        throw new NotFoundException('file', filename);
      }

      if (fileType === 'image') {
        const imagePath = path.resolve(`uploads/${filename}` as string);
        const stat = statSync(imagePath);
        const fileSize = stat.size;
        const head = {
          'Content-Length': fileSize,
          'Content-Type': `image/${filename.split('.')[1]}`,
        };
        res.writeHead(200, head);
        createReadStream(imagePath).pipe(res);
      } else if (fileType === 'video') {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).send('No token provided');
        }
        const reqUser = (
          verify(token, process.env.SECRET as string) as JwtPayload
        ).user as ReqUser;
        const user = await this.prisma.user.findFirst({
          where: { id: reqUser.id },
          include: {
            coursedPaid: true,
          },
        });
        const lesson = await this.prisma.lesson.findFirst({
          where: { filename },
          include: {
            part: true,
          },
        });
        if (!lesson) {
          throw new NotFoundException('file', filename);
        }
        if (
          !(
            reqUser.id === lesson.userId ||
            reqUser.roles.find((_) => _.role.name === RoleEnum.ADMIN) ||
            user?.coursedPaid.find(
              (_) =>
                _.courseId === lesson.part.courseId &&
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
      }
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
