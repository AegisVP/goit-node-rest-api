import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import contactsRouter from './routes/contactsRouter.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);

app.use(({ status = 500, message = 'Server error' }, _, res, next) => res.status(status).json({ message }));
app.use((_, res) => res.status(404).json({ message: 'Route not found' }));
app.listen(3000, () => console.log('Server is running. Use our API on port: 3000'));
