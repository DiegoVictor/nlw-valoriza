import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComplimentsRepositories } from '../repositories/ComplimentsRepositories';
import { UsersRepositories } from '../repositories/UsersRepositories';
import { CreateComplimentService } from '../services/CreateComplimentService';

class CreateComplimentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { tag_id, user_receiver, user_sender, message } = request.body;

    const usersRepositories = getCustomRepository(UsersRepositories);
    const complimentsRepositories = getCustomRepository(
      ComplimentsRepositories
    );

    const createComplimentService = new CreateComplimentService(
      complimentsRepositories,
      usersRepositories
    );

    const compliment = await createComplimentService.execute({
      tag_id,
      user_sender,
      user_receiver,
      message,
    });

    return response.status(201).json(compliment);
  }
}

export { CreateComplimentController };
