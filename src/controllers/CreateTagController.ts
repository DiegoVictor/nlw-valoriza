import { Request, Response } from 'express';

import { TagsRepository } from '../repositories/TagsRepository';
import { CreateTagService } from '../services/CreateTagService';

class CreateTagController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name } = request.body;

    const createTagService = new CreateTagService(TagsRepository);

    const tag = await createTagService.execute(name);

    return response.status(201).json(tag);
  }
}

export { CreateTagController };
