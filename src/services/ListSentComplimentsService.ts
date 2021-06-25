import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';

class ListSentComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

  async execute(user_sender: string): Promise<Compliment[]> {
    const compliments = await this.complimentsRepository.find({
      where: {
        user_sender,
      },
      relations: ['receiver', 'sender', 'tag'],
    });

    return compliments;
  }
}

export { ListSentComplimentsService };
