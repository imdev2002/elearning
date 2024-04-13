import { NextFunction, Request, Response } from 'express';
import { ReqUser, RoleEnum } from '../global';
import HttpException from '../exceptions/http-exception';

function checkRoleMiddleware(roles: RoleEnum[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!roles || roles.length === 0) {
        return res.status(400).send({ msg: 'Roles not provided' });
      }

      if (!req.user) {
        return res.status(401).send({ msg: 'Access denied' });
      }
      const userRoles = (req.user as ReqUser).roles;
      const authorized = userRoles.some((userRole) =>
        roles.some((role) => role === userRole.role.name),
      );

      if (!authorized) {
        return next(new HttpException(401, 'Access denied'));
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export default checkRoleMiddleware;
