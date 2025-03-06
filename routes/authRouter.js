import express from 'express';
import {
  current,
  logout,
  register,
  login,
  update,
  uploadAvatar,
  verify,
  resend,
} from '../controllers/authController.js';
import { validateBody } from '../helpers/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  updateSubscriptionSchema,
  sendVerifyEmailSchema,
  verifyEmailSchema,
} from '../schemas/usersSchemas.js';
import { tryCatchWrapper } from '../helpers/tryCatchWrapper.js';
import { handleAuth } from '../middlewares/handleAuth.js';
import upload from '../middlewares/storage.js';

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

authRouter.get('/verify/:verificationToken', tryCatchWrapper(verify));

authRouter.post(
  '/verify',
  validateBody(sendVerifyEmailSchema),
  tryCatchWrapper(resend)
);

authRouter.post('/logout', handleAuth, tryCatchWrapper(logout));

authRouter.get('/current', handleAuth, tryCatchWrapper(current));

authRouter.patch(
  '/subscription',
  handleAuth,
  validateBody(updateSubscriptionSchema),
  tryCatchWrapper(update)
);

authRouter.patch(
  '/avatars',
  handleAuth,
  upload.single('avatar'),
  tryCatchWrapper(uploadAvatar)
);

export default authRouter;
