import { Router } from 'express'
import { ZodError } from 'zod'

import * as userService from '@services/users.service'
import statusCodes from '@constants/status'
import { checkNumericalParams } from '@middleware/routing'
import { ValidationError } from 'errors'
import { JSONBody } from '@declarations/response'
import { zUser } from '@utils/zodSchemas/userSchema'
// Imports above

/** A new individual user router for integration into the main router */
const userRouter = Router()

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await userService.findAll()

    res.status(statusCodes.OK).json(users)
  } catch (err) {
    next(err)
  }
})

userRouter.get('/:id', checkNumericalParams('id'), async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10)
    const user = await userService.find(id)

    res.status(statusCodes.OK).json(user)
  } catch (err) {
    next(err)
  }
})

userRouter.post('/signup', async (req, res, next) => {
  const body: JSONBody = req.body

  try {
    const toBeUser = zUser.parse(body)

    res.status(statusCodes.OK).json(toBeUser)
  } catch (err) {
    if (err instanceof ZodError) {
      next(new ValidationError('Validation error during signup', err.flatten()))
    }
    next(err)
  }
})

export default userRouter
