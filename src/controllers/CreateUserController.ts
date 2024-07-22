import { Request, Response } from 'express';

import { UsersRepository } from '../repositories/UsersRepository';
import { CreateUserService } from '../services/CreateUserService';

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, admin } = request.body;

    const createUserService = new CreateUserService(UsersRepository);

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
