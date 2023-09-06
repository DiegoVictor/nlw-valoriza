import { faker } from '@faker-js/faker';
import factory from 'factory-girl';

factory.define(
  'User',
  {},
  {
    name: faker.person.fullName,
    email: faker.internet.email,
    password: faker.internet.password,
    admin: faker.datatype.boolean,
  },
);

factory.define(
  'Tag',
  {},
  {
    name: faker.lorem.word,
  },
);

factory.define(
  'Compliment',
  {},
  {
    tag_id: faker.string.uuid,
    sender_id: faker.string.uuid,
    receiver_id: faker.string.uuid,
    message: faker.lorem.sentence,
  },
);

export default factory;
