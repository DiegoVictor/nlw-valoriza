import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { User } from '../entities/User';

class ListUsersService {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute(): Promise<Record<string, string | boolean>> {
    const users = await this.usersRepository.find();
    return classToPlain(users);
  }
}

export { ListUsersService };
