import { NextFunction, Request, Response } from 'express'
import jwt, { JsonWebTokenError } from 'jsonwebtoken'

import { Unauthorized } from 'errors'
import statusCodes from '@constants/status'
// Imports above

export function validateJWT() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers['authorization']?.split(' ')[1]

      if (!token) {
        next()
      } else {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!)

        res.status(statusCodes.OK).json({ accessToken: token })
      }
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        next(new Unauthorized('Malformed JWT'))
      }
      next(err)
    }
  }
}
