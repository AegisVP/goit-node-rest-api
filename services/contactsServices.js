import { constants } from '../config/constants.js';

export const listContacts = async (owner, query) => {
  const options = {};
  if (typeof query.favorite === 'boolean') {
    options.favorite = query.favorite;
  }

  const limit = query.limit || constants.contacts.defaultLimit;
  const offset = (Number.parseInt(query.page ?? 1) - 1) * (limit ?? 0);
  return await owner.getContacts({
    where: { ...options },
    limit:
      query.limit !== constants.contacts.defaultLimit || query.page > 1
        ? limit
        : null,
    offset: offset === 0 ? null : offset,
  });
};

export const getContactById = async (owner, contactId) => {
  return (await owner.getContacts({ where: { id: contactId } }))[0] ?? null;
};

export const removeContact = async (owner, contactId) => {
  const contact = await getContactById(owner, contactId);
  if (!contact) {
    return null;
  }

  await contact.destroy();

  return contact;
};

export const addContact = async (owner, contactData) => {
  return await owner.createContact(contactData);
};

export const modifyContact = async (owner, contactId, contactData) => {
  const contact = await getContactById(owner, contactId);
  if (!contact) {
    return null;
  }

  contact.name = contactData.name ?? contact.name;
  contact.email = contactData.email ?? contact.email;
  contact.phone = contactData.phone ?? contact.phone;
  contact.favorite = contactData.favorite ?? contact.favorite;

  await contact.save();

  return contact;
};
