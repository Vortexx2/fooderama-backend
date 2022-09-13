import { NextFunction, Request, Response, Router } from 'express'
import { ZodError } from 'zod'

import * as categoryService from '@services/categories.service'
import { JSONBody } from '@declarations/express'
import { ValidationError } from '../errors/errors'
import { zCategory, zUpdateCategory } from '@utils/zodSchemas/categorySchema'
import { statusCodes } from '@constants/status'
import { checkNumericalParams } from '@middleware/routing'
import { db } from 'db'

// Imports above

const categoryRouter = Router()

categoryRouter.post('/', createCategory)

categoryRouter.put('/:id', checkNumericalParams('id'), updateCategory)

async function createCategory(req: Request, res: Response, next: NextFunction) {
  const transaction = await db.sequelize.transaction()
  const body: JSONBody = req.body
  try {
    if (Array.isArray(body)) {
      throw new ValidationError('Request body should be an object')
    }

    const createdCategory = await categoryService.create(
      zCategory.parse(body),
      {
        include: {
          model: db.models.Dish,
        },
        transaction,
      }
    )

    await transaction.commit()
    res.status(statusCodes.OK).json(createdCategory)
  } catch (err) {
    await transaction.rollback()
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

async function updateCategory(req: Request, res: Response, next: NextFunction) {
  const body: JSONBody = req.body

  try {
    // Updation with arrays should not be allowed
    if (Array.isArray(body)) {
      throw new ValidationError('Request body should be an object')
    }

    const categoryId = parseInt(req.params.id, 10)

    // the object that we will use to update the category
    const parsedBody = zUpdateCategory.parse(body)

    const updatedCategory = await categoryService.update(categoryId, parsedBody)

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

export default categoryRouter
