import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';

class ListSentComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

  async execute(sender_id: string): Promise<Record<string, string | boolean>> {
    const compliments = await this.complimentsRepository.find({
      where: {
        sender_id,
      },
      relations: ['receiver', 'sender', 'tag'],
    });

    return compliments;
  }
}

export { ListSentComplimentsService };
