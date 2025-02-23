import express from 'express';
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from '../controllers/contactsControllers.js';
import {
  updateContactSchema,
  createContactSchema,
  toggleFavoriteSchema,
  filterContactsSchema,
} from '../schemas/contactsSchemas.js';
import { validateBody } from '../helpers/validateBody.js';
import { validateQuery } from '../helpers/validateQuery.js';
import { tryCatchWrapper } from '../helpers/tryCatchWrapper.js';
import { handleAuth } from '../middlewares/handleAuth.js';

const contactsRouter = express.Router();

contactsRouter.use(handleAuth);

contactsRouter.get(
  '/',
  validateQuery(filterContactsSchema),
  tryCatchWrapper(getAllContacts)
);

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
