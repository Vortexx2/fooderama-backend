require('dotenv').config()
const fs = require('fs')
// All default config settings are defined below
// They can be imported anywhere through config.get('attr')

let PUBLIC_ACCESS_KEY = null
let PRIVATE_ACCESS_KEY = null
let PUBLIC_REFRESH_KEY = null
let PRIVATE_REFRESH_KEY = null
try {
  PUBLIC_ACCESS_KEY = fs.readFileSync(__dirname + '/access.public.pem', 'utf-8')
  PRIVATE_ACCESS_KEY = fs.readFileSync(
    __dirname + '/access.private.pem',
    'utf-8'
  )
  PUBLIC_REFRESH_KEY = fs.readFileSync(
    __dirname + '/refresh.public.pem',
    'utf-8'
  )
  PRIVATE_REFRESH_KEY = fs.readFileSync(
    __dirname + '/refresh.private.pem',
    'utf-8'
  )
} catch (err) {
  console.error(
    'No Private and Public keys present in the config directory. Please follow readme to configure them'
  )
}

module.exports = {
  host: 'localhost',
  port: 4000,
  postgres: 'postgres://compose-postgres:1234/fooderama-test', // this is not being used
  dbConfig: {
    port: 1234,
    host: 'localhost',
    dbName: 'fooderama-dev',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    force: false,
    alter: true,
  },
  defaultRestaurantImage:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80',

  // settings to pass into cors
  corsSettings: {
    // below function only allows all cors requests that originate on `localhost`
    origin: (origin, cb) => {
      if (!origin || origin.startsWith('http://localhost')) {
        cb(null, true)
      } else {
        cb(new Error('Not allowed by CORS'))
      }
    },

    // allows cookies to be sent on the allowed origins from above
    credentials: true,
  },
  helmetSettings: { contentSecurityPolicy: false },
  cookieSettings: {
    httpOnly: true,
    secure: false,
    sameSite: false,
    // 1 day maxAge
    maxAge: 1000 * 60 * 60 * 24,
  },
  PUBLIC_ACCESS_KEY,
  PRIVATE_ACCESS_KEY,
  PUBLIC_REFRESH_KEY,
  PRIVATE_REFRESH_KEY,
  EMAIL_SECRET: process.env.EMAIL_SECRET,
  tokenExpiryTime: '15m',
  emailExpiryTime: '1d',
  homeUrl: 'http://localhost:4000/',
}
