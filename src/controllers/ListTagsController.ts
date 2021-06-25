import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { TagsRepositories } from '../repositories/TagsRepositories';
import { ListTagsService } from '../services/ListTagsService';

class ListTagsController {
  async handle(_: Request, response: Response): Promise<Response> {
    const tagsRepositories = getCustomRepository(TagsRepositories);
    const listTagsService = new ListTagsService(tagsRepositories);

    const tags = await listTagsService.execute();

    return response.json(classToPlain(tags));
  }
}

export { ListTagsController };
