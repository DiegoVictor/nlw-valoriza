import { unauthorized } from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';

import { UsersRepository } from '../repositories/UsersRepository';

export default async (
  request: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const { user_id } = request;
  const user = await UsersRepository.findOne({
    where: {
      id: user_id,
    },
  });

  if (user.admin) {
    return next();
  }

  throw unauthorized('You are not authorized', 'sample', { code: 541 });
};
