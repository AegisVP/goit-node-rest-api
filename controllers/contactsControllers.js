import HttpError from '../helpers/HttpError.js';
import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  modifyContact,
} from '../services/contactsServices.js';

const sanitizeQuery = query => {
  const retQuery = {};
  Object.keys(query).forEach(key => {
    switch (key) {
      case 'favorite':
        retQuery[key] = String(query[key]).toLocaleLowerCase() === 'true'; // convert to boolean
        break;
      case 'limit':
      case 'page':
        retQuery[key] = Number.parseInt(query[key]); // convert to number, it'll be a number because of Joi validation
        break;
    }
  });
  return retQuery;
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
