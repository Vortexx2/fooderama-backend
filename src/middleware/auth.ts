import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'

import config from 'config'
import { Unauthorized } from 'errors'
import { getJWTFromHeader } from '@utils/auth.utils'
import { RequestWithUser } from '@declarations/express'
// Imports above

/**
 * Checks if there a user property has been set on the request body, else an error is thrown
 */
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
        config.get('PUBLIC_ACCESS_KEY')
      ) as JwtPayload

      // set the user property on the request object, so that we can pass it along
      req.user = user
      next()
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        next(new Unauthorized(err.message))
      } else next(err)
    }
  }
}
