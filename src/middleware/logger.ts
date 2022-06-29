import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

import logger from '../logger';
import { CustomError } from '../errors';

export function logReqInfo(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.path}`);
  next();
}

export function logCompleteInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on('finish', () => {
    logger.info(
      `${req.method} ${req.originalUrl} : Response Status Code ${res.statusCode}`
    );
  });

  next();
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
  logger.error(err.message);
  next();
};

/**
 * Final middleware to send json of error to user. Will contain stacktrace as well.
 * @param err Error of custom type (eventually will be implemented)
 * @param req Request
 * @param res Response
 * @param next Next
 */
export const errorResponder: ErrorRequestHandler = (
  err: CustomError,
  req,
  res,
  next
) => {
  res.status(err.code).json(err);
};
