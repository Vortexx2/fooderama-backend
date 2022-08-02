require('dotenv').config()
// All default config settings are defined below
// They can be imported anywhere through config.get('attr')

module.exports = {
  host: 'localhost',
  port: 3000,
  postgres: 'postgres://compose-postgres:1234/fooderama-test', // this is not being used
  dbConfig: {
    port: 1234,
    host: 'localhost',
    dbName: 'fooderama-dev',
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
  },
}
