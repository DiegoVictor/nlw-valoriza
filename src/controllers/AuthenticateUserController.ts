import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { UsersRepositories } from '../repositories/UsersRepositories';
import { AuthenticateUserService } from '../services/AuthenticateUserService';

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const usersRepositories = getCustomRepository(UsersRepositories);
    const authenticateUserService = new AuthenticateUserService(
      usersRepositories
    );

    const accessToken = await authenticateUserService.execute({
      email,
      password,
    });

    return response.json({ access_token: accessToken });
  }
}

export { AuthenticateUserController };
