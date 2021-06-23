import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';

import { TagsRepositories } from '../repositories/TagsRepositories';
import { CreateTagService } from '../services/CreateTagService';

class CreateTagController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const tagsRepositories = getCustomRepository(TagsRepositories);
    const createTagService = new CreateTagService(tagsRepositories);

    const tag = await createTagService.execute(name);

    return response.status(201).json(tag);
  }
}

export { CreateTagController };
