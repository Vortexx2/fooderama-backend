import { NextFunction, Response } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import config from 'config'
import { Unauthorized } from 'errors'
import { getJWTFromHeader } from '@utils/auth.utils'
import { RequestWithUser } from '@declarations/express'
import { Roles, UserInJwt } from '@declarations/users'
// Imports above

export function validateJWT() {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const token = getJWTFromHeader(req.headers['authorization'])

      // below decodes the user object from the jwt and sets it on the request object
      const user = jwt.verify(
        token,
        config.get('PUBLIC_ACCESS_KEY')
      ) as UserInJwt

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
/**
 * Checks if there a user property has been set on the request body, else an error is thrown
 */
export function isSignedIn() {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    req.user ? next() : next(new Unauthorized('User is unauthorized'))
  }
}

/**
 * Middleware to check if user has enough authorization or not. Authorization (for now) is built linearly: user -> manager -> admin
 * @param permissionRequired the permission that will be required for a particular operation to be carried out
 * @returns middleware which goes to the next middleware if user has enough authorization
 */
export function hasPermissions(permissionRequired: Roles) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      // edge case where user is not defined on the request body
      if (!req.user) {
        throw new Unauthorized('User is unauthorized')
      }

      switch (req.user.role) {
        case 'admin':
          break

        case 'manager':
          if (permissionRequired === 'admin')
            throw new Unauthorized('User is unauthorized')

          break

        case 'user':
          if (permissionRequired !== 'user')
            throw new Unauthorized('User is unauthorized')

          break

        default:
          throw new Unauthorized('User is unauthorized')
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

/**
 * Checks if user is either a particular user (to grant access to modify contents of their own details) or is an admin.
 * @param id the id that we have to make sure is of the issuer
 * @returns goes to the next middleware
 */
export function isParticularUserOrAdmin(fieldToCheck: string) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      // edge case where user is not defined on the request body
      if (!req.user) {
        throw new Unauthorized('User is unauthorized')
      }

      if (
        req.user.userId === parseInt(req.params[fieldToCheck], 10) ||
        req.user.role === 'admin'
      ) {
        next()
      } else {
        throw new Unauthorized('User is unauthorized')
      }
    } catch (err) {
      next(err)
    }
  }
}
