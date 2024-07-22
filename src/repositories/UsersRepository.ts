import { AppDataSource } from '../database/datasource';
import { User } from '../entities/User';

const UsersRepository = AppDataSource.getRepository(User);

export { UsersRepository };
