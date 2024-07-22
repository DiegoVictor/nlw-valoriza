import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';

class CountSentComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

  async execute(sender_id: string): Promise<number> {
    return this.complimentsRepository.count({
      where: {
        sender_id,
      },
    });
  }
}

export { CountSentComplimentsService };
