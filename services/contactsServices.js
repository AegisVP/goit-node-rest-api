import { constants } from '../config/constants.js';
import { Contact } from '../models/Contact.js';

const isOwnerOfContact = (userId, contact) => contact.owner === userId;

export const listContacts = async query => {
  const options = {};
  if (typeof query.favorite === 'boolean') {
    options.favorite = query.favorite;
  }

  const owner = query.owner;
  const limit = query.limit || constants.contacts.defaultLimit;
  const offset = (Number.parseInt(query.page ?? 1) - 1) * (limit ?? 0);
  return await Contact.findAll({
    where: { owner, ...options },
    limit:
      query.limit !== constants.contacts.defaultLimit || query.page > 1
        ? limit
        : null,
    offset: offset === 0 ? null : offset,
  });
};

export const getContactById = async contactId => {
  return await Contact.findByPk(contactId);
};

export const removeContact = async contactId => {
  const contact = await getContactById(contactId);

  if (!contact) {
    return null;
  }

  try {
    await contact.destroy();
  } catch (error) {
    console.error('Error removing contact:', error);
  }

  return contact;
};

export const addContact = async ({
  name,
  email,
  phone,
  owner,
  favorite = false,
}) => {
  return await Contact.create({ name, email, phone, owner, favorite });
};

export const modifyContact = async (contactId, contactData) => {
  const contact = await getContactById(contactId);
  if (!contact) {
    return null;
  }

  contact.name = contactData.name ?? contact.name;
  contact.email = contactData.email ?? contact.email;
  contact.phone = contactData.phone ?? contact.phone;
  contact.favorite = contactData.favorite ?? contact.favorite;

  try {
    await contact.save();
  } catch (error) {
    console.error(error);
  }

  return contact;
};
