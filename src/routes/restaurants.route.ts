import { Router } from 'express'
import {
  InferAttributes,
  FindOptions,
  NonNullFindOptions,
} from 'sequelize/types'
import { z, ZodError } from 'zod'

import * as restService from '@services/restaurants.service'
import * as cuisineService from '@services/cuisines.service'
import statusCodes from '@constants/status'

import { db } from '../db'
import { checkNumericalParams } from '@middleware/routing'
import { Restaurant } from '@models/restaurants.model'
import { assignPropsToObject } from '@utils/routes.util'
import {
  zRestaurant,
  zRestaurantArray,
  zCuisinesArray,
} from '@utils/zodSchemas/restSchema'

import { ValidationError } from 'errors'
// Imports Above

/**
 * A new individual restaurant router for integration into the main router.
 */
const restRouter = Router()

/**
 * The properties that need to be extracted from the request body to be inserted into the database.
 */
const props = [
  'restName',
  'restImage',
  'description',
  'open',
  'rating',
  'openingTime',
  'closingTime',
]

// the GET all route, does not perform any operations on the queried data from the DB
restRouter.get('/', async (req, res, next) => {
  try {
    const { cuisines, orderby, sort, open } = req.query

    const queryOptions: FindOptions<
      InferAttributes<Restaurant, { omit: never }>
    > = {}

    // if cuisines exists and is true
    if (cuisines === 'true') {
      queryOptions.include = {
        model: db.models.Cuisine,
        through: {
          attributes: [],
        },
      }
    }

    const ORDERBY_OPTIONS = z.enum(['restId', 'restName'])
    const parsedOrder = ORDERBY_OPTIONS.safeParse(orderby)
    const parsedSort = z.enum(['asc', 'desc']).safeParse(sort)

    // check if there is an order query param and validate
    if (parsedOrder.success) {
      // then check if there is a sort query param and validate
      if (parsedSort.success) {
        queryOptions.order = [[parsedOrder.data, parsedSort.data.toUpperCase()]]
      }
      // if there is no valid sort value
      else {
        queryOptions.order = [[parsedOrder.data, 'ASC']]
      }
    }

    if (open === 'true' || open === 'false') {
      // filters the restaurants which are open or not depending on the open query param
      queryOptions.where = {
        open,
      }
    }

    const restaurants = await restService.findAll(queryOptions)

    // if cuisines does not exist or is false, or has an invalid value
    res.status(statusCodes.OK).json(restaurants)
  } catch (error: any) {
    // if there is any error in validation of query parameters
    if (error instanceof ZodError) {
      next(
        new ValidationError(
          'Validation error in query parameters during restaurants fetch',
          error.flatten()
        )
      )
    } else {
      next(error)
    }
  }
})

// the GET id route, performs check to see if provided id is of a valid format. Does not perform any operations on the queried data from the DB
restRouter.get('/:id', checkNumericalParams('id'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)

    const { cuisines } = req.query

    const queryOptions: Omit<
      NonNullFindOptions<InferAttributes<Restaurant, { omit: never }>>,
      'where'
    > = { rejectOnEmpty: false }

    // if cuisines exists and is true
    if (cuisines === 'true') {
      queryOptions.include = {
        model: db.models.Cuisine,
        through: {
          attributes: [],
        },
      }
    }

    const restaurant = await restService.find(id, queryOptions)
    res.status(statusCodes.OK).json(restaurant)
  } catch (error: any) {
    next(error)
  }
})

type JSONBody = { [key: string]: any } | { [key: string]: any }[]

