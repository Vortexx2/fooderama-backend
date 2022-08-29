import { Router } from 'express'
import { ZodError } from 'zod'
import { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import * as userService from '@services/users.service'
import statusCodes from '@constants/status'
import { checkNumericalParams } from '@middleware/routing'
import { GeneralError, ValidationError } from 'errors'
import { JSONBody } from '@declarations/response'
import { zUser } from '@utils/zodSchemas/userSchema'
import { db } from 'db'
import { User } from '@models/users.model'
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

  const transaction = await db.sequelize.transaction()

  try {
    const parsedUser = zUser.parse(body)
    const hashedPass = await hash(parsedUser.password, 10)

    const toBeUser = {
      email: parsedUser.email,
      password: hashedPass,
    }

    const insertedUser = await userService.create(toBeUser, {
      transaction,
    })

    if (!insertedUser) {
      throw new GeneralError('Error while creating user')
    }

    const user = {
      id: insertedUser.userId,
      email: parsedUser.email,
    }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!)

    await transaction.commit()
    res.status(statusCodes.OK).json({ accessToken })
  } catch (err) {
    await transaction.rollback()

    if (err instanceof ZodError) {
      next(new ValidationError('Validation error during signup', err.flatten()))
    }
    next(err)
  }
})

export default userRouter
