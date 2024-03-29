import { NextFunction, Request, Response, Router } from 'express'
import {
  InferAttributes,
  FindOptions,
  NonNullFindOptions,
  Includeable,
} from 'sequelize/types'
import { z, ZodError } from 'zod'

import * as restService from '@services/restaurants.service'
import * as cuisineService from '@services/cuisines.service'
import * as categoryService from '@services/categories.service'
import { statusCodes } from '@constants/status'

import { db } from '../db'
import { checkNumericalParams } from '@middleware/routing'
import { Restaurant } from '@models/restaurants.model'
import { assignPropsToObject } from '@utils/routes.utils'
import {
  zRestaurant,
  zRestaurantArray,
  zCuisinesArray,
} from '@utils/zodSchemas/restSchema'
import { ValidationError } from '../errors/errors'

import { JSONBody } from '@declarations/express'
import { zCategoryArray } from '@utils/zodSchemas/categorySchema'
import { hasPermissions, isSignedIn, validateJWT } from '@middleware/auth'
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
restRouter.get('/', getAllRestaurantsController)

// the GET id route, performs check to see if provided id is of a valid format. Does not perform any operations on the queried data from the DB
restRouter.get(
  '/:id',
  checkNumericalParams('id'),
  getParticularRestaurantController
)

// the POST route, extracts all the registered props on the model from the body, and then performs the create query on the DB
restRouter.post(
  '/',
  validateJWT(),
  isSignedIn(),
  hasPermissions('admin'),
  createRestaurantsController
)

// the UPDATE route, checks if provided `id` is of a valid format and then extracts only the registered properties from the request body and then calls the `update` sequelize method
restRouter.put('/:id', checkNumericalParams('id'), updateRestaurantController)

// the DELETE route, validates the `id` param first, and then uses a `where` object (according to the sequelize where clause) in the body to filter those records with the respective
restRouter.delete(
  '/:id',
  checkNumericalParams('id'),
  validateJWT(),
  isSignedIn(),
  hasPermissions('admin'),
  deleteWithIdController
)

// the DELETE route, the body is the where clause similar to the `WHERE` in SQL.
restRouter.delete(
  '/',
  validateJWT(),
  isSignedIn(),
  hasPermissions('admin'),
  deleteWhereController
)

async function getAllRestaurantsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { cuisines, menu, orderby, sort, open } = req.query

    const queryOptions: FindOptions<
      InferAttributes<Restaurant, { omit: never }>
    > = {}

    const includeArray: Includeable[] = []
    // if cuisines exists and is true
    if (cuisines === 'true') {
      includeArray.push({
        model: db.models.Cuisine,
        through: {
          attributes: [],
        },
      })
    }

    // if menu has a true query parameter
    if (menu === 'true') {
      includeArray.push({
        model: db.models.Category,
      })
    }

    queryOptions.include = includeArray
    const ORDERBY_OPTIONS = z.enum(['restId', 'restName', 'open'])
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
}

async function getParticularRestaurantController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10)

    const { cuisines, menu } = req.query

    const queryOptions: Omit<
      NonNullFindOptions<InferAttributes<Restaurant, { omit: never }>>,
      'where'
    > = { rejectOnEmpty: false }

    const includeArray: Includeable[] = []
    // if cuisines exists and is true
    if (cuisines === 'true') {
      includeArray.push({
        model: db.models.Cuisine,
        through: {
          attributes: [],
        },
      })
    }

    if (menu === 'true') {
      includeArray.push({
        model: db.models.Category,
      })
    }
    queryOptions.include = includeArray

    const restaurant = await restService.find(id, queryOptions)

    res.status(statusCodes.OK).json(restaurant)
  } catch (error: any) {
    next(error)
  }
}

async function createRestaurantsController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const body: JSONBody = req.body

  const transaction = await db.sequelize.transaction()

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

      let createdRestaurant = await restService.create(toBeRestaurant, {
        transaction,
      })

      // cuisines did not exist on the original body
      if (!cuisines) {
        await transaction.commit()
        res.status(statusCodes.OK).json(createdRestaurant)
      }
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
          transaction,
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
          transaction,
        })

        // reload the newly created restaurant including the cuisines
        createdRestaurant = await createdRestaurant.reload({
          include: {
            model: db.models.Cuisine,
            through: {
              attributes: [],
            },
          },
          transaction,
        })

        await transaction.commit()
        res.status(statusCodes.OK).json(createdRestaurant)
      }
    }
  } catch (error: unknown) {
    await transaction.rollback()
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
}

async function updateRestaurantController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const transaction = await db.sequelize.transaction()

  try {
    // convert id to number
    const id = parseInt(req.params.id, 10)
    const body: JSONBody = req.body

    if (Array.isArray(body)) {
      throw new ValidationError("Request body can't be an array")
    }

    const parsedRestaurant = zRestaurant
      .extend({ Cuisines: zCuisinesArray, Categories: zCategoryArray })
      .partial()
      .parse(body)

    const updatedRestaurant = await restService.update(id, parsedRestaurant, {
      transaction,
    })

    // if the route had a `Cuisines` property
    if (
      Object.prototype.hasOwnProperty.call(parsedRestaurant, 'Cuisines') &&
      parsedRestaurant.Cuisines
    ) {
      /** Array of `cuisineId`s */
      const cuisineIds = parsedRestaurant.Cuisines.map(
        cuisine => cuisine.cuisineId
      )

      // Update the restaurant instance with the provided cuisines. Throws an error if a restaurant which does not exist is referenced.
      await updatedRestaurant.setCuisines(cuisineIds, { transaction })

      // reload the instance to include the cuisines
      await updatedRestaurant.reload({
        include: {
          model: db.models.Cuisine,
          through: {
            attributes: [],
          },
        },
        transaction,
      })
    }

    // if body has `Categories` field
    if (
      Object.prototype.hasOwnProperty.call(parsedRestaurant, 'Categories') &&
      parsedRestaurant.Categories
    ) {
      // delete all categories with the mentioned restId
      await categoryService.deleteWithId(updatedRestaurant.restId)

      // create new restaurants with the provided `Categories`
      await categoryService.createAll(parsedRestaurant.Categories)

      await updatedRestaurant.reload({
        include: [
          {
            model: db.models.Category,
          },
          {
            model: db.models.Cuisine,
            through: {
              attributes: [],
            },
          },
        ],

        // always order categories by the order that we always want in
        order: [[db.models.Category, 'sortId', 'ASC']],
      })
    }
    await transaction.commit()
    res.status(statusCodes.OK).json(updatedRestaurant)
  } catch (error: unknown) {
    await transaction.rollback()

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
}

async function deleteWhereController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { body } = req
    const whereProps = props
    whereProps.push('id', 'createdAt', 'updatedAt')
    const where: any = assignPropsToObject(whereProps, body)

    const deletedRows = await restService.del({
      where,
    })
    res.status(statusCodes.OK).json({ deletedRows })
  } catch (error: any) {
    next(error)
  }
}

async function deleteWithIdController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10)
    const where: any = req.body
    where['restId'] = id

    const deletedRows = await restService.del({
      where,
    })
    res.status(statusCodes.OK).json({ deletedRows })
  } catch (error: any) {
    next(error)
  }
}

export default restRouter
