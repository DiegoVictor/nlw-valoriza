import { badRequest } from '@hapi/boom';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { User } from '../entities/User';

interface Request {
  email: string;
  password: string;
}
class AuthenticateUserService {
  private usersRepository: Repository<User>;

  constructor(usersRepository: Repository<User>) {
    this.usersRepository = usersRepository;
  }

  async execute({ email, password }: Request): Promise<string> {
    const user = await this.usersRepository.findOne({ email });

    if (!user) {
      throw badRequest('Email and/or password is incorret', { code: 440 });
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw badRequest('Email and/or password is incorret', { code: 441 });
    }

    const token = sign({ email }, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    return token;
  }
}

export { AuthenticateUserService };
