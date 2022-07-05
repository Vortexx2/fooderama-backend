import { db } from './db';

// hook to be run before tests are run
beforeAll(async () => {

  // clear test DB of all records
  await db.sequelize.sync({
    force: true,
  });
});

afterAll(done => {
  db.sequelize.close();
  done();
});
