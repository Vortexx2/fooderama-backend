import { CookieOptions, Router } from 'express'
import { z, ZodError } from 'zod'
import { hash, compare } from 'bcrypt'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'
import _ from 'lodash'

import config from 'config'
import * as userService from '@services/users.service'
import { statusCodes } from '@constants/status'
import { checkNumericalParams } from '@middleware/routing'
import { GeneralError, Unauthorized, ValidationError } from '../errors/errors'
import { JSONBody, RequestWithUser } from '@declarations/express'
import { zUser, zUserCookies } from '@utils/zodSchemas/userSchema'
import { db } from '../db'
import {
  validateJWT,
  isSignedIn,
  isParticularUserOrAdmin,
  hasPermissions,
} from '@middleware/auth'
import {
  canRefreshAccess,
  clearCookies,
  createToken,
  isAdmin,
} from '@utils/auth.utils'
import { sendVerificationMail } from '@utils/mailer.utils'
import { UserInAccessJwt, UserInEmailJwt } from '@declarations/users'

// Imports above

/** Gets the `tokenExpiryTime` from the config, if not there it defaults to `'10m'` */
const TOKEN_EXPIRY = config.has('tokenExpiryTime')
  ? (config.get('tokenExpiryTime') as string)
  : '10m'

// const COOKIE_SETTINGS = config.has('cookieSettings')
//   ? config.get('cookieSettings')
//   : {}

const COOKIE_SETTINGS: CookieOptions = config.has('cookieSettings')
  ? config.get('cookieSettings')
  : {}

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

/** Confirm a user with the email that gets sent to their email */
userRouter.get('/confirmation/:token', async (req, res, next) => {
  try {
    const token = req.params.token

    if (!token) {
      throw new Unauthorized('Token is not specified')
    }

    const { userId } = jwt.verify(
      token,
      config.get('EMAIL_SECRET')
    ) as UserInEmailJwt

    await userService.update(userId, {
      activated: true,
    })

    res.redirect(config.get('homeUrl'))
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      next(new Unauthorized(err.message))
    } else next(err)
  }
})

/** The logout route clears all relevant cookies, so as to logout the user */
userRouter.get('/logout', (req, res, next) => {
  try {
    clearCookies(res, ['userId', 'refreshToken'])
    res.json({ success: true })
  } catch (err) {
    next(new Unauthorized('Logout unsuccessful'))
  }
})

/** Refresh your access token */
userRouter.get('/refresh', async (req, res, next) => {
  try {
    const cookies = zUserCookies.parse(req.cookies)

    const { refreshToken, userId } = cookies

    const foundUser = await userService.findOne({
      where: {
        userId,
      },
    })

    // If userId provided in the cookies is invalid
    if (!foundUser || !canRefreshAccess(foundUser, refreshToken)) {
      clearCookies(res, ['userId', 'refreshToken'])
      throw new Unauthorized('Invalid cookies')
    }

    const userForToken: UserInAccessJwt = {
      userId,
      email: foundUser.email,
      role: foundUser.role,
      activated: foundUser.activated,
    }

    const accessToken = createToken(
      userForToken,
      config.get('PRIVATE_ACCESS_KEY'),
      TOKEN_EXPIRY
    )

    res
      .status(statusCodes.OK)
      .cookie('refreshToken', refreshToken, COOKIE_SETTINGS)
      .cookie('userId', userId, COOKIE_SETTINGS)
      .json({ accessToken })
  } catch (err) {
    if (err instanceof ZodError) {
      clearCookies(res, ['userId', 'refreshToken'])
      next(new Unauthorized('Invalid cookies'))
    } else {
      next(err)
    }
  }
})

/** Get a particular user */
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

/** Signup for a new user */
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
    const user: UserInAccessJwt = {
      userId: insertedUser.userId,
      email: insertedUser.email,
      role: 'customer',
      activated: true,
    }

    const accessToken = createToken(
      user,
      config.get('PRIVATE_ACCESS_KEY'),
      TOKEN_EXPIRY
    )

    const refreshToken = createToken(user, config.get('PRIVATE_REFRESH_KEY'))

    await insertedUser.update({ refreshToken }, { transaction })

    // FIXME: No verification email will be sent for now
    // sendVerificationMail(insertedUser)

    // commit transaction and send the response
    await transaction.commit()
    res
      .status(statusCodes.OK)
      .cookie('refreshToken', refreshToken, COOKIE_SETTINGS)
      .cookie('userId', insertedUser.userId, COOKIE_SETTINGS)
      .json({ accessToken })
  } catch (err) {
    // if (err instanceof GeneralError && err.message === )
    await transaction.rollback()

    if (err instanceof ZodError) {
      next(new ValidationError('Validation error during signup', err.flatten()))
    } else {
      next(err)
    }
  }
})

// Login user
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

      // throw error if blacklisted
      if (dbUser.blacklisted) {
        throw new Unauthorized(
          'Your account has been blacklisted. Contact an admin'
        )
      }

      // user object to be signed as jwt
      const user: UserInAccessJwt = {
        userId: dbUser.userId,
        email: dbUser.email,
        role: dbUser.role,
        activated: dbUser.activated,
      }

      const accessToken = createToken(
        user,
        config.get('PRIVATE_ACCESS_KEY'),
        TOKEN_EXPIRY
      )

      const refreshToken = createToken(user, config.get('PRIVATE_REFRESH_KEY'))

      await dbUser.update({ refreshToken })

      // send back the accessToken and the refreshToken as the response
      res
        .status(statusCodes.OK)
        .cookie('refreshToken', refreshToken, COOKIE_SETTINGS)
        .cookie('userId', dbUser.userId, config.get('cookieSettings'))
        .json({ accessToken })
    }
  } catch (err) {
    if (err instanceof ZodError) {
      next(new ValidationError('Invalid email or password', err.flatten()))
    }
    next(err)
  }
})

// Update user in database
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

      const parsedUser = zUser
        .extend({
          blacklisted: z.union([
            z.boolean(),
            z.enum(['true', 'false']).transform(val => val === 'true'),
          ]),
        })
        .omit({ email: true })
        .partial()
        .parse(body)

      // if user has `blacklisted` property
      if (Object.prototype.hasOwnProperty.call(parsedUser, 'blacklisted')) {
        // if user exists on request
        if (req.user) {
          // throw error if user is not an admin on JWT
          if (!isAdmin(req.user)) {
            throw new Unauthorized('User is unauthorized')
          }
        }
      }

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
