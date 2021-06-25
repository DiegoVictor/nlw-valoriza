import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComplimentsRepositories } from '../repositories/ComplimentsRepositories';
import { ListSentComplimentsService } from '../services/ListSentComplimentsService';

class ListUserSentComplimentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const complimentsRepository = getCustomRepository(ComplimentsRepositories);
    const listSentComplimentsService = new ListSentComplimentsService(
      complimentsRepository
    );
    const compliments = await listSentComplimentsService.execute(user_id);

    return response.json(compliments);
  }
}

export { ListUserSentComplimentsController };
