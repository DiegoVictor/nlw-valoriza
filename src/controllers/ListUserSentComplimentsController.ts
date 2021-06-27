import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComplimentsRepositories } from '../repositories/ComplimentsRepositories';
import { CountSentComplimentsService } from '../services/CountSentComplimentsService';
import { ListSentComplimentsService } from '../services/ListSentComplimentsService';

class ListUserSentComplimentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const complimentsRepository = getCustomRepository(ComplimentsRepositories);
    const listSentComplimentsService = new ListSentComplimentsService(
      complimentsRepository
    );
    const countSentComplimentsService = new CountSentComplimentsService(
      complimentsRepository
    );
    const [compliments, count] = await Promise.all([
      listSentComplimentsService.execute(user_id, Number(page), limit),
      countSentComplimentsService.execute(user_id),
    ]);

    response.header('X-Total-Count', count.toString());

    return response.json(compliments);
  }
}

export { ListUserSentComplimentsController };
