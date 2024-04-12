import { PrismaClient } from '@prisma/client';

import * as express from 'express';
export abstract class BaseController {
  public router: express.Router;
  public prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
    this.router = express.Router();
  }

  public getParam(req: express.Request, key: string) {
    let value = String(req.params[key]) || '';
    if (!value) {
      value = String(req.query[key]) || '';
    }

    return value;
  }

  public abstract initializeRoutes(): void;
}
