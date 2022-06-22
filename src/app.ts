import path from 'path';
import 'dotenv/config';
import favicon from 'serve-favicon';
import config from 'config';

import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import sequelize from 'sequelize';

import logger from './logger';
import router from './routes';
import { logReqInfo, logCompleteInfo } from './middleware/logger';
// imports above

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// app.use(logCompleteInfo);
app.use(logReqInfo);
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
});

app.use('/api/', router);

export { app, config };
