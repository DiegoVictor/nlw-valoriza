import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { ComplimentsRepositories } from '../repositories/ComplimentsRepositories';
import { CountReceivedComplimentsService } from '../services/CountReceivedComplimentsService';
import { ListReceivedComplimentsService } from '../services/ListReceivedComplimentsService';
import { PaginationLinks } from '../utils/PaginationLinks';

class ListUserReceivedComplimentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const limit = 20;
    const { page = 1 } = request.query;
    const { user_id, currentUrl } = request;

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

    const pagesTotal = Math.ceil(count / limit);
    if (pagesTotal > 1) {
      response.links(
        PaginationLinks.generate(Number(page), pagesTotal, currentUrl)
      );
    }

    return response.json(compliments);
  }
}

export { ListUserReceivedComplimentsController };
