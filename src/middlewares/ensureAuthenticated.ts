import { badRequest, unauthorized } from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface Payload {
  sub: string;
}

export default async (
  request: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const { authorization } = request.headers;

  if (!authorization) {
    throw badRequest('Token not provided', { code: 640 });
  }

  const [, token] = authorization.split(' ');

  try {
    const { sub } = verify(token, process.env.JWT_SECRET) as Payload;
    request.user_id = sub;

    return next();
  } catch (err) {
    throw unauthorized('Token invalid', 'sample', { code: 641 });
  }
};
