import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './database';

import { router } from './routes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/v1', router);

export { app }
