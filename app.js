import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';

const SERVER_PORT = process.env.SERVER_PORT || 3000;

import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/authRouter.js';
import { handleErrors } from './middlewares/handleErrors.js';
import { db } from './db/db.js';
import { publicDir, verifyDirectories } from './middlewares/storage.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use(handleErrors);
app.use((_, res) => res.status(404).send('Not found'));

try {
  await db.authenticate();
  console.log('Database connected successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
  process.exit(1);
}

try {
  await verifyDirectories();
  console.log('Directories verified successfully.');
} catch (error) {
  console.error('Unable to verify directories:', error);
  process.exit(1);
}

try {
  app.listen(SERVER_PORT, () =>
    console.info(`Server is running. Use our API on port: ${SERVER_PORT}`)
  );
} catch (error) {
  process.exit(1);
}
