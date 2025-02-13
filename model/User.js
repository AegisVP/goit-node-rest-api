import { DataTypes } from 'sequelize';
import { db } from '../db/db-contacts.js';

export const User = db.define(
  'Contact',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: 'Contacts',
  }
);

User.sync({ alter: true });
