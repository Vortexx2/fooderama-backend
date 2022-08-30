import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'

import { Unauthorized } from 'errors'
import { getJWTFromHeader } from '@utils/auth.utils'
import { RequestWithUser } from '@declarations/express'
import { statusCodes } from '@constants/status'
// Imports above

export function isSignedIn() {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    req.user ? next() : next(new Unauthorized('User is unauthorized'))
  }
}

export function validateJWT() {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const token = getJWTFromHeader(req.headers['authorization'])

      // below decodes the user object from the jwt and sets it on the request object
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const user = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as JwtPayload

      // set the user property on the request object, so that we can pass it along
      req.user = user
      next()
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        next(new Unauthorized('Malformed JWT'))
      } else next(err)
    }
  }
}
