import { DataTypes } from 'sequelize';
import { db } from '../db/db.js';

export const User = db.define('User', {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ['starter', 'pro', 'business'],
    defaultValue: 'starter',
  },
  avatarURL: {
    type: DataTypes.STRING,
    defaultValue: null, // TODO: define a default avatar url
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

// User.sync({ alter: true });
