import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';

class ListReceivedComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

  async execute(user_receiver: string): Promise<Compliment[]> {
    const compliments = await this.complimentsRepository.find({
      where: {
        user_receiver,
      },
      relations: ['receiver', 'sender', 'tag'],
    });

    return compliments;
  }
}

export { ListReceivedComplimentsService };
