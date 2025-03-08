import HttpError from '../helpers/HttpError.js';
import { saveFile } from '../helpers/saveFile.js';
import {
  loginUser,
  logoutUser,
  registerUser,
  resendUserVerification,
  updateUser,
  verifyUserEmail,
} from '../services/authServices.js';

const sanitizeUser = (user, fields = []) => {
  if (fields.length === 0) {
    const { id, email, subscription, avatarURL } = user;
    return { id, email, subscription, avatarURL };
  }

  return fields.reduce((acc, field) => {
    acc[field] = field === 'avatarURL' ? (user[field] ?? null) : user[field];
    return acc;
  }, {});
};

export const register = async (req, res, next) => {
  const user = await registerUser(req.body);
  if (!user) {
    return next(HttpError(409, 'Email in use'));
  }

  res.status(201).json({ user: sanitizeUser(user, ['email', 'subscription']) });
};

export const verify = async (req, res, next) => {
  const user = await verifyUserEmail(req.params.verificationToken);
  if (!user) {
    return next(HttpError(404, 'User not found'));
  }

  res.json({ message: 'Verification successful' });
};

export const resend = async (req, res, next) => {
  const user = await resendUserVerification(req.body.email);
  if (!user) {
    return next(HttpError(404, 'User not found'));
  }

  if (user.emailVerified) {
    return next(HttpError(400, 'Verification has already been passed'));
  }

  res.json({ message: 'Verification email sent' });
};

export const login = async (req, res, next) => {
  const user = await loginUser(req.body);
  if (!user) {
    return next(HttpError(401));
  }

  if (!user.emailVerified) {
    return next(HttpError(401, 'Email not verified'));
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

  const avatarURL = await saveFile(req.file);

  const updatedUser = await updateUser(req.user.id, { avatarURL });
  if (!updatedUser) {
    return next(HttpError(500));
  }

  res.json(sanitizeUser(updatedUser));
};
