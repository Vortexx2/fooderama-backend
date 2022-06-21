import path from 'path';
import 'dotenv/config';
import favicon from 'serve-favicon';
import config from 'config';

import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import express from 'express';
import sequelize from 'sequelize';

import logger from "./logger";
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

export { app, config };
