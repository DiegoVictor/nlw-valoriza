import 'dotenv/config';
import { Request } from 'express';
import faker from 'faker';
import { Connection, createConnection, getRepository } from 'typeorm';

import { User } from '../../src/entities/User';
import ensureAuthenticated from '../../src/middlewares/ensureAuthenticated';
import factory from '../utils/factory';
import token from '../utils/jwtoken';

let connection: Connection;

describe('ensureAuthenticated', () => {
  beforeAll(async () => {
    connection = await createConnection();
  });

  beforeEach(async () => {
    await connection.query('DELETE FROM users');
  });

  afterAll(async () => {
    await connection.close();
  });

  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };
  const next = jest.fn();

  it('should be authorizated', async () => {
    const user = await factory.attrs<User>('User', { admin: true });
    const usersRepository = getRepository(User);
    const { id: user_id } = await usersRepository.save(
      usersRepository.create(user)
    );

    const request = {
      headers: {
        authorization: `Bearer ${token(user_id)}`,
      },
    } as Request;
    await ensureAuthenticated(request, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should not be authorizated without send a token', () => {
    const request = {
      headers: {},
    } as Request;

    ensureAuthenticated(request, res, next).catch((err) => {
      expect({ ...err }).toStrictEqual({
        data: { code: 640 },
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 400,
          payload: {
            statusCode: 400,
            error: 'Bad Request',
            message: 'Token not provided',
          },
          headers: {},
        },
      });
    });
  });

  it('should not be authorizated without send a valid token', async () => {
    const request = {
      headers: {
        authorization: faker.random.alphaNumeric(32),
      },
    } as Request;

    ensureAuthenticated(request, res, next).catch((err) => {
      const message = 'Token invalid';
      expect({ ...err }).toStrictEqual({
        data: null,
        isBoom: true,
        isServer: false,
        output: {
          statusCode: 401,
          payload: {
            statusCode: 401,
            error: 'Unauthorized',
            message,
            attributes: {
              code: 641,
              error: message,
            },
          },
          headers: {
            'WWW-Authenticate': `sample code="641", error="${message}"`,
          },
        },
      });
    });
  });
});
