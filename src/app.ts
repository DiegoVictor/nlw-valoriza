import 'dotenv/config';
import 'reflect-metadata';
import 'express-async-errors';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errors } from 'celebrate';
import { isBoom } from '@hapi/boom';

import './database';

import { router } from './routes';
import routeAliases from './middlewares/routeAliases';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(routeAliases);
app.use('/v1', router);

app.use(errors());
app.use(
  async (error: Error, _: Request, response: Response, next: NextFunction) => {
    if (isBoom(error)) {
      const { statusCode, payload } = error.output;

      return response.status(statusCode).json({
        ...payload,
        ...error.data,
        docs: process.env.DOCS_URL,
      });
    }

    return next(error);
  }
);

export { app };
