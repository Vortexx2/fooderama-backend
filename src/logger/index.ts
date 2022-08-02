import winston, { Logger, transports, format } from 'winston'
const { combine, timestamp, json, prettyPrint, colorize, printf } = format

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'blue',
    debug: 'green',
  },
}

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`
})

const logger: Logger = winston.createLogger({
  levels: customLevels.levels,
  format: combine(
    colorize(),
    timestamp({ format: 'DD/MM/YY hh:mm' }),
    myFormat
  ),

  transports: [
    new transports.Console({
      level: 'debug',
    }),
  ],
})

winston.addColors(customLevels.colors)

export default logger
