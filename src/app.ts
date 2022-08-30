import 'dotenv/config'

import helmet from 'helmet'
import cors from 'cors'
import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'

import router from '@routes/index'
import {
  logCompleteInfo,
  logError,
  errorResponder,
  notFoundHandler,
} from '@middleware/logger'
import { db, checkDBConnection, syncDB } from './db'
// Imports above

/**
 * Creates an express app and returns it.
 * @param config the config needed to configure some of the middleware and settings
 * @returns the express app
 */
export default async function createApp(config: any) {
  const app = express()

  // set all headers and settings for express
  app.use(express.json())
  app.use(cookieParser())
  app.use(cors(config.get('corsSettings')))
  app.use(helmet(config.get('helmetSettings')))

  // perform all DB operations
  await checkDBConnection(db.sequelize)
  await syncDB(
    db.sequelize,
    config.get('dbConfig.force'),
    config.get('dbConfig.alter')
  )

  app.use(logCompleteInfo)

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
  })

  app.use('/api/v1', router)

  // error handling middleware - always at the end
  app.use(logError)
  app.use(errorResponder)
  app.use(notFoundHandler)

  return app
}
