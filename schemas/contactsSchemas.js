import Joi from 'joi';

const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().regex(PHONE_REGEX).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().regex(PHONE_REGEX),
  favorite: Joi.boolean(),
}).or('name', 'email', 'phone');

export const toggleFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const filterContactsSchema = Joi.object({
  favorite: Joi.boolean(),
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(0),
});
