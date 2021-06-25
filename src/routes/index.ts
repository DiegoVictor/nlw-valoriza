import { Router } from 'express';

import { CreateUserController } from '../controllers/CreateUserController';
import { CreateTagController } from '../controllers/CreateTagController';
import userValidator from '../validators/userValidator';
import nameValidator from '../validators/nameValidator';
import ensureAdmin from '../middlewares/ensureAdmin';
import { AuthenticateUserController } from '../controllers/AuthenticateUserController';
import emailAndPasswordValidator from '../validators/emailAndPasswordValidator';
import complimentValidator from '../validators/complimentValidator';
import { CreateComplimentController } from '../controllers/CreateComplimentController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ListUserSentComplimentsController } from '../controllers/ListUserSentComplimentsController';

const router = Router();

const authenticateUserController = new AuthenticateUserController();
const createUserController = new CreateUserController();
const createTagController = new CreateTagController();
const createComplimentController = new CreateComplimentController();
const listUserSentComplimentsController =
  new ListUserSentComplimentsController();

router.post(
  '/sessions',
  emailAndPasswordValidator,
  authenticateUserController.handle
);

router.post('/users', userValidator, createUserController.handle);

router.post(
  '/tags',
  ensureAuthenticated,
  ensureAdmin,
  nameValidator,
  createTagController.handle
);

router.get(
  '/compliments/sent',
  ensureAuthenticated,
  listUserSentComplimentsController.handle
);
router.post(
  '/compliments',
  ensureAuthenticated,
  complimentValidator,
  createComplimentController.handle
);

export { router };
