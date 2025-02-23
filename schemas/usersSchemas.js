import Joi from 'joi';
import { constants } from '../config/constants.js';

export const registerUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  subscription: Joi.string().valid(...constants.user.subscription),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const updateUserSubSchema = Joi.object({
  subscription: Joi.string()
    .valid(...constants.user.subscription)
    .required(),
});
