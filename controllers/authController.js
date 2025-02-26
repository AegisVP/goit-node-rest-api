import path from 'node:path';
import fs from 'node:fs/promises';
import HttpError from '../helpers/HttpError.js';
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from '../services/authServices.js';
import { v4 } from 'uuid';
import { avatarDir, avatarPath } from '../middlewares/storage.js';

const sanitizeUser = (user, fields = []) => {
  const retUsr = {};

  if (fields.length === 0) {
    retUsr.id = user.id;
    retUsr.email = user.email;
    retUsr.subscription = user.subscription;
    retUsr.avatarURL = user.avatarURL ?? null;
  }

  if (fields.includes('id')) retUsr.id = user.id;
  if (fields.includes('email')) retUsr.email = user.email;
  if (fields.includes('subscription')) retUsr.subscription = user.subscription;
  if (fields.includes('avatarURL')) retUsr.avatarURL = user.avatarURL ?? null;

  return retUsr;
};

export const register = async (req, res, next) => {
  const user = await registerUser(req.body);
  if (!user) {
    return next(HttpError(409, 'Email in use'));
  }

  res.status(201).json({ user: sanitizeUser(user, ['email', 'subscription']) });
};

export const login = async (req, res, next) => {
  const user = await loginUser(req.body);
  if (!user) {
    return next(HttpError(401)); // For consistency, should return "Not Authorized" instead of "Email or password is wrong"
  }

  res.json({
    token: user.token,
    user: sanitizeUser(user, ['email', 'subscription']),
  });
};

export const logout = async (req, res, next) => {
  if (!logoutUser(req.user.id)) {
    return next(HttpError(500));
  }
  res.status(204).send();
};

export const current = async (req, res) => {
  res.json(sanitizeUser(req.user));
};

export const update = async (req, res, next) => {
  const updatedUser = await updateUser(req.user.id, req.body);
  if (!updatedUser) {
    return next(HttpError(500));
  }

  res.json(sanitizeUser(updatedUser));
};

export const uploadAvatar = async (req, res, next) => {
  if (!req.file) {
    return next(HttpError(400));
  }

  const { path: temporaryName, originalname } = req.file;
  const uniqueName = v4() + path.extname(originalname);
  const fileURL = path.join(avatarDir, uniqueName);
  const filePath = path.join(avatarPath, uniqueName);

  try {
    await fs.rename(temporaryName, filePath);
  } catch (error) {
    await fs.unlink(temporaryName);
    return next(HttpError(500, error.message));
  }

  const updatedUser = await updateUser(req.user.id, { avatarURL: fileURL });
  if (!updatedUser) {
    return next(HttpError(500));
  }

  res.json(sanitizeUser(updatedUser));
};
