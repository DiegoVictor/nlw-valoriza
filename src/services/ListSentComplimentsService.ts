import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { Compliment } from '../entities/Compliment';

class ListSentComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

  async execute(
    sender_id: string,
    page: number,
    limit: number
  ): Promise<Record<string, string | boolean>> {
    const compliments = await this.complimentsRepository.find({
      where: {
        sender_id,
      },
      relations: ['receiver', 'sender', 'tag'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return classToPlain(compliments);
  }
}

export { ListSentComplimentsService };
