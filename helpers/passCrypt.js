import bcrypt from 'bcrypt';
import { constants } from '../config/constants.js';

export const encryptPassword = pass =>
  bcrypt.hashSync(pass, bcrypt.genSaltSync(constants.jwt.salt));

export const comparePasswords = (pass, hash) => bcrypt.compareSync(pass, hash);
