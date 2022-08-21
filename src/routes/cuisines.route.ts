import { Router } from 'express'
import { ZodError } from 'zod'

import * as cuisineService from '@services/cuisines.service'
import statusCodes from '@constants/status'

import { checkNumericalParams } from '@middleware/routing'
import { zCuisine } from '@utils/zodSchemas/cuisineSchema'
import { ValidationError } from '../errors'
// Imports above

const cuisineRouter = Router()

cuisineRouter.get('/', async (req, res, next) => {
  try {
    const allCuisines = await cuisineService.findAll()
    res.status(statusCodes.OK).json(allCuisines)
  } catch (err) {
    next(err)
  }
})

cuisineRouter.get(
  '/:id',
  checkNumericalParams('id'),
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)

      const targetCuisine = await cuisineService.find(id)
      res.status(statusCodes.OK).json(targetCuisine)
    } catch (err) {
      next(err)
    }
  }
)

cuisineRouter.post('/', async (req, res, next) => {
  const body: unknown = req.body

  try {
    const newCuisine = zCuisine.parse(body)

    const createdCuisine = await cuisineService.create(newCuisine)
    res.status(statusCodes.OK).json(createdCuisine)
  } catch (err) {
    if (err instanceof ZodError) {
      next(
        new ValidationError(
          'Validation error during cuisine creation',
          err.flatten()
        )
      )
    } else {
      next(err)
    }
  }
})

export default cuisineRouter
