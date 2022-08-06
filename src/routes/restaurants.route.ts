import { Router } from 'express'

import * as restService from '@services/restaurants.service'
import statusCodes from '@constants/status'
import { validateIdParam } from '@middleware/routing'
import { BaseRestaurant } from '@declarations/restaurants'
import { Restaurant } from '@models/restaurants.model'
import { assignPropsToObject } from '@utils/routes.util'
// Imports Above

/**
 * A new individual restaurant router for integration into the main router.
 */
const restRouter = Router()

/**
 * The properties that need to be extracted from the request body to be inserted into the database.
 */
let props = [
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
    const result = await restService.findAll()
    res.status(statusCodes.OK).json(result)
  } catch (error: any) {
    next(error)
  }
})

// the GET id route, performs check to see if provided id is of a valid format. Does not perform any operations on the queried data from the DB
restRouter.get('/:id', validateIdParam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)

    const result = await restService.find(id)
    res.status(statusCodes.OK).json(result)
  } catch (error: any) {
    next(error)
  }
})

// the POST route, extracts all the registered props on the model from the body, and then performs the create query on the DB
restRouter.post('/', async (req, res, next) => {
  let creationObject: BaseRestaurant[] | BaseRestaurant

  try {
    const { body } = req

    // incoming req body is an Array
    if (Array.isArray(body)) {
      let restArr: BaseRestaurant[] = []
      body.map((indRest: { [key: string]: any }) => {
        restArr.push(assignPropsToObject(props, indRest) as BaseRestaurant)
      })

      creationObject = restArr
    }
    // incoming req body is an Object
    else {
      creationObject = assignPropsToObject(props, body) as BaseRestaurant
    }

    const result = await restService.create(creationObject)

    res.status(statusCodes.OK).json(result)
  } catch (error: any) {
    // TODO: Check fix for unique constraint error going to frontend
    next(error)
  }
})

// the UPDATE route, checks if provided `id` is of a valid format and then extracts only the registered properties from the request body and then calls the `update` sequelize method
restRouter.put('/:id', validateIdParam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    const { body } = req

    const rest = assignPropsToObject(props, body)

    const result = await restService.update(id, rest)
    res.status(statusCodes.OK).json(result)
  } catch (error: any) {
    next(error)
  }
})

// the DELETE route, validates the `id` param first, and then uses a `where` object (according to the sequelize where clause) in the body to filter those records with the respective
restRouter.delete('/:id', validateIdParam, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    const where: Partial<Restaurant> = req.body

    where['restId'] = id

    const deletedRows = await restService.del(where)
    res.status(statusCodes.OK).json({ deletedRows })
  } catch (error: any) {
    next(error)
  }
})

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
