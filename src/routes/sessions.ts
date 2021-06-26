import { Router } from 'express';

import { AuthenticateUserController } from '../controllers/AuthenticateUserController';
import emailAndPasswordValidator from '../validators/emailAndPasswordValidator';

const sessionsRoutes = Router();

const authenticateUserController = new AuthenticateUserController();

sessionsRoutes.post(
  '/',
  emailAndPasswordValidator,
  authenticateUserController.handle
);

export { sessionsRoutes };
