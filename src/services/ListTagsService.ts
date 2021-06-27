import { Repository } from 'typeorm';

import { Tag } from '../entities/Tag';

class ListTagsService {
  private tagsRepository: Repository<Tag>;

  constructor(tagsRepository: Repository<Tag>) {
    this.tagsRepository = tagsRepository;
  }

  async execute(page: number, limit: number): Promise<Tag[]> {
    return this.tagsRepository.find({
      take: limit,
      skip: (page - 1) * limit,
    });
  }
}

export { ListTagsService };
