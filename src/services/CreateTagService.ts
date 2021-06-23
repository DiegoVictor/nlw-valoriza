import { badRequest } from '@hapi/boom';
import { Repository } from 'typeorm';

import { Tag } from '../entities/Tag';

class CreateTagService {
  private tagsRepository: Repository<Tag>;

  constructor(tagsRepository: Repository<Tag>) {
    this.tagsRepository = tagsRepository;
  }

  async execute(name: string): Promise<Tag> {
    if (await this.tagsRepository.findOne({ name })) {
      throw badRequest('Tag already exists', { code: 240 });
    }

    const tag = this.tagsRepository.create({ name });
    await this.tagsRepository.save(tag);

    return tag;
  }
}

export { CreateTagService };
