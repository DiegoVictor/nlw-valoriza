import { Tag } from '../entities/Tag';
import { AppDataSource } from '../database/datasource';

const TagsRepository = AppDataSource.getRepository(Tag);

export { TagsRepository };
