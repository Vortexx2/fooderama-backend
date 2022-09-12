import { Router } from 'express'

import * as categoryService from '@services/categories.service'
import { JSONBody } from '@declarations/express'
import { ValidationError } from 'errors/errors'
import { zCategory } from '@utils/zodSchemas/categorySchema'
import { ZodError } from 'zod'
import { statusCodes } from '@constants/status'

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
        new ValidationError('Validation error during creation of categories')
      )
    } else {
      next(err)
    }
  }
})

export default categoryRouter
