import { Router } from 'express';

import Restaurant from '../models/restaurants/restaurants.class';
import * as restService from '../services/restaurants.service';
import statusCodes from '../constants/status';
import { BadRequest } from '../errors';
import { sequelize } from '../sequelize';

const restRouter = Router();

restRouter.get('/', async (req, res, next) => {
  try {
    const result = await restService.findAll();
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    res.status(statusCodes['Internal Server Error']).send(error.message);
  }
});

restRouter.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      // res.status(statusCodes['Bad Request']).send('Bad parameter');
      throw new BadRequest('Bad Parameter')
    }
    const result = await restService.find(id);
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    // res.status(statusCodes['Internal Server Error']).send(error.message);
    next(error);
  }
});

export default restRouter;
