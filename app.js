import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';

const SERVER_PORT = process.env.SERVER_PORT || 3000;
const successMsg = `Server is running. Use our API on port: ${SERVER_PORT}`;

import contactsRouter from './routes/contactsRouter.js';
import { handleErrors } from './middlewares/handleErrors.js';
import { db } from './db/db-contacts.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use(handleErrors);
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

try {
  await db.authenticate();
  console.log('Database connected successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}
app.listen(SERVER_PORT, () => console.log(successMsg));
