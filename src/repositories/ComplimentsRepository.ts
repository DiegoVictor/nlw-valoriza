import { Compliment } from '../entities/Compliment';
import { AppDataSource } from '../database/datasource';

const ComplimentsRepository = AppDataSource.getRepository(Compliment);

export { ComplimentsRepository };
