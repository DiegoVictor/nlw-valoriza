import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';

class ListReceivedComplimentsService {
  private complimentsRepository: Repository<Compliment>;

  constructor(complimentsRepository: Repository<Compliment>) {
    this.complimentsRepository = complimentsRepository;
  }

    receiver_id: string
    const compliments = await this.complimentsRepository.find({
      where: {
        receiver_id,
      },
      relations: ['receiver', 'sender', 'tag'],
    });

    return compliments;
  }
}

export { ListReceivedComplimentsService };
