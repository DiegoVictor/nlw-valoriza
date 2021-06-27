import request from 'supertest';
import { Connection, createConnection, getRepository } from 'typeorm';

import { app } from '../../src/app';
import { Tag } from '../../src/entities/Tag';
import { User } from '../../src/entities/User';
import factory from '../utils/factory';
import token from '../utils/jwtoken';

let connection: Connection;

describe('Tags', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await Promise.all([
      connection.query('DELETE FROM tags'),
      connection.query('DELETE FROM users'),
    ]);
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able list tags', async () => {
    const user = await factory.attrs<User>('User', { admin: true });
    const tags = await factory.attrsMany<Tag>('Tag', 5);

    const usersRepository = getRepository(User);
    const tagsRepository = getRepository(Tag);
    const [{ id: user_id }] = await Promise.all([
      usersRepository.save(usersRepository.create(user)),
      tagsRepository.save(tags.map((tag) => tagsRepository.create(tag))),
    ]);

    const response = await request(app)
      .get('/v1/tags')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(200)
      .send();

    tags.forEach((tag) => {
      expect(response.body).toContainEqual({
        id: expect.any(String),
        label: `#${tag.name}`,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ...tag,
      });
    });
  });

  it('should be able list a second page of tags', async () => {
    const user = await factory.attrs<User>('User', { admin: true });
    const tags = await factory.attrsMany<Tag>('Tag', 25);

    const usersRepository = getRepository(User);
    const tagsRepository = getRepository(Tag);
    const [{ id: user_id }] = await Promise.all([
      usersRepository.save(usersRepository.create(user)),
      tagsRepository.save(tags.map((tag) => tagsRepository.create(tag))),
    ]);

    const response = await request(app)
      .get('/v1/tags?page=2')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(200)
      .send();

    tags.slice(-5).forEach((tag) => {
      expect(response.body).toContainEqual({
        id: expect.any(String),
        label: `#${tag.name}`,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ...tag,
      });
    });
  });

  it('should be able to create a new tag', async () => {
    const tag = await factory.attrs<Tag>('Tag');
    const user = await factory.attrs<User>('User', { admin: true });

    const usersRepository = getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(user)
    );

    const response = await request(app)
      .post('/v1/tags')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(201)
      .send(tag);

    expect(response.body).toStrictEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      ...tag,
    });
  });

  it('should not be able to duplicate a tag', async () => {
    const tag = await factory.attrs<Tag>('Tag');
    const user = await factory.attrs<User>('User', { admin: true });

    const usersRepository = getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(user)
    );

    await request(app)
      .post('/v1/tags')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(201)
      .send(tag);
    const response = await request(app)
      .post('/v1/tags')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(400)
      .send(tag);

    expect(response.body).toStrictEqual({
      code: 240,
      docs: process.env.DOCS_URL,
      error: 'Bad Request',
      message: 'Tag already exists',
      statusCode: 400,
    });
  });

  it('should not be authorized to create a new tag', async () => {
    const tag = await factory.attrs<Tag>('Tag');
    const user = await factory.attrs<User>('User', { admin: false });

    const usersRepository = getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(user)
    );

    const response = await request(app)
      .post('/v1/tags')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(401)
      .send(tag);

    expect(response.body).toStrictEqual({
      attributes: {
        code: 541,
        error: 'You are not authorized',
      },
      docs: process.env.DOCS_URL,
      error: 'Unauthorized',
      message: 'You are not authorized',
      statusCode: 401,
    });
  });
});
