import { db } from './db'

// hook to be run before tests are run
beforeAll(async () => {
  try {
    // clear test DB of all records
    await db.sequelize.sync({
      force: true,
    })
  } catch (error: any) {}
})

afterAll(done => {
  db.sequelize.close()
  done()
})
