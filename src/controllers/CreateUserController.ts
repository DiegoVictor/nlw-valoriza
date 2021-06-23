import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { CreateUserService } from '../services/CreateUserService';

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, admin } = request.body;

    const usersRepositories = getCustomRepository(UsersRepositories);
    const createUserService = new CreateUserService(usersRepositories);

    const user = await createUserService.execute({
      name,
      email,
      password,
      admin,
    });

    return response.status(201).json(user);
  }
}

export { CreateUserController };
