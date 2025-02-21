import { User } from '../models/User.js';
import { generateToken } from '../helpers/jwt.js';
import { comparePasswords, encryptPassword } from '../helpers/passCrypt.js';
import { constants } from '../config/constants.js';

export const verifyUser = async ({ email, password }) => {
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
    return null;
  }
  return await User.create({ email, password: encryptPassword(password) });
};

export const loginUser = async ({ email, password }) => {
  const user = await verifyUser({ email, password });

  if (!user) {
    return null;
  }

  try {
    const token = generateToken({ id: user.id, email: user.email });
    user.token = token;
    await user.save();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const logoutUser = async userId => {
  const user = await User.findByPk(userId);
  if (!user) {
    return false;
  }
  user.token = null;
  await user.save();
  return true;
};

export const subscriptionUser = async (userId, subscription) => {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  user.subscription = subscription;
  await user.save();
  return user;
};
