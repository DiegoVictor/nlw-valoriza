import { Router } from 'express';

import { CreateUserController } from '../controllers/CreateUserController';
import { CreateTagController } from '../controllers/CreateTagController';
import userValidator from '../validators/userValidator';
import nameValidator from '../validators/nameValidator';
import ensureAdmin from '../middlewares/ensureAdmin';

const router = Router();

const createUserController = new CreateUserController()
const createTagController = new CreateTagController()

router.post('/users', userValidator, createUserController.handle);

router.post('/tags', ensureAdmin, nameValidator, createTagController.handle);

export { router };
