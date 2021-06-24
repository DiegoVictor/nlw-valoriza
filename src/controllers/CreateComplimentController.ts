import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComplimentsRepositories } from '../repositories/ComplimentsRepositories';
import { UsersRepositories } from '../repositories/UsersRepositories';
import { CreateComplimentService } from '../services/CreateComplimentService';

class CreateComplimentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { tag_id, user_receiver, message } = request.body;

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
      user_sender: '77f948b6-3896-4b7b-9a53-4170b316267d', // request.user.id,
      user_receiver,
      message,
    });

    return response.status(201).json(compliment);
  }
}

export { CreateComplimentController };
