import { badRequest, notFound } from '@hapi/boom';
import { Repository } from 'typeorm';

import { Compliment } from '../entities/Compliment';
import { User } from '../entities/User';

interface Request {
  tag_id: string;
  user_sender: string;
  user_receiver: string;
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
    user_sender,
    user_receiver,
    message,
  }: Request): Promise<Compliment> {
    if (user_receiver === user_sender) {
      throw badRequest(
        'Is not allowed create a compliment from and to the same user'
      );
    }

    const receiver = await this.usersRepository.findOne(user_receiver);
    if (!receiver) {
      throw notFound('Receiver user not found', { code: 344 });
    }

    const compliment = this.complimentsRepository.create({
      tag_id,
      user_sender,
      user_receiver,
      message,
    });
    await this.complimentsRepository.save(compliment);

    return compliment;
  }
}

export { CreateComplimentService };
