import request from 'supertest'
import { Express } from 'express'

import config from 'config'
import createApp from '../app'
import { db } from '../db'

import mockData from '@constants/rest-mock-data.json'
import { endianness } from 'os'
// Imports above

let server: Express

beforeAll(async () => {
  server = await createApp(config)
})

afterAll(async () => {
  await db.sequelize.close()
})

describe('/restaurants', () => {
  test('GET on an empty DB', done => {
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

  test('POST a restaurant without any associations', done => {
    request(server)
      .post('/api/v1/restaurants')
      .send(mockData.basicRestaurant)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        expect(res.body).toHaveProperty('restId')
        return done()
      })
  })

  test('POST array of restaurants', done => {
    request(server)
      .post('/api/v1/restaurants')
      .send(mockData.multipleBasicRestaurants)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body).toHaveLength(mockData.multipleBasicRestaurants.length)

        return done()
      })
  })
})
