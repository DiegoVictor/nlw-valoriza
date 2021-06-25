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
import { ListUserReceivedComplimentsController } from '../controllers/ListUserReceivedComplimentsController';
import { ListTagsController } from '../controllers/ListTagsController';
import { ListUsersController } from '../controllers/ListUsersController';

const router = Router();

const authenticateUserController = new AuthenticateUserController();
const createUserController = new CreateUserController();
const createTagController = new CreateTagController();
const listTagsController = new ListTagsController();
const createComplimentController = new CreateComplimentController();
const listUsersController = new ListUsersController();
const listUserReceivedComplimentsController =
  new ListUserReceivedComplimentsController();
const listUserSentComplimentsController =
  new ListUserSentComplimentsController();

router.post(
  '/sessions',
  emailAndPasswordValidator,
  authenticateUserController.handle
);

router.get('/users', ensureAuthenticated, listUsersController.handle);
router.post('/users', userValidator, createUserController.handle);

router.get('/tags', ensureAuthenticated, listTagsController.handle);
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
router.get(
  '/compliments/received',
  ensureAuthenticated,
  listUserReceivedComplimentsController.handle
);
router.post(
  '/compliments',
  ensureAuthenticated,
  complimentValidator,
  createComplimentController.handle
);

export { router };
