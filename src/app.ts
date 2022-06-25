import path from 'path';
import 'dotenv/config';
import favicon from 'serve-favicon';
import config from 'config';

import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
// import sequelize from 'sequelize';

import logger from './logger';
import router from './routes';
import { logReqInfo, logCompleteInfo } from './middleware/logger';
import { sequelize, checkDBConnection, syncDB } from './sequelize';
// imports above

require('dotenv').config();

const app = express();

// set all headers and settings for express
app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// perform all DB operations
checkDBConnection(sequelize);
syncDB(sequelize, false, true);

app.use(logCompleteInfo);
app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World');
});

app.use('/api/', router);

export { app, config };
