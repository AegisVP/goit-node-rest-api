import { Sequelize, DataTypes } from 'sequelize';
const { DB_HOST, DB_NAME, DB_USER, DB_PASS } = process.env;

export const db = new Sequelize({
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  host: DB_HOST,
  dialect: 'postgres',
  // native: true,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});
