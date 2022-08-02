import { Request, Response, NextFunction } from 'express'
import { BadRequest } from '../errors'

/**
 * Validate the id parameter in the request and throws a `BadRequest` if it is not in a valid ID format.
 * @param req
 * @param res
 * @param next
 */
export function validateIdParam(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = parseInt(req.params.id, 10)

    if (isNaN(id)) {
      throw new BadRequest('Bad Parameter')
    }

    next()
  } catch (error: any) {
    next(error)
  }
}
