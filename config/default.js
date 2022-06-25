// All default config settings are defined below
// They can be imported anywhere through config.get('attr')

module.exports = {
  host: 'localhost',
  port: 3000,
  postgres: 'postgres://compose-postgres:5432/fooderama-test',
  dbConfig: {
    port: 1234,
    host: 'localhost',
    dbName: 'fooderama-dev',
    username: 'postgres',
    password: 'pass',
  },
};
