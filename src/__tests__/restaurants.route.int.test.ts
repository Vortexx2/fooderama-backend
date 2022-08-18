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

const RESTAURANTS_ENDPOINT = '/api/v1/restaurants'
const CUISINES_ENDPOINT = '/api/v1/cuisines'

describe('/restaurants', () => {
  test('GET on an empty DB', done => {
    request(server)
      .get(RESTAURANTS_ENDPOINT)
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
      .post(RESTAURANTS_ENDPOINT)
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
      .post(RESTAURANTS_ENDPOINT)
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

  test('POST restaurants that should fail due to validation errors', done => {
    for (const creationRestaurant of mockData.multipleFailingRestaurants) {
      request(server)
        .post(RESTAURANTS_ENDPOINT)
        .send(creationRestaurant.data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(creationRestaurant.error)
        .end((err, res) => {
          if (err) return done(err)

          return done()
        })
    }
  })

  test("POST a restaurant with Cuisines which should fail since Cuisines don't exist yet", done => {
    request(server)
      .post(RESTAURANTS_ENDPOINT)
      .send(mockData.restaurantWithCuisines)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)

        return done()
      })
  })

  test('POST multiple cuisines for future use', done => {
    for (const creationCuisine of mockData.validCreationCuisines) {
      request(server)
        .post(CUISINES_ENDPOINT)
        .send(creationCuisine)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)

          expect(res.body).toHaveProperty('cuisineId')
          return done()
        })
    }
  })
})
