import { Repository } from 'typeorm';

import { Tag } from '../entities/Tag';

class CountTagsService {
  private tagsRepository: Repository<Tag>;

  constructor(tagsRepository: Repository<Tag>) {
    this.tagsRepository = tagsRepository;
  }

  async execute(): Promise<number> {
    return this.tagsRepository.count();
  }
}

export { CountTagsService };
