import { User } from '../models/User.js';
import { comparePasswords, encryptPassword } from '../helpers/passCrypt.js';
import { generateToken } from '../helpers/jwt.js';

const sanitizeUser = user => ({
  id: user.id,
  email: user.email,
  subscription: user.subscription,
  token: user.token ?? null,
});

const setUserToken = async user => {
  if (!user || !(user instanceof User)) {
    return false;
  }

  const token = generateToken({ id: user.id, email: user.email });
  user.token = token;
  await user.save();

  return token;
};

const removeUserToken = async user => {
  if (!user || !(user instanceof User)) {
    return false;
  }

  user.token = null;
  await user.save();

  return true;
};

const verifyUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  if (!comparePasswords(password, user.password)) {
    return null;
  }

  return user;
};

export const registerUser = async ({ email, password }) => {
  const user = await verifyUser({ email, password });
  if (user) {
    return false;
  }

  const newUser = await User.create({
    email,
    password: encryptPassword(password),
  });

  if (!newUser) {
    return false;
  }

  return sanitizeUser(newUser);
};

export const loginUser = async ({ email, password }) => {
  const user = await verifyUser({ email, password });
  if (!user) {
    return false;
  }

  if (!setUserToken(user)) {
    return false;
  }

  return sanitizeUser(user);
};

export const logoutUser = async userId => {
  const user = await User.findByPk(userId);
  if (!user) {
    return false;
  }

  return removeUserToken(user);
};

export const subscriptionUser = async (userId, subscription) => {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  user.subscription = subscription;
  await user.save();

  return sanitizeUser(user);
};
