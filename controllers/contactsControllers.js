import HttpError from '../helpers/HttpError.js';
import { listContacts, getContactById, removeContact, addContact, modifyContact } from '../services/contactsServices.js';

export const getAllContacts = async (_, res) => {
  const contacts = await listContacts();
  return res.json(contacts);
};

export const getOneContact = async (req, res, next) => {
  const foundContact = await getContactById(req.params.id);
  if (foundContact) {
    return res.json(foundContact);
  } else {
    return next(HttpError(404));
  }
};

export const deleteContact = async (req, res, next) => {
  const deletedContact = await removeContact(req.params.id);
  if (deletedContact) {
    return res.json(deletedContact);
  } else {
    return next(HttpError(404));
  }
};

export const createContact = async (req, res) => {
  const createdContact = await addContact(req.body);
  return res.status(201).json(createdContact);
};

export const updateContact = async (req, res, next) => {
  const updatedContact = await modifyContact(req.params.id, req.body);
  if (!updatedContact) {
    return next(HttpError(404));
  }
  return res.json(updatedContact);
};
