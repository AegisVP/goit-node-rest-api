import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';

import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/authRouter.js';
import { handleErrors } from './middlewares/handleErrors.js';
import { db } from './db/db.js';
import './models/Associations.js';

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const successMsg = `Server is running. Use our API on port: ${SERVER_PORT}`;

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use(handleErrors);
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

const requiredPreparations = [];

requiredPreparations.push(
  new Promise((resolve, reject) => {
    db.authenticate()
      .then(() => {
        console.info('Database connected successfully.');
        resolve();
      })
      .catch(error => {
        console.error('Unable to connect to the database:', error);
        reject();
      });
  })
);

Promise.all(requiredPreparations)
  .then(() => app.listen(SERVER_PORT, () => console.info(successMsg)))
  .catch(() => process.exit(1));
