import { Router } from 'express';

import { CreateUserController } from '../controllers/CreateUserController';
import userValidator from '../validators/userValidator';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ListUsersController } from '../controllers/ListUsersController';
import pageValidator from '../validators/pageValidator';

const usersRoutes = Router();

const createUserController = new CreateUserController();
const listUsersController = new ListUsersController();

usersRoutes.get(
  '/',
  ensureAuthenticated,
  pageValidator,
  listUsersController.handle
);
usersRoutes.post('/', userValidator, createUserController.handle);

export { usersRoutes };
