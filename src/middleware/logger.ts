import logger from '../logger';
import { Request, Response, NextFunction } from 'express';

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

export { logReqInfo, logCompleteInfo };
