import path from 'path';
import favicon from 'serve-favicon';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import express from 'express';

import sequelize from 'sequelize';
// imports above

const app = express();

app.use(express.json());

export default app;
