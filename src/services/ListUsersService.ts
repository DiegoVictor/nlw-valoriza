import { Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';

import { User } from '../entities/User';

class ListUsersService {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute(
    page: number,
    limit: number
  ): Promise<Record<string, string | boolean>> {
    const users = await this.usersRepository.find({
      take: limit,
      skip: (page - 1) * limit,
    });
    return instanceToPlain(users);
  }
}

export { ListUsersService };
