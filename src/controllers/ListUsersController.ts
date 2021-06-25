import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { ListUsersService } from '../services/ListUsersService';

class ListUsersController {
  async handle(_: Request, response: Response): Promise<Response> {
    const usersRepositories = getCustomRepository(UsersRepositories);
    const listUsersService = new ListUsersService(usersRepositories);

    const users = await listUsersService.execute();

    return response.json(users);
  }
}

export { ListUsersController };
