import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { corsOptions } from './config/cors.js';
import { routes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

export const app = express();

app.use(cors(corsOptions()));
app.options('*', cors(corsOptions()));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/api', routes);
app.use(notFoundHandler);
app.use(errorHandler);
