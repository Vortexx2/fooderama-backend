import { Router } from 'express';

import * as restService from '@services/restaurants.service';
import statusCodes from '@constants/status';
import { validateIdParam } from '@middleware/routing';
import { BaseRestaurant } from '@declarations/restaurants';
import { Restaurant } from '@models/restaurants/restaurants.model';

const restRouter = Router();

restRouter.get('/', async (req, res, next) => {
  try {
    const result = await restService.findAll();
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    res.status(statusCodes['Internal Server Error']).send(error.message);
  }
});

restRouter.get('/:id', validateIdParam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    const result = await restService.find(id);
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    next(error);
  }
});

restRouter.post('/', async (req, res, next) => {
  try {
    const rest: BaseRestaurant | BaseRestaurant[] = req.body;

    // TODO: Check if validation is necessary here

    const result = await restService.create(rest);
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    // TODO: Check fix for unique constraint error going to frontend
    next(error);
  }
});

restRouter.put('/:id', validateIdParam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const rest: Partial<BaseRestaurant> = req.body;

    const result = await restService.update(id, rest);
    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    next(error);
  }
});

restRouter.delete('/:id', validateIdParam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const where: Partial<Restaurant> = req.body;

    where['id'] = id;

    const deletedRows = await restService.del(where);
    res.status(statusCodes.OK).json({ deletedRows });
  } catch (error: any) {
    next(error);
  }
});

restRouter.delete('/', async (req, res, next) => {
  try {
    const where: Partial<Restaurant> = req.body;

    const deletedRows = await restService.del(where);
    res.status(statusCodes.OK).json({ deletedRows });
  } catch (error: any) {
    next(error);
  }
});

export default restRouter;
