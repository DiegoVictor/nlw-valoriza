import { Request, Response } from 'express';

import { ComplimentsRepository } from '../repositories/ComplimentsRepository';
import { UsersRepository } from '../repositories/UsersRepository';
import { CreateComplimentService } from '../services/CreateComplimentService';

class CreateComplimentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { tag_id, receiver_id, message } = request.body;
    const { user_id } = request;

    const createComplimentService = new CreateComplimentService(
      ComplimentsRepository,
      UsersRepository,
    );

    const compliment = await createComplimentService.execute({
      tag_id,
      sender_id: user_id,
      receiver_id,
      message,
    });

    return response.status(201).json(compliment);
  }
}

export { CreateComplimentController };
