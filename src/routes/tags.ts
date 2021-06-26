import { Router } from 'express';

import { CreateTagController } from '../controllers/CreateTagController';
import nameValidator from '../validators/nameValidator';
import ensureAdmin from '../middlewares/ensureAdmin';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import { ListTagsController } from '../controllers/ListTagsController';
import pageValidator from '../validators/pageValidator';

const tagsRoutes = Router();

const createTagController = new CreateTagController();
const listTagsController = new ListTagsController();

tagsRoutes.get(
  '/',
  ensureAuthenticated,
  pageValidator,
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
