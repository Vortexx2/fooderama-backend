import { Router } from 'express';

import Restaurant from '../models/restaurants/restaurants.class';
import * as restService from '../services/restaurants.service';
import statusCodes from '../constants/status';
import { BadRequest } from '../errors';
import { sequelize } from '../sequelize';
import { BaseRestaurant } from '../declarations/restaurants';
import logger from '../logger';

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
      throw new BadRequest('Bad Parameter');
    }
    const result = await restService.find(id);
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    next(error);
  }
});

restRouter.post('/', async (req, res, next) => {
  try {
    const rest: BaseRestaurant = req.body;

    // TODO: Check if validation is necessary here

    const result = await restService.create(rest);
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    logger.error(error)
    next(error);
  }
});

export default restRouter;
