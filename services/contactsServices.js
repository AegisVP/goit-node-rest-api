import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import * as uuid from 'uuid';

const contactsPath = resolve('db', 'contacts.json');

async function writeContacts(contacts) {
  return await writeFile(contactsPath, JSON.stringify(contacts));
}

export async function listContacts() {
  const contacts = await readFile(contactsPath);
  return JSON.parse(contacts);
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  return contacts.find(({ id }) => id === contactId);
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  const [removed] = contacts.splice(idx, 1);
  setTimeout(() => writeContacts(contacts), 0);
  return removed;
}

export async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: uuid.v7(), name, email, phone };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

export async function modifyContact(contactId, contactData) {
  const contacts = await listContacts();
  const idx = contacts.findIndex(({ id }) => id === contactId);
  if (idx === -1) {
    return null;
  }
  const originalContact = contacts[idx];
  const resultingContact = {
    id: contactId,
    name: contactData.name ?? originalContact.name,
    email: contactData.email ?? originalContact.email,
    phone: contactData.phone ?? originalContact.phone,
  };
  contacts.splice(idx, 1, resultingContact);
  await writeContacts(contacts);
  return contacts[idx];
}
