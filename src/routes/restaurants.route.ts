import { Router } from 'express';

import * as restService from '@services/restaurants.service';
import statusCodes from '@constants/status';
import { validateIdParam } from '@middleware/routing';
import { BaseRestaurant } from '@declarations/restaurants';
import { Restaurant } from '@models/restaurants.model';
import { assignPropsToObject } from '@utils/routes.util';

const restRouter = Router();

let props = [
  'restName',
  'description',
  'open',
  'rating',
  'openingTime',
  'closingTime',
];

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
  let creationObject: BaseRestaurant[] | BaseRestaurant;

  try {
    const { body } = req;

    // incoming req body is an Array
    if (Array.isArray(body)) {
      let restArr: BaseRestaurant[] = [];
      body.map((indRest: { [key: string]: any }) => {
        restArr.push(assignPropsToObject(props, indRest) as BaseRestaurant);
      });

      creationObject = restArr;
    }
    // incoming req body is an Object
    else {
      creationObject = assignPropsToObject(props, body) as BaseRestaurant;
    }

    const result = await restService.create(creationObject);

    res.status(statusCodes.OK).json(result);
  } catch (error: any) {
    // TODO: Check fix for unique constraint error going to frontend
    next(error);
  }
});

restRouter.put('/:id', validateIdParam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { body } = req;

    const rest = assignPropsToObject(props, body);

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

    where['restId'] = id;

    const deletedRows = await restService.del(where);
    res.status(statusCodes.OK).json({ deletedRows });
  } catch (error: any) {
    next(error);
  }
});

restRouter.delete('/', async (req, res, next) => {
  try {
    const { body } = req;
    const whereProps = props;
    whereProps.push('id', 'createdAt', 'updatedAt');
    const where: Partial<Restaurant> = assignPropsToObject(whereProps, body);

    const deletedRows = await restService.del(where);
    res.status(statusCodes.OK).json({ deletedRows });
  } catch (error: any) {
    next(error);
  }
});

export default restRouter;
