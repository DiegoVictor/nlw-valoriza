import 'dotenv/config';
import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import './database';
const app = express();

app.use(cors());
app.use(helmet());

export { app }