// the POST route, extracts all the registered props on the model from the body, and then performs the create query on the DB
restRouter.post('/', async (req, res, next) => {
  const body: JSONBody = req.body

  try {
    // check if body is array of restaurant objects to be created
    // do not allow associating with cuisines on bulk creation
    // therefore remove Cuisines
    if (Array.isArray(body)) {
      // array of zRestaurants
      const creation = zRestaurantArray.parse(body)

      // `bulkCreate`s the restaurants and sends the created array as a response
      const createdRestaurants = await restService.create(creation)
      res.status(statusCodes.OK).json(createdRestaurants)
    }
    // body is an object with only 1 restaurant
    else {
      let cuisines = Object.prototype.hasOwnProperty.call(body, 'Cuisines')
        ? body.Cuisines
        : undefined

      // the below parsing will fail if there are any extra fields on the Cuisines object or too many entries on the array
      const toBeRestaurant = zRestaurant.parse(body)

      let createdRestaurant = await restService.create(toBeRestaurant)

      // cuisines did not exist on the original body
      if (!cuisines) res.status(statusCodes.OK).json(createdRestaurant)
      // if cuisines exists
      else {
        // first parse cuisines
        cuisines = zCuisinesArray.parse(cuisines)

        // first check if all of the ids are valid

        /** Array of `cuisineId`s */
        const cuisineIds: number[] = cuisines.map(
          (obj: { cuisineId: number }) => obj.cuisineId
        )

        // find all instances with the cuisineIds provided above
        const foundCuisines = await cuisineService.findAll({
          where: {
            cuisineId: cuisineIds,
          },
          include: db.models.Restaurant,
        })

        // if all of the provided Cuisines are not in the database throw a validation error
        if (foundCuisines.length !== cuisineIds.length) {
          throw new ValidationError(
            'All of the provided Cuisines do not exist in the database'
          )
        }

        // the array of associations that we have to create
        const creationAssociations = foundCuisines.map(cuisine => {
          return {
            restId: createdRestaurant.restId,
            cuisineId: cuisine.cuisineId,
          }
        })
        await db.models.RestaurantCuisine.bulkCreate(creationAssociations, {
          validate: true,
        })

        // reload the newly created restaurant including the cuisines
        createdRestaurant = await createdRestaurant.reload({
          include: {
            model: db.models.Cuisine,
            through: {
              attributes: [],
            },
          },
        })

        res.status(statusCodes.OK).json(createdRestaurant)
      }
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      next(
        new ValidationError(
          'Validation error during restaurant creation',
          error.flatten()
        )
      )
    }
    // even if the error is instanceof `ValidationError` that can be thrown above
    else {
      next(error)
    }
  }
})

// the UPDATE route, checks if provided `id` is of a valid format and then extracts only the registered properties from the request body and then calls the `update` sequelize method
restRouter.put('/:id', checkNumericalParams('id'), async (req, res, next) => {
  try {
    // convert id to number
    const id = parseInt(req.params.id, 10)

    const body: unknown = req.body

    // parse body through a partial of the `zRestaurant` schema
    const rest = zRestaurant.partial().parse(body)

    const result = await restService.update(id, rest)
    res.status(statusCodes.OK).json(result)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      next(
        new ValidationError(
          'Validation error during restaurant updation',
          error.flatten()
        )
      )
    }
    next(error)
  }
})

// the DELETE route, validates the `id` param first, and then uses a `where` object (according to the sequelize where clause) in the body to filter those records with the respective
restRouter.delete(
  '/:id',
  checkNumericalParams('id'),
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const where: Partial<Restaurant> = req.body

      where['restId'] = id

      const deletedRows = await restService.del(where)
      res.status(statusCodes.OK).json({ deletedRows })
    } catch (error: any) {
      next(error)
    }
  }
)

// the DELETE route, the body is the where clause similar to the `WHERE` in SQL.
restRouter.delete('/', async (req, res, next) => {
  try {
    const { body } = req
    const whereProps = props
    whereProps.push('id', 'createdAt', 'updatedAt')
    const where: Partial<Restaurant> = assignPropsToObject(whereProps, body)

    const deletedRows = await restService.del(where)
    res.status(statusCodes.OK).json({ deletedRows })
  } catch (error: any) {
    next(error)
  }
})

export default restRouter
