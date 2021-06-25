import { Repository } from 'typeorm';

import { User } from '../entities/User';

class ListUsersService {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute(): Promise<User[]> {
    return this.usersRepository.find();
  }
}

export { ListUsersService };
