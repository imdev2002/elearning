import { BaseController } from '../../abstractions/base.controller';
import passport from '../../configs/passport';
import CheckRoleMiddleware from '../../middlewares/checkRole.middleware';
import { RoleEnum } from '../../global';
import { Request, Response } from 'express';
import upload from '../../configs/multer';
import NotFoundException from '../../exceptions/not-found';
import { unlinkSync, writeFileSync } from 'fs';
import sharp from 'sharp';
import commonUtil from '../../util/common.util';

export default class EmojiController extends BaseController {
  public path = '/api/v1/emojis';

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(
      `${this.path}`,
      // passport.authenticate('jwt', { session: false }),
      // CheckRoleMiddleware([RoleEnum.ADMIN]),
      upload.single('image'),
      this.createEmoji,
    );
    this.router.get(`${this.path}`, this.getAllEmojis);
    this.router.delete(
      `${this.path}/:id`,
      passport.authenticate('jwt', { session: false }),
      CheckRoleMiddleware([RoleEnum.ADMIN]),
      this.deleteEmoji,
    );
  }

  createEmoji = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        throw new NotFoundException('file', 0);
      }
      const path = `emojis/emoji_${Date.now()}`;
      await sharp(req.file.buffer).toFormat('png').toFile(`${path}.png`);
      commonUtil.convertPngToSvg(`${path}.png`, `${path}.svg`);
      unlinkSync(`${path}.png`);
      const emoji = await this.prisma.emojiIcon.create({
        data: {
          name: req.body.name || path,
          emojiHandle: path.split('/')[1],
        },
      });
      return res.status(200).json(emoji);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  getAllEmojis = async (req: Request, res: Response) => {
    try {
      const emojiIcons = await this.prisma.emojiIcon.findMany();
      return res.status(200).json(emojiIcons);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
  deleteEmoji = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const emojiIcons = await this.prisma.emojiIcon.findFirst({
        where: { id },
      });
      if (!emojiIcons) {
        throw new NotFoundException('emoji icon', id);
      }
      await this.prisma.emoji.deleteMany({ where: { emojiId: id } });
      await this.prisma.emojiIcon.delete({ where: { id } });
      return res.status(200).json(emojiIcons);
    } catch (e: any) {
      console.log(e);
      return res
        .status(e.status || 500)
        .json({ status: e.status, message: e.message });
    }
  };
}
