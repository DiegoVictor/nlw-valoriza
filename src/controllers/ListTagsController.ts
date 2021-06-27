import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { TagsRepositories } from '../repositories/TagsRepositories';
import { ListTagsService } from '../services/ListTagsService';
import { CountTagsService } from '../services/CountTagsService';
import { PaginationLinks } from '../utils/PaginationLinks';

class ListTagsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const limit = 20;
    const { page = 1 } = request.query;
    const { currentUrl } = request;

    const tagsRepositories = getCustomRepository(TagsRepositories);
    const listTagsService = new ListTagsService(tagsRepositories);
    const countTagsService = new CountTagsService(tagsRepositories);

    const [tags, count] = await Promise.all([
      listTagsService.execute(Number(page), limit),
      countTagsService.execute(),
    ]);

    response.header('X-Total-Count', count.toString());

    const pagesTotal = Math.ceil(count / limit);
    if (pagesTotal > 1) {
      response.links(
        PaginationLinks.generate(Number(page), pagesTotal, currentUrl)
      );
    }

    return response.json(classToPlain(tags));
  }
}

export { ListTagsController };
