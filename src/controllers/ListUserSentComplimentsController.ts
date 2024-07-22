import { Request, Response } from 'express';

import { ComplimentsRepository } from '../repositories/ComplimentsRepository';
import { CountSentComplimentsService } from '../services/CountSentComplimentsService';
import { ListSentComplimentsService } from '../services/ListSentComplimentsService';
import { PaginationLinks } from '../utils/PaginationLinks';

class ListUserSentComplimentsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const limit = 20;
    const { page = 1 } = request.query;
    const { user_id, currentUrl } = request;

    const listSentComplimentsService = new ListSentComplimentsService(
      ComplimentsRepository,
    );
    const countSentComplimentsService = new CountSentComplimentsService(
      ComplimentsRepository,
    );
    const [compliments, count] = await Promise.all([
      listSentComplimentsService.execute(user_id, Number(page), limit),
      countSentComplimentsService.execute(user_id),
    ]);

    response.header('X-Total-Count', count.toString());

    const pagesTotal = Math.ceil(count / limit);
    if (pagesTotal > 1) {
      response.links(
        PaginationLinks.generate(Number(page), pagesTotal, currentUrl),
      );
    }

    return response.json(compliments);
  }
}

export { ListUserSentComplimentsController };
