import { ErrorRequestHandler, Request, Response, NextFunction } from 'express'

import logger from '../logger'
import statusCodes from '@constants/status'
import { CustomError, NotFound } from '../errors'

// Imports above

export function logReqInfo(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.path}`)
  next()
}

export function logCompleteInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    logger.info(
      `${req.method} ${req.originalUrl} : Response Status Code ${res.statusCode}`
    )
  })

  next()
}

/**
 * Middleware to log the error to the correct transport.
 * @param err Error of custom type (eventually will be implemented)
 * @param req Request
 * @param res Response
 * @param next Next
 */
export const logError: ErrorRequestHandler = (
  err: CustomError,
  req,
  res,
  next
) => {
  logger.error(err.message)
  next(err)
}

/**
 * Final middleware to send json of error to user. Will contain stacktrace as well.
 * @param err Error of custom type (eventually will be implemented)
 * @param req Request
 * @param res Response
 * @param _next Next
 */
export const errorResponder: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  // _next has to be specified, otherwise express won't recognise it as a valid error middleware
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.code).json(err)
  } else {
    const code = statusCodes['Internal Server Error']

    const { message, name, ...rest } = err
    const customErr = new CustomError(
      message,
      name,
      code,
      err.constructor.name,
      rest
    )

    res.status(code).json(customErr)
  }
}

/**
 * Handler to take care of any requests that occur for routes that are not registered.
 * @param req express Request object
 * @param res express Response object
 */
export const notFoundHandler = (req: Request, res: Response) => {
  const notFoundErr = new NotFound("Requested resource can't be found")
  res.status(statusCodes['Not Found']).json(notFoundErr)
}
