import { Router } from 'express';

import { CreateTagController } from '../controllers/CreateTagController';
import nameValidator from '../validators/nameValidator';
import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ListTagsController } from '../controllers/ListTagsController';

const tagsRoutes = Router();

const createTagController = new CreateTagController();
const listTagsController = new ListTagsController();

tagsRoutes.get(
  '/',
  ensureAuthenticated,
  listTagsController.handle
);
tagsRoutes.post(
  '/',
  ensureAuthenticated,
  ensureAdmin,
  nameValidator,
  createTagController.handle
);

export { tagsRoutes };
