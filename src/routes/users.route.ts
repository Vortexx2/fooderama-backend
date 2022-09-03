import { Router } from 'express'
import { z, ZodError } from 'zod'
import { hash, compare } from 'bcrypt'
import _ from 'lodash'

import config from 'config'
import * as userService from '@services/users.service'
import { statusCodes } from '@constants/status'
import { checkNumericalParams } from '@middleware/routing'
import { GeneralError, Unauthorized, ValidationError } from 'errors'
import { JSONBody, RequestWithUser } from '@declarations/express'
import { zUser, zUserCookies } from '@utils/zodSchemas/userSchema'
import { db } from 'db'
import {
  validateJWT,
  isSignedIn,
  isParticularUserOrAdmin,
  hasPermissions,
} from '@middleware/auth'
import { canRefreshAccess, createToken, isAdmin } from '@utils/auth.utils'

// Imports above

/** Gets the `tokenExpiryTime` from the config, if not there it defaults to `'10m'` */
const TOKEN_EXPIRY = config.has('tokenExpiryTime')
  ? (config.get('tokenExpiryTime') as string)
  : '10m'

/** A new individual user router for integration into the main router */
const userRouter = Router()

userRouter.get(
  '/',
  validateJWT(),
  isSignedIn(),
  hasPermissions('admin'),
  async (req, res, next) => {
    try {
      // array to exclude when querying the database
      const exclude = ['password', 'refreshToken']

      const users = await userService.findAll({
        attributes: {
          exclude,
        },
      })

      res.status(statusCodes.OK).json(users)
    } catch (err) {
      next(err)
    }
  }
)

userRouter.get(
  '/:id',
  checkNumericalParams('id'),

  // check if JWT is valid and set the req.user property
  validateJWT(),

  // check if req.user property was properly set
  isSignedIn(),
  isParticularUserOrAdmin('id'),
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)

      const exclude = ['password', 'refreshToken']

      const user = await userService.findById(id, {
        attributes: {
          exclude,
        },
        rejectOnEmpty: false,
      })

      res.status(statusCodes.OK).json(user)
    } catch (err) {
      next(err)
    }
  }
)

userRouter.post('/signup', async (req, res, next) => {
  const body: JSONBody = req.body

  const transaction = await db.sequelize.transaction()

  try {
    const parsedUser = zUser.parse(body)

    const insertedUser = await userService.create(parsedUser, {
      transaction,
    })

    // if the create method by chance returns void (idk why this is possible, but upon adding options to the create method, there is a possibility it returns void)
    if (!insertedUser) {
      throw new GeneralError('Error while creating user')
    }

    // the user object which will be used to create a jwt from
    const user = {
      userId: insertedUser.userId,
      email: parsedUser.email,
      role: 'user',
    }

    const accessToken = createToken(
      user,
      config.get('PRIVATE_ACCESS_KEY'),
      TOKEN_EXPIRY
    )

    const refreshToken = createToken(user, config.get('PRIVATE_REFRESH_KEY'))

    await insertedUser.update({ refreshToken }, { transaction })

    // commit transaction and send the response
    await transaction.commit()
    res.status(statusCodes.OK).json({ accessToken, refreshToken })
  } catch (err) {
    await transaction.rollback()

    if (err instanceof ZodError) {
      next(new ValidationError('Validation error during signup', err.flatten()))
    } else {
      next(err)
    }
  }
})

userRouter.post('/login', async (req, res, next) => {
  const body: JSONBody = req.body

  try {
    if (Array.isArray(body)) {
      throw new ValidationError('Request body should be an object')
    } else {
      const zCheckedUserSchema = z.object({
        email: z.string().email(),
        password: z.string().max(256),
      })

      // user object that will be checked against the database
      const toBeCheckedUser = zCheckedUserSchema.parse(body)

      // dbUser will only have a value if it is found in the database
      const dbUser = await userService.findOne({
        where: {
          email: toBeCheckedUser.email,
        },
      })

      // User with this email does not exist in database
      if (!dbUser) {
        throw new ValidationError('Invalid email or password')
      }

      // true only if the passwords match
      const compareResult = await compare(
        toBeCheckedUser.password,
        dbUser.password
      )

      // if password provided does not match with the one in the database
      if (!compareResult) {
        throw new Unauthorized('Invalid email or password')
      }

      // user object to be signed as jwt
      const user = {
        userId: dbUser.userId,
        email: dbUser.email,
        role: dbUser.role,
      }

      const accessToken = createToken(
        user,
        config.get('PRIVATE_ACCESS_KEY'),
        TOKEN_EXPIRY
      )

      const refreshToken = createToken(user, config.get('PRIVATE_REFRESH_KEY'))

      await dbUser.update({ refreshToken })

      // send back the accessToken and the refreshToken as the response
      res.status(statusCodes.OK).json({ accessToken, refreshToken })
    }
  } catch (err) {
    if (err instanceof ZodError) {
      next(new ValidationError('Invalid email or password', err.flatten()))
    }
    next(err)
  }
})

userRouter.post('/refresh', async (req, res, next) => {
  try {
    const cookies = zUserCookies.parse(req.cookies)

    const { refresh_token, userId } = cookies

    const foundUser = await userService.findOne({
      where: {
        userId,
      },
    })

    // If userId provided in the cookies is invalid
    if (!foundUser) {
      throw new Unauthorized('Invalid cookies')
    }

    if (!canRefreshAccess(foundUser, refresh_token)) {
      throw new Unauthorized('Invalid cookies')
    }

    const userForToken = {
      userId,
      email: foundUser.email,
      role: foundUser.role,
    }

    const accessToken = createToken(
      userForToken,
      config.get('PRIVATE_ACCESS_KEY'),
      TOKEN_EXPIRY
    )

    res
      .status(statusCodes.OK)
      .json({ accessToken, refreshToken: refresh_token })
  } catch (err) {
    if (err instanceof ZodError) {
      next(new Unauthorized('Invalid cookies'))
    } else {
      next(err)
    }
  }
})

userRouter.put(
  '/:id',
  checkNumericalParams('id'),
  validateJWT(),
  isSignedIn(),
  isParticularUserOrAdmin('id'),
  async (req: RequestWithUser, res, next) => {
    const id = parseInt(req.params.id, 10)
    const body: JSONBody = req.body

    const transaction = await db.sequelize.transaction()
    try {
      if (Array.isArray(body)) {
        throw new ValidationError("Arrays can't be accepted for this operation")
      }

      const parsedUser = zUser.omit({ email: true }).partial().parse(body)

      if (parsedUser.password)
        parsedUser.password = await hash(parsedUser.password, 10)

      const updatedUser = await userService.update(id, parsedUser, {
        transaction,
      })

      const toBeReturnedUser = _.omit(updatedUser.get(), [
        'password',
        'refreshToken',
      ])

      if (updatedUser.userId !== id) {
        throw new Unauthorized('User is unauthorized')
      }

      await transaction.commit()
      res.status(statusCodes.OK).json(toBeReturnedUser)
    } catch (err) {
      await transaction.rollback()

      if (err instanceof ZodError) {
        next(
          new ValidationError('Validation error during updation', err.flatten)
        )
      } else {
        next(err)
      }
    }
  }
)

export default userRouter
