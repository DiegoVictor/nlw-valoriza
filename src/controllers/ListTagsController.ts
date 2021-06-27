import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { TagsRepositories } from '../repositories/TagsRepositories';
import { ListTagsService } from '../services/ListTagsService';
import { CountTagsService } from '../services/CountTagsService';

class ListTagsController {
  async handle(_: Request, response: Response): Promise<Response> {
    const tagsRepositories = getCustomRepository(TagsRepositories);
    const listTagsService = new ListTagsService(tagsRepositories);
    const countTagsService = new CountTagsService(tagsRepositories);

    const [tags, count] = await Promise.all([
      listTagsService.execute(Number(page), limit),
      countTagsService.execute(),
    ]);

    response.header('X-Total-Count', count.toString());

    return response.json(classToPlain(tags));
  }
}

export { ListTagsController };
