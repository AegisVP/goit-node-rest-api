import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from '../controllers/contactsControllers.js';
import validateBody from '../helpers/validateBody.js';
import {
  updateContactSchema,
  createContactSchema,
  toggleFavoriteSchema,
} from '../schemas/contactsSchemas.js';
import { tryCatchWrapper } from '../helpers/tryCatchWrapper.js';

const contactsRouter = express.Router();

contactsRouter.get('/', tryCatchWrapper(getAllContacts));

contactsRouter.get('/:id', tryCatchWrapper(getOneContact));

contactsRouter.delete('/:id', tryCatchWrapper(deleteContact));

contactsRouter.post(
  '/',
  validateBody(createContactSchema),
  tryCatchWrapper(createContact)
);

contactsRouter.put(
  '/:id',
  validateBody(updateContactSchema),
  tryCatchWrapper(updateContact)
);

contactsRouter.patch(
  '/:id/favorite',
  validateBody(toggleFavoriteSchema),
  tryCatchWrapper(updateContact)
);

export default contactsRouter;
