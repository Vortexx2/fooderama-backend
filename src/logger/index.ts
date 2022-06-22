import winston, { Logger, transports, format } from 'winston';
const { combine, timestamp, json, prettyPrint } = format;

const logger: Logger = winston.createLogger({
  level: 'info',
  format: combine(json(), timestamp({format: 'DD/MM/YY hh:mm'}), prettyPrint()),

  transports: [new transports.Console()]
});

export default logger;
