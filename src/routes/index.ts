import { Router } from 'express';

import { CreateUserController } from '../controllers/CreateUserController';
import userValidator from '../validators/userValidator';

const router = Router();

const createUserController = new CreateUserController()

router.post('/users', userValidator, createUserController.handle);

export { router };
