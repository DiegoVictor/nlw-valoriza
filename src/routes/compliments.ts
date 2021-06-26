import { Router } from 'express';

import complimentValidator from '../validators/complimentValidator';
import { CreateComplimentController } from '../controllers/CreateComplimentController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ListUserSentComplimentsController } from '../controllers/ListUserSentComplimentsController';
import { ListUserReceivedComplimentsController } from '../controllers/ListUserReceivedComplimentsController';
const complimentsRoutes = Router();

const createComplimentController = new CreateComplimentController();
const listUserReceivedComplimentsController =
  new ListUserReceivedComplimentsController();
const listUserSentComplimentsController =
  new ListUserSentComplimentsController();

complimentsRoutes.get(
  '/sent',
  ensureAuthenticated,
  listUserSentComplimentsController.handle
);
complimentsRoutes.get(
  '/received',
  ensureAuthenticated,
  listUserReceivedComplimentsController.handle
);
complimentsRoutes.post(
  '/',
  ensureAuthenticated,
  complimentValidator,
  createComplimentController.handle
);

export { complimentsRoutes };
