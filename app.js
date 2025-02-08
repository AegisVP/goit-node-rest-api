import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import contactsRouter from './routes/contactsRouter.js';
import { handleErrors } from './middlewares/handleErrors.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use(handleErrors);

app.listen(3000, () => console.log('Server is running. Use our API on port: 3000'));
