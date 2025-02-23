import express from 'express';
import {
  current,
  logout,
  register,
  login,
  subscription,
} from '../controllers/authController.js';
import { validateBody } from '../helpers/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  updateUserSubSchema,
} from '../schemas/usersSchemas.js';
import { tryCatchWrapper } from '../helpers/tryCatchWrapper.js';
import { handleAuth } from '../middlewares/handleAuth.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  tryCatchWrapper(register)
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  tryCatchWrapper(login)
);

authRouter.post('/logout', handleAuth, tryCatchWrapper(logout));

authRouter.get('/current', handleAuth, tryCatchWrapper(current));

authRouter.patch(
  '/subscription',
  handleAuth,
  validateBody(updateUserSubSchema),
  tryCatchWrapper(subscription)
);

export default authRouter;
