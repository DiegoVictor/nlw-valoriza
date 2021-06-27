import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';

class CountReceivedComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

  async execute(receiver_id: string): Promise<number> {
    return this.complimentsRepository.count({
      receiver_id,
    });
  }
}

export { CountReceivedComplimentsService };
