import Joi from 'joi';
import { constants } from '../config/constants.js';

const user = {
  userEmail: Joi.string().email(),
  userPassword: Joi.string().min(6),
  avatarURL: Joi.string(),
  userSubscription: Joi.string().valid(...constants.user.subscription),
};

export const registerUserSchema = Joi.object({
  email: user.userEmail.required(),
  password: user.userPassword.required(),
  avatarURL: user.avatarURL,
  subscription: user.userSubscription,
});

export const loginUserSchema = Joi.object({
  email: user.userEmail.required(),
  password: user.userPassword.required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: user.userSubscription.required(),
});

export const updateAvatarSchema = Joi.object({
  avatarURL: user.avatarURL.required(),
});
