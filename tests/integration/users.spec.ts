import request from 'supertest';
import { Connection, createConnection, getRepository } from 'typeorm';

import { app } from '../../src/app';
import { User } from '../../src/entities/User';
import factory from '../utils/factory';
import token from '../utils/jwtoken';

let connection: Connection;

describe('Users', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should be able to list users', async () => {
    const users = await factory.attrsMany<User>('User', 5, { admin: true });

    const usersRepository = getRepository(User);
    const [{ id: user_id }] = await usersRepository.save(
      users.map((user) => usersRepository.create(user))
    );

    const response = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(200)
      .send();

    users.forEach((user) => {
      delete user.password;

      expect(response.body).toContainEqual({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ...user,
      });
    });
  });

  it('should be able to list a second page of users', async () => {
    const users = await factory.attrsMany<User>('User', 25, { admin: true });

    const usersRepository = getRepository(User);
    const [{ id: user_id }] = await usersRepository.save(
      users.map((user) => usersRepository.create(user))
    );

    const response = await request(app)
      .get('/v1/users?page=2')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(200)
      .send();

    users.slice(-5).forEach((user) => {
      delete user.password;

      expect(response.body).toContainEqual({
        id: expect.any(String),
        created_at: expect.any(String),
        updated_at: expect.any(String),
        ...user,
      });
    });
  });

  it('should be able to create a new admin user', async () => {
    const admin = await factory.attrs<User>('User', { admin: true });
    const user = await factory.attrs<User>('User', { admin: true });

    const usersRepository = getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(admin)
    );

    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(201)
      .send(user);

    delete user.password;

    expect(response.body).toStrictEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      ...user,
    });
  });

  it('should be able to create a new non admin user', async () => {
    const admin = await factory.attrs<User>('User', { admin: true });
    const user = await factory.attrs<User>('User');

    const usersRepository = getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(admin)
    );

    delete user.admin;

    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(201)
      .send(user);

    delete user.password;

    expect(response.body).toStrictEqual({
      id: expect.any(String),
      created_at: expect.any(String),
      updated_at: expect.any(String),
      admin: false,
      ...user,
    });
  });

  it('should not be able to duplicate a user', async () => {
    const admin = await factory.attrs<User>('User', { admin: true });
    const user = await factory.attrs<User>('User');

    const usersRepository = getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(admin)
    );

    await request(app).post('/v1/users').expect(201).send(user);
    const response = await request(app)
      .post('/v1/users')
      .set('Authorization', `Bearer ${token(user_id)}`)
      .expect(400)
      .send(user);

    expect(response.body).toStrictEqual({
      code: 140,
      docs: process.env.DOCS_URL,
      error: 'Bad Request',
      message: 'User already exists',
      statusCode: 400,
    });
  });
});
