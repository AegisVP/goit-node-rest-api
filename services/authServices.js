import gravatar from 'gravatar';
import { User } from '../models/User.js';
import { comparePasswords, encryptPassword } from '../helpers/passCrypt.js';
import { generateToken } from '../helpers/jwt.js';

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

const generateUserAvatar = async userEmail => {
  const avatarURL = gravatar.url(userEmail, { protocol: 'http' });

  return avatarURL;
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

  const avatarURL = await generateUserAvatar(email);

  const newUser = await User.create({
    email,
    avatarURL,
    password: encryptPassword(password),
  });

  if (!newUser) {
    return false;
  }

  return newUser;
};

export const loginUser = async ({ email, password }) => {
  const user = await verifyUser({ email, password });
  if (!user) {
    return false;
  }

  if (!(await setUserToken(user))) {
    return false;
  }

  return user;
};

export const logoutUser = async userId => {
  const user = await User.findByPk(userId);
  if (!user) {
    return false;
  }

  if (!(await removeUserToken(user))) {
    return false;
  }

  return user;
};

export const updateUser = async (userId, userData) => {
  const user = await User.findByPk(userId);
  if (!user) {
    return null;
  }

  user.update(userData);
  await user.save();

  return user;
};
