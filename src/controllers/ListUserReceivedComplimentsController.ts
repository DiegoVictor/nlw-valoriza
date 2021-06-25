import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComplimentsRepositories } from '../repositories/ComplimentsRepositories';
import { ListReceivedComplimentsService } from '../services/ListReceivedComplimentsService';

class ListUserReceivedComplimentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const complimentsRepository = getCustomRepository(ComplimentsRepositories);
    const listReceivedComplimentsService = new ListReceivedComplimentsService(
      complimentsRepository
    );
    const compliments = await listReceivedComplimentsService.execute(user_id);

    return response.json(compliments);
  }
}

export { ListUserReceivedComplimentsController };
