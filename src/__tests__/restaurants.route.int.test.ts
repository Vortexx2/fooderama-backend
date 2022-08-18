import request from 'supertest'
import { Express } from 'express'

import config from 'config'
import createApp from '../app'
import { db } from '../db'
// Imports above

let server: Express

beforeAll(async () => {
  server = await createApp(config)
})

afterAll(async () => {
  await db.sequelize.close()
})

describe('GET /restaurants', () => {
  test('should return 200 and empty array', done => {
    request(server)
      .get('/api/v1/restaurants')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject([])

        done()
      })
  })
})
