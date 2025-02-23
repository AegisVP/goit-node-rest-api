import HttpError from '../helpers/HttpError.js';
import {
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from '../services/authServices.js';

export const sanitizeUser = user => ({
  id: user.id,
  email: user.email,
  subscription: user.subscription,
  avatarURL: user.avatarURL ?? null,
});

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await registerUser({ email, password });
  if (!user) {
    return next(HttpError(409, 'Email in use'));
  }

  const { subscription } = user;
  res.status(201).json({ user: sanitizeUser(user) });
};

export const login = async (req, res, next) => {
  const user = await loginUser(req.body);
  if (!user) {
    return next(HttpError(401)); // For consistency, should return "Not Authorized" instead of "Email or password is wrong"
  }

  res.json({ token: user.token, user: sanitizeUser(user) });
};

export const logout = async (req, res) => {
  if (!logoutUser(req.user.id)) {
    return next(HttpError(500));
  }
  res.status(204).send();
};

export const current = async (req, res) => {
  res.json(sanitizeUser(req.user));
};

export const update = async (req, res) => {
  const updatedUser = await updateUser(req.user.id, req.body);
  if (!updatedUser) {
    return next(HttpError(500));
  }

  res.json(sanitizeUser(updatedUser));
};
