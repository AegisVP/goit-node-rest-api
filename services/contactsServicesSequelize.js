import { User } from '../model/User.js';

export async function listContacts() {
  return await User.findAll();
}

export async function getContactById(contactId) {
  return await User.findByPk(contactId);
}

export async function removeContact(contactId) {
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
}

export async function addContact({ name, email, phone, favorite = false }) {
  return await User.create({ name, email, phone, favorite });
}

export async function modifyContact(contactId, contactData) {
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
    console.log(error);
  }

  return contact;
}
