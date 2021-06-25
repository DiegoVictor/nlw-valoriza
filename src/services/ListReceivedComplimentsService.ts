import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { Compliment } from '../entities/Compliment';

class ListReceivedComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

  async execute(
    receiver_id: string
  ): Promise<Record<string, string | boolean>> {
    const compliments = await this.complimentsRepository.find({
      where: {
        receiver_id,
      },
      relations: ['receiver', 'sender', 'tag'],
    });

    return classToPlain(compliments);
  }
}

export { ListReceivedComplimentsService };
