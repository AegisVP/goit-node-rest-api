import bcrypt from 'bcrypt';
import { constants } from '../config/constants.js';

export const encryptPassword = async pass =>
  await bcrypt.hash(pass, constants.jwt.salt);

export const comparePasswords = async (pass, hash) =>
  await bcrypt.compare(pass, hash);
