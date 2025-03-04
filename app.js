import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';

import contactsRouter from './routes/contactsRouter.js';
import authRouter from './routes/authRouter.js';
import { handleErrors } from './middlewares/handleErrors.js';
import { db } from './db/db.js';
import './models/Associations.js';
import { publicPath, verifyDirectories } from './middlewares/storage.js';

const SERVER_PORT = process.env.SERVER_PORT || 3000;

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/auth', authRouter);
app.use('/api/contacts', contactsRouter);

app.use(handleErrors);
app.use((_, res) => res.status(404).send('Not found'));

const preparationJobs = [];
preparationJobs.push(
  new Promise((resolve, reject) => {
    db.authenticate()
      .then(() => resolve('Database connected successfully.'))
      .catch(err =>
        reject('Unable to connect to the database: ' + err.message)
      );
  })
);

preparationJobs.push(
  new Promise((resolve, reject) => {
    verifyDirectories()
      .then(() => resolve('Directories verified successfully.'))
      .catch(err =>
        reject('Unable to verify working directories: ' + err.message)
      );
  })
);

await Promise.all(preparationJobs)
  .then(res =>
    res.forEach(message => {
      console.info(message);
    })
  )
  .catch(error => {
    console.error(error);
    console.info('Server cannot start - exiting...');
    process.exit(1);
  });

try {
  app.listen(SERVER_PORT, () =>
    console.info(`Server is running. Use our API on port: ${SERVER_PORT}`)
  );
} catch (error) {
  process.exit(1);
}
