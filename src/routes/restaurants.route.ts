import { Router } from 'express';
import { ModelStatic } from 'sequelize/types';
import { sequelize } from '../sequelize';

// TODO: See how to set types to Restaurant

const restRouter = Router();

restRouter.get('/', (req, res, next) => {
  res.send('hello');
});

export default restRouter;
