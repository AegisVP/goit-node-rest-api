import HttpError from '../helpers/HttpError.js';
import {
  loginUser,
  logoutUser,
  registerUser,
  subscriptionUser,
} from '../services/authServices.js';

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await registerUser({ email, password });
  if (!user) {
    return next(HttpError(409, 'Email in use'));
  }

  const { subscription } = user;
  res.status(201).json({ user: { email, subscription } });
};

export const login = async (req, res, next) => {
  const user = await loginUser(req.body);
  if (!user) {
    return next(HttpError(401)); // For consistency, should return "Not Authorized" instead of "Email or password is wrong"
  }

  const { email, token, subscription } = user;
  res.json({ token, user: { email, subscription } });
};

export const logout = async (req, res) => {
  if (!logoutUser(req.user.id)) {
    return next(HttpError(500));
  }
  res.status(204).send();
};

export const current = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const subscription = async (req, res) => {
  const { subscription } = req.body;
  const updatedUser = await subscriptionUser(req.user.id, subscription);
  if (!updatedUser) {
    return next(HttpError(500));
  }
  res.json({ email: req.user.email, subscription });
};
