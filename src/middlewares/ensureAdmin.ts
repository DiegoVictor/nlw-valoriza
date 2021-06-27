import { unauthorized } from '@hapi/boom';
import { NextFunction, Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';

export default async (
  request: Request,
  _: Response,
  next: NextFunction
): Promise<void> => {
  const { user_id } = request;

  const usersRepositories = getCustomRepository(UsersRepositories);
  const user = await usersRepositories.findOne(user_id);

  if (user.admin) {
    return next();
  }

  throw unauthorized('You are not authorized', 'sample', { code: 541 });
};
