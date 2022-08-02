require('dotenv').config()
// All default config settings are defined below
// They can be imported anywhere through config.get('attr')

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
  },
  defaultRestaurantImage:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmVzdGF1cmFudHxlbnwwfHwwfHw%3D&w=1000&q=80',
}
