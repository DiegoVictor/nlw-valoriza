import { Request, Response } from 'express';

import { UsersRepository } from '../repositories/UsersRepository';
import { AuthenticateUserService } from '../services/AuthenticateUserService';

class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUserService = new AuthenticateUserService(
      UsersRepository,
    );
    const accessToken = await authenticateUserService.execute({
      email,
      password,
    });

    return response.json({ access_token: accessToken });
  }
}

export { AuthenticateUserController };
