import faker from 'faker';
import request from 'supertest';
import { Connection, createConnection } from 'typeorm';

import { app } from '../../src/app';
import { Compliment } from '../../src/entities/Compliment';
import { Tag } from '../../src/entities/Tag';
import { User } from '../../src/entities/User';
import factory from '../utils/factory';
import token from '../utils/jwtoken';

let connection: Connection;

describe('Compliments', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM compliments');
    await Promise.all([
      connection.query('DELETE FROM users'),
      connection.query('DELETE FROM tags'),
    ]);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to list received compliments', async () => {
    const users = await factory.attrsMany<User>('User', 2, { admin: true });

    const tagsRepository = connection.getRepository(Tag);
    const usersRepository = connection.getRepository(User);
    const complimentsRepository = connection.getRepository(Compliment);

    const tag = await tagsRepository.save(
      tagsRepository.create(await factory.attrs<Tag>('Tag'))
    );

    const [sender, receiver] = await Promise.all(
      users.map((user) => usersRepository.save(usersRepository.create(user)))
    );

    const message = faker.lorem.sentence();
    await complimentsRepository.save(
      complimentsRepository.create({
        tag_id: tag.id,
        sender_id: sender.id,
        receiver_id: receiver.id,
        message,
      })
    );

    delete sender.password;
    delete receiver.password;

    const response = await request(app)
      .get('/v1/compliments/received')
      .set('Authorization', `Bearer ${token(receiver.id)}`)
      .send();

    expect(response.body).toContainEqual({
      id: expect.any(String),
      tag: {
        ...tag,
        label: `#${tag.name}`,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      sender: {
        ...sender,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      receiver: {
        ...receiver,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      message,
      created_at: expect.any(String),
    });
  });

  it('should be able to list a second page of received compliments', async () => {
    const users = await factory.attrsMany<User>('User', 2);

    const tagsRepository = connection.getRepository(Tag);
    const usersRepository = connection.getRepository(User);
    const complimentsRepository = connection.getRepository(Compliment);

    const tag = await tagsRepository.save(
      tagsRepository.create(await factory.attrs<Tag>('Tag'))
    );

    const [sender, receiver] = await usersRepository.save(
      users.map((user) => usersRepository.create(user))
    );
    const compliments = await factory.attrsMany<Compliment>('Compliment', 25, {
      receiver_id: receiver.id,
      sender_id: sender.id,
      tag_id: tag.id,
    });

    await complimentsRepository.save(
      compliments.map((compliment, index) =>
        complimentsRepository.create({ ...compliment, id: String(index + 1) })
      )
    );

    delete sender.password;
    delete receiver.password;

    const response = await request(app)
      .get('/v1/compliments/received?page=2')
      .set('Authorization', `Bearer ${token(receiver.id)}`)
      .send();

    compliments.slice(-5).forEach((compliment, index) => {
      expect(response.body).toContainEqual({
        id: 21 + index,
        tag: {
          ...tag,
          label: `#${tag.name}`,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        sender: {
          ...sender,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        receiver: {
          ...receiver,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        message: compliment.message,
        created_at: expect.any(String),
      });
    });
  });

  it('should be able to list sent compliments', async () => {
    const users = await factory.attrsMany<User>('User', 2, { admin: true });

    const tagsRepository = connection.getRepository(Tag);
    const usersRepository = connection.getRepository(User);
    const complimentsRepository = connection.getRepository(Compliment);

    const tag = await tagsRepository.save(
      tagsRepository.create(await factory.attrs<Tag>('Tag'))
    );

    const [sender, receiver] = await Promise.all(
      users.map((user) => usersRepository.save(usersRepository.create(user)))
    );

    const message = faker.lorem.sentence();
    await complimentsRepository.save(
      complimentsRepository.create({
        tag_id: tag.id,
        sender_id: sender.id,
        receiver_id: receiver.id,
        message,
      })
    );

    delete sender.password;
    delete receiver.password;

    const response = await request(app)
      .get('/v1/compliments/sent')
      .set('Authorization', `Bearer ${token(sender.id)}`)
      .send();

    expect(response.body).toContainEqual({
      id: expect.any(String),
      tag: {
        ...tag,
        label: `#${tag.name}`,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      sender: {
        ...sender,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      receiver: {
        ...receiver,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      },
      message,
      created_at: expect.any(String),
    });
  });

  it('should be able to list a second page of sent compliments', async () => {
    const users = await factory.attrsMany<User>('User', 2);

    const tagsRepository = connection.getRepository(Tag);
    const usersRepository = connection.getRepository(User);
    const complimentsRepository = connection.getRepository(Compliment);

    const tag = await tagsRepository.save(
      tagsRepository.create(await factory.attrs<Tag>('Tag'))
    );

    const [sender, receiver] = await usersRepository.save(
      users.map((user) => usersRepository.create(user))
    );
    const compliments = await factory.attrsMany<Compliment>('Compliment', 25, {
      receiver_id: receiver.id,
      sender_id: sender.id,
      tag_id: tag.id,
    });

    await complimentsRepository.save(
      compliments.map((compliment, index) =>
        complimentsRepository.create({ ...compliment, id: String(index + 1) })
      )
    );

    delete sender.password;
    delete receiver.password;

    const response = await request(app)
      .get('/v1/compliments/sent?page=2')
      .set('Authorization', `Bearer ${token(sender.id)}`)
      .send();

    compliments.slice(-5).forEach((compliment, index) => {
      expect(response.body).toContainEqual({
        id: 21 + index,
        tag: {
          ...tag,
          label: `#${tag.name}`,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        sender: {
          ...sender,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        receiver: {
          ...receiver,
          created_at: expect.any(String),
          updated_at: expect.any(String),
        },
        message: compliment.message,
        created_at: expect.any(String),
      });
    });
  });

  it('should be able to create a new compliment', async () => {
    const tag = await factory.attrs<Tag>('Tag');
    const user = await factory.attrs<User>('User');

    const tagsRepository = connection.getRepository(Tag);
    const usersRepository = connection.getRepository(User);

    const [{ id: tag_id }, { id: user_id }] = await Promise.all([
      tagsRepository.save(tagsRepository.create(tag)),
      usersRepository.save(usersRepository.create(user)),
    ]);

    const receiver = await factory.attrs<User>('User', { admin: true });
    const { id: receiver_id } = await usersRepository.save(
      usersRepository.create(receiver)
    );

    const message = faker.lorem.sentence();
    const response = await request(app)
      .post('/v1/compliments')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .send({
        tag_id,
        receiver_id,
        message,
      });

    expect(response.body).toStrictEqual({
      id: expect.any(String),
      tag_id,
      sender_id: user_id,
      receiver_id,
      message,
      created_at: expect.any(String),
    });
  });

  it('should not be able to create a new compliment when receiver and sender is the same user', async () => {
    const tag = await factory.attrs<Tag>('Tag');

    const tagsRepository = connection.getRepository(Tag);
    const { id: tag_id } = await tagsRepository.save(
      tagsRepository.create(tag)
    );

    const user = await factory.attrs<User>('User', { admin: true });

    const usersRepository = connection.getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(user)
    );

    const message = faker.lorem.sentence();
    const response = await request(app)
      .post('/v1/compliments')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .send({
        tag_id,
        receiver_id: user_id,
        message,
      });

    expect(response.body).toStrictEqual({
      docs: process.env.DOCS_URL,
      error: 'Bad Request',
      message: 'Is not allowed create a compliment from and to the same user',
      statusCode: 400,
      code: 340,
    });
  });

  it('should not be able to create a new compliment with non existing receiver user', async () => {
    const tag = await factory.attrs<Tag>('Tag');

    const tagsRepository = connection.getRepository(Tag);
    const { id: tag_id } = await tagsRepository.save(
      tagsRepository.create(tag)
    );

    const user = await factory.attrs<User>('User', { admin: true });

    const usersRepository = connection.getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(user)
    );

    const message = faker.lorem.sentence();
    const response = await request(app)
      .post('/v1/compliments')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .send({
        tag_id,
        receiver_id: faker.datatype.uuid(),
        message,
      });

    expect(response.body).toStrictEqual({
      docs: process.env.DOCS_URL,
      error: 'Not Found',
      message: 'Receiver user not found',
      statusCode: 404,
      code: 344,
    });
  });
});
