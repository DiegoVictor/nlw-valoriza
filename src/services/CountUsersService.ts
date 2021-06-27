import { Repository } from 'typeorm';

import { User } from '../entities/User';

class CountUsersService {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute(): Promise<number> {
    return this.usersRepository.count();
  }
}

export { CountUsersService };
