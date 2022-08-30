import { Router } from 'express'
import { z, ZodError } from 'zod'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

import * as userService from '@services/users.service'
import { statusCodes } from '@constants/status'
import { checkNumericalParams } from '@middleware/routing'
import { GeneralError, Unauthorized, ValidationError } from 'errors'
import { JSONBody } from '@declarations/express'
import { zUser } from '@utils/zodSchemas/userSchema'
import { db } from 'db'
import { validateJWT, isSignedIn } from '@middleware/auth'
// Imports above

/** A new individual user router for integration into the main router */
const userRouter = Router()

userRouter.get('/', validateJWT(), isSignedIn(), async (req, res, next) => {
  try {
    const users = await userService.findAll({
      attributes: {
        exclude: ['password'],
      },
    })

    res.status(statusCodes.OK).json(users)
  } catch (err) {
    next(err)
  }
})

userRouter.get(
  '/:id',
  checkNumericalParams('id'),

  // check if JWT is valid and set the req.user property
  validateJWT(),

  // check if req.user property was properly set
  isSignedIn(),
  async (req, res, next) => {
    try {
      const id = parseInt(req.params.id, 10)
      const user = await userService.findById(id, {
        attributes: {
          exclude: ['password'],
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
    const hashedPass = await hash(parsedUser.password, 10)

    // user object that will be used to insert into the database
    const toBeUser = {
      email: parsedUser.email,
      password: hashedPass,
    }

    const insertedUser = await userService.create(toBeUser, {
      transaction,
    })

    // if the create method by chance returns void (idk why this is possible, but upon adding options to the create method, there is a possibility it returns void)
    if (!insertedUser) {
      throw new GeneralError('Error while creating user')
    }

    // the user object which will be used to create a jwt from
    const user = {
      id: insertedUser.userId,
      email: parsedUser.email,
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
      algorithm: 'RS256',
    })

    // commit transaction and send the response
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
        id: dbUser.userId,
        email: dbUser.email,
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!)

      // send back the accessToken as the response
      res.status(statusCodes.OK).json({ accessToken })
    }
  } catch (err) {
    if (err instanceof ZodError) {
      next(new ValidationError('Invalid email or password', err.flatten()))
    }
    next(err)
  }
})

export default userRouter
