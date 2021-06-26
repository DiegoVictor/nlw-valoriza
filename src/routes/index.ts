import { Router } from 'express';

import { usersRoutes } from './users';
import { tagsRoutes } from './tags';
import { complimentsRoutes } from './compliments';
import { sessionsRoutes } from './sessions';

const router = Router();

router.use('/sessions', sessionsRoutes);
router.use('/users', usersRoutes);
router.use('/tags', tagsRoutes);
router.use('/compliments', complimentsRoutes);

export { router };
