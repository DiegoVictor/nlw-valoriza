import { hash } from 'bcrypt';
import { verify } from 'jsonwebtoken';
import request from 'supertest';
import { JestDatasource } from '../utils/datasource';

import { app } from '../../src/app';
import { User } from '../../src/entities/User';
import factory from '../utils/factory';

describe('Sessions', () => {
  const datasource = new JestDatasource();

  beforeEach(async () => {
    const connection = await datasource.getConnection();
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    const connection = await datasource.getConnection();
    await connection.destroy();
  });

  it('should be able to login', async () => {
    const connection = await datasource.getConnection();

    const { admin, password, name, email } = await factory.attrs<User>('User');
    const repository = connection.getRepository(User);
    await repository.save(
      repository.create({
        admin,
        password: await hash(password, 8),
        name,
        email,
      }),
    );

    const response = await request(app).post('/v1/sessions').expect(200).send({
      email,
      password,
    });

    expect(response.body).toStrictEqual({ access_token: expect.any(String) });
    expect(
      verify(response.body.access_token, process.env.JWT_SECRET),
    ).toBeTruthy();
  });

  it('should not be able to login with non existing user', async () => {
    const { password, email } = await factory.attrs<User>('User');

    const response = await request(app).post('/v1/sessions').expect(400).send({
      email,
      password,
    });

    expect(response.body).toStrictEqual({
      code: 440,
      docs: process.env.DOCS_URL,
      error: 'Bad Request',
      message: 'Email and/or password is incorret',
      statusCode: 400,
    });
  });

  it('should not be able to login with wrong password', async () => {
    const connection = await datasource.getConnection();

    const { admin, password, name, email } = await factory.attrs<User>('User');
    const repository = connection.getRepository(User);
    await repository.save(
      repository.create({
        admin,
        password: await hash(password, 8),
        name,
        email,
      }),
    );

    const response = await request(app).post('/v1/sessions').expect(400).send({
      email,
      password: 'wrong-password',
    });

    expect(response.body).toStrictEqual({
      code: 441,
      docs: process.env.DOCS_URL,
      error: 'Bad Request',
      message: 'Email and/or password is incorret',
      statusCode: 400,
    });
  });
});
