import Joi from 'joi';

const PHONE_REGEX = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

const contact = {
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().regex(PHONE_REGEX),
  favorite: Joi.boolean(),
};

export const createContactSchema = Joi.object({
  name: contact.name.required(),
  email: contact.email.required(),
  phone: contact.phone.required(),
});

export const updateContactSchema = Joi.object({
  name: contact.name,
  email: contact.email,
  phone: contact.phone,
  favorite: contact.favorite,
}).or('name', 'email', 'phone');

export const toggleFavoriteSchema = Joi.object({
  favorite: contact.favorite.required(),
});

export const filterContactsSchema = Joi.object({
  favorite: contact.favorite,
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(0),
});
