import { Router } from 'express'

import * as categoryService from '@services/categories.service'
import { JSONBody } from '@declarations/express'
import { ValidationError } from '../errors/errors'
import { zCategory, zUpdateCategory } from '@utils/zodSchemas/categorySchema'
import { ZodError } from 'zod'
import { statusCodes } from '@constants/status'
import { checkNumericalParams } from '@middleware/routing'

// Imports above

const categoryRouter = Router()

categoryRouter.post('/', async (req, res, next) => {
  const body: JSONBody = req.body
  try {
    if (Array.isArray(body)) {
      throw new ValidationError('Request body should be an object')
    }

    const createdCategory = await categoryService.create(zCategory.parse(body))

    res.status(statusCodes.OK).json(createdCategory)
  } catch (err) {
    if (err instanceof ZodError) {
      next(
        new ValidationError(
          'Validation error during creation of categories',
          err.flatten()
        )
      )
    } else {
      next(err)
    }
  }
})

categoryRouter.put(
  '/:id',
  checkNumericalParams('id'),
  async (req, res, next) => {
    const body: JSONBody = req.body

    try {
      // Updation with arrays should not be allowed
      if (Array.isArray(body)) {
        throw new ValidationError('Request body should be an object')
      }

      const categoryId = parseInt(req.params.id, 10)

      // the object that we will use to update the category
      const parsedBody = zUpdateCategory.parse(body)

      const updatedCategory = await categoryService.update(
        categoryId,
        parsedBody
      )

      res.status(statusCodes.OK).json(updatedCategory)
    } catch (err) {
      if (err instanceof ZodError) {
        next(
          new ValidationError(
            'Validation error during creation of categories',
            err.flatten()
          )
        )
      } else {
        next(err)
      }
    }
  }
)

export default categoryRouter
