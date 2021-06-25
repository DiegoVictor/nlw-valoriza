import { Repository } from 'typeorm';

import { Tag } from '../entities/Tag';

class ListTagsService {
  private tagsRepository: Repository<Tag>;

  constructor(tagsRepository: Repository<Tag>) {
    this.tagsRepository = tagsRepository;
  }

  async execute(): Promise<Tag[]> {
    return this.tagsRepository.find();
  }
}

export { ListTagsService };
