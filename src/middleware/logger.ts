import logger from '../logger';
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

function logReqInfo(req: Request, res: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.path}`);
  next();
}

function logCompleteInfo(req: Request, res: Response, next: NextFunction) {
  res.on('finish', () => {
    logger.info(
      `${req.method} ${req.originalUrl} : Response Status Code ${res.statusCode}`
    );
  });

  next();
}

// TODO: customise TS to understand custom `err` type
/**
 * Middleware to log the error to the correct transport. 
 * @param err Error of custom type (eventually will be implemented)
 * @param req Request
 * @param res Response
 * @param next Next
 */
const logError: ErrorRequestHandler = (err, req, res, next) => {
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
const errorResponder: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.statusCode).json(err);
}

export { logReqInfo, logCompleteInfo, logError };
