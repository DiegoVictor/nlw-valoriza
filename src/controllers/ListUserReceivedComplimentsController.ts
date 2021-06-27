import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComplimentsRepositories } from '../repositories/ComplimentsRepositories';
import { CountReceivedComplimentsService } from '../services/CountReceivedComplimentsService';
import { ListReceivedComplimentsService } from '../services/ListReceivedComplimentsService';

class ListUserReceivedComplimentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const complimentsRepository = getCustomRepository(ComplimentsRepositories);
    const listReceivedComplimentsService = new ListReceivedComplimentsService(
      complimentsRepository
    );
    const countReceivedComplimentsService = new CountReceivedComplimentsService(
      complimentsRepository
    );
    const [compliments, count] = await Promise.all([
      listReceivedComplimentsService.execute(user_id, Number(page), limit),
      countReceivedComplimentsService.execute(user_id),
    ]);

    response.header('X-Total-Count', count.toString());


    return response.json(compliments);
  }
}

export { ListUserReceivedComplimentsController };
