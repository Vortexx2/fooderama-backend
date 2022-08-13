import 'dotenv/config'
import config from 'config'

import helmet from 'helmet'
import cors from 'cors'
import express, { Request, Response } from 'express'
// import sequelize from 'sequelize';

import router from '@routes/index'
import {
  logCompleteInfo,
  logError,
  errorResponder,
  notFoundHandler,
} from '@middleware/logger'
import { db, checkDBConnection, syncDB } from './db'
// imports above

const app = express()

// set all headers and settings for express
app.use(express.json())
app.use(cors())
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
)

// perform all DB operations
checkDBConnection(db.sequelize)
syncDB(db.sequelize, false, true)

app.use(logCompleteInfo)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})

app.use('/api/v1', router)

// error handling middleware - always at the end
app.use(logError)
app.use(errorResponder)
app.use(notFoundHandler)

export { app, config }
