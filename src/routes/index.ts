import { Router } from 'express';

import { usersRoutes } from './users';
import { tagsRoutes } from './tags';
import { complimentsRoutes } from './compliments';
import { sessionsRoutes } from './sessions';

const routes = Router();

routes.use('/sessions', sessionsRoutes);
routes.use('/users', usersRoutes);
routes.use('/tags', tagsRoutes);
routes.use('/compliments', complimentsRoutes);

export { routes };
