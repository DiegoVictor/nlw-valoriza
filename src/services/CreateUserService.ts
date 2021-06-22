import { hash } from "bcrypt";
import { Repository } from "typeorm";

import { User } from "../entities/User";

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

  async execute ({ name, email, admin, password }: Request):Promise<User> {
    if (await this.usersRepository.findOne({ email })) {
      throw new Error('User already exists')
    };

    const user = this.usersRepository.create({
      name,
      email,
      admin,
      password: await hash(password, 8)
    });
    await this.usersRepository.save(user);

    return user;
  }
}

export { CreateUserService }