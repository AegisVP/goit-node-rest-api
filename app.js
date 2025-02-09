import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const SERVER_PORT = 3000;
const successMsg = `Server is running. Use our API on port: ${SERVER_PORT}`;

import contactsRouter from './routes/contactsRouter.js';
import { handleErrors } from './middlewares/handleErrors.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use(handleErrors);
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));

app.listen(SERVER_PORT, () => console.log(successMsg));
