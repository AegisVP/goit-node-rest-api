import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from '../controllers/contactsControllers.js';
import validator from '../helpers/validator.js';
import {
  updateContactSchema,
  createContactSchema,
  toggleFavoriteSchema,
} from '../schemas/contactsSchemas.js';

const contactsRouter = express.Router();

contactsRouter.get('/', getAllContacts);

contactsRouter.get('/:id', getOneContact);

contactsRouter.delete('/:id', deleteContact);

contactsRouter.post('/', validator(createContactSchema), createContact);

contactsRouter.put('/:id', validator(updateContactSchema), updateContact);

contactsRouter.patch('/:id', validator(toggleFavoriteSchema), updateContact);

export default contactsRouter;
