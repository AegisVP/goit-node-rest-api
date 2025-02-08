import { updateContactSchema } from '../schemas/contactsSchemas.js';
import { listContacts, getContactById, removeContact, addContact, modifyContact } from '../services/contactsServices.js';

export const getAllContacts = async (_, res) => {
  const contacts = await listContacts();
  return res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const foundContact = await getContactById(req.params.id);
  if (foundContact) {
    return res.json(foundContact);
  } else {
    return res.status(404).json({ message: 'Not found' });
  }
};

export const deleteContact = async (req, res) => {
  const deletedContact = await removeContact(req.params.id);
  if (deletedContact) {
    return res.json(deletedContact);
  } else {
    return res.status(404).json({ message: 'Not found' });
  }
};

export const createContact = async (req, res) => {
  const createdContact = await addContact(req.body);
  return res.status(201).json(createdContact);
};

export const updateContact = async (req, res) => {
  const updatedContact = await modifyContact(req.params.id, req.body);
  if (!updatedContact) {
    return res.status(404).json({ message: 'Not found' });
  }
  return res.json(updatedContact);
};
