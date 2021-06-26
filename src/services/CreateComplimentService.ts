import { badRequest, notFound } from '@hapi/boom';
import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';
import { User } from '../entities/User';

interface Request {
  tag_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
}

class CreateComplimentService {
  private complimentsRepository: Repository<Compliment>;
  private usersRepository: Repository<User>;

  constructor(
    complimentsRepository: Repository<Compliment>,
    usersRepository: Repository<User>
  ) {
    this.usersRepository = usersRepository;
    this.complimentsRepository = complimentsRepository;
  }

  async execute({
    tag_id,
    sender_id,
    receiver_id,
    message,
  }: Request): Promise<Compliment> {
    if (receiver_id === sender_id) {
      throw badRequest(
        'Is not allowed create a compliment from and to the same user',
        { code: 340 }
      );
    }

    const receiver = await this.usersRepository.findOne(receiver_id);
    if (!receiver) {
      throw notFound('Receiver user not found', { code: 344 });
    }

    const compliment = this.complimentsRepository.create({
      tag_id,
      sender_id,
      receiver_id,
      message,
    });
    await this.complimentsRepository.save(compliment);

    return compliment;
  }
}

export { CreateComplimentService };
