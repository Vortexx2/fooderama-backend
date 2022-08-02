import path from 'path'
import 'dotenv/config'
import favicon from 'serve-favicon'
import config from 'config'

import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'
import express, { Request, Response, NextFunction } from 'express'
// import sequelize from 'sequelize';

import logger from './logger'
import router from '@routes/index'
import { logCompleteInfo, logError, errorResponder } from '@middleware/logger'
import { db, checkDBConnection, syncDB } from './db'
// imports above

require('dotenv').config()

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
syncDB(db.sequelize, true, false)

app.use(logCompleteInfo)

app.use(logError)
app.use(errorResponder)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello World')
})

app.use('/api/v1', router)

export { app, config }
