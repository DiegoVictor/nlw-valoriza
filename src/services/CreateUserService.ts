import { badRequest } from '@hapi/boom';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';

import { User } from '../entities/User';

interface Request {
  name: string;
  email: string;
  password: string;
  admin?: boolean;
}

class CreateUserService {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute({
    name,
    email,
    admin = false,
    password,
  }: Request): Promise<Record<string, string | boolean>> {
    if (await this.usersRepository.findOne({ email })) {
      throw badRequest('User already exists', { code: 140 });
    }

    const user = this.usersRepository.create({
      name,
      email,
      admin,
      password: await hash(password, 8),
    });
    await this.usersRepository.save(user);

    return classToPlain(user);
  }
}

export { CreateUserService };
