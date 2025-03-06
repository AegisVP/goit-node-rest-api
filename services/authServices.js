import gravatar from 'gravatar';
import { User } from '../models/User.js';
import { comparePasswords, encryptPassword } from '../helpers/passCrypt.js';
import { generateToken } from '../helpers/jwt.js';
import { generateVerificationToken } from '../helpers/verificationToken.js';
import { sendVerificationEmail } from '../helpers/sendMail.js';

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

const generateUserAvatar = async userEmail =>
  gravatar.url(userEmail, { protocol: 'http' });

const verifyUser = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return null;
  }

  if (!(await comparePasswords(password, user.password))) {
    return null;
  }

  return user;
};

const sendUserVerification = async user => {
  if (!(user instanceof User)) {
    user = await User.findOne({ where: { email: user } });
  }

  if (!user) {
    return false;
  }

  user.verificationToken = generateVerificationToken();
  user.emailVerified = false;
  await user.save();

  sendVerificationEmail(user.email, user.verificationToken);

  return user;
};

export const registerUser = async userData => {
  const user = await verifyUser(userData);
  if (user) {
    return false;
  }

  userData.avatarURL ??= await generateUserAvatar(userData.email);
  userData.password = await encryptPassword(userData.password);

  const newUser = await User.create(userData);
  if (!newUser) {
    return false;
  }

  sendUserVerification(newUser);

  return newUser;
};

export const verifyUserEmail = async verificationToken => {
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) {
    return null;
  }

  user.verificationToken = null;
  user.emailVerified = true;
  await user.save();

  return user;
};

export const resendUserVerification = async email => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return false;
  }

  if (user.emailVerified) {
    return user;
  }

  return sendUserVerification(user);
};

export const loginUser = async userData => {
  const user = await verifyUser(userData);
  if (!user) {
    return false;
  }

  if (user.emailVerified && !(await setUserToken(user))) {
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
