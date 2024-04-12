import { Request, Response } from 'express';
import HttpException from '../exceptions/http-exception';

export default function errorMiddleware(
  error: HttpException,
  request: Request,
  response: Response,
) {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  response.status(status).json({
    status,
    message,
  });
}
