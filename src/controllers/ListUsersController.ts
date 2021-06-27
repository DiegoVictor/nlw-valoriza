import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { CountUsersService } from '../services/CountUsersService';
import { ListUsersService } from '../services/ListUsersService';

class ListUsersController {
  async handle(_: Request, response: Response): Promise<Response> {
    const usersRepositories = getCustomRepository(UsersRepositories);
    const listUsersService = new ListUsersService(usersRepositories);
    const countUsersService = new CountUsersService(usersRepositories);

    const [users, count] = await Promise.all([
      listUsersService.execute(Number(page), limit),
      countUsersService.execute(),
    ]);

    response.header('X-Total-Count', count.toString());

    return response.json(users);
  }
}

export { ListUsersController };
