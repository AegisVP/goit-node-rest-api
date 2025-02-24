import HttpError from '../helpers/HttpError.js';
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
} from '../services/contactsServices.js';

const sanitizeQuery = query => {
  const sanitizedQuery = {};
  Object.keys(query).forEach(key => {
    if (key === 'favorite') {
      sanitizedQuery[key] =
        String(query[key]).trim().toLocaleLowerCase() === 'true';
    } else if (key === 'limit' || key === 'page') {
      sanitizedQuery[key] = Number(query[key]);
    }
  });
  return sanitizedQuery;
};

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts(req.user, sanitizeQuery(req.query));
  res.json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const foundContact = await getContactById(req.user, req.params.id);
  if (!foundContact) {
    return next(HttpError(404));
  }
  res.json(foundContact);
};

export const deleteContact = async (req, res, next) => {
  const deletedContact = await removeContact(req.user, req.params.id);
  if (!deletedContact) {
    return next(HttpError(404));
  }
  res.json(deletedContact);
};

export const createContact = async (req, res) => {
  const createdContact = await addContact(req.user, req.body);
  return res.status(201).json(createdContact);
};

export const updateContact = async (req, res, next) => {
  const updatedContact = await modifyContact(req.user, req.params.id, req.body);
  if (!updatedContact) {
    return next(HttpError(404));
  }
  res.json(updatedContact);
};
