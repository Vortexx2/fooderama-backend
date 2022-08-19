import request from 'supertest'
import { Express } from 'express'

import config from 'config'
import createApp from '../app'
import { db } from '../db'

import mockData from '@constants/rest-mock-data.json'
import { checkIfAscIds } from './utils'
// Imports above

let server: Express

beforeAll(async () => {
  server = await createApp(config)
})

afterAll(done => {
  db.sequelize.close()
  done()
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

  let restIdOfRestaurantWithCuisine: number
  test('POST a restaurant for which Cuisines now exist', done => {
    request(server)
      .post(RESTAURANTS_ENDPOINT)
      .send(mockData.restaurantWithCuisines)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        expect(res.body).toHaveProperty('restId')
        expect(typeof res.body.restId).toBe('number')

        restIdOfRestaurantWithCuisine = res.body.restId
        return done()
      })
  })

  test('GET /restaurants/:id with cuisines', done => {
    request(server)
      .get(
        RESTAURANTS_ENDPOINT + `/${restIdOfRestaurantWithCuisine}?cuisines=true`
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        expect(res.body).toHaveProperty('restId')
        expect(res.body.restId).toBe(restIdOfRestaurantWithCuisine)
        expect(res.body).toHaveProperty('Cuisines')

        return done()
      })
  })

  test('GET /restaurants with sort', done => {
    request(server)
      .get(
        RESTAURANTS_ENDPOINT +
          '?cuisines=true&orderby=restId&sort=asc&open=true'
      )
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)

        // check if what we have received is an array
        expect(Array.isArray(res.body)).toBe(true)
        const arrayOfRestaurants = res.body

        // check if array of restaurants has Cuisines included and only the open ones are included
        expect(
          arrayOfRestaurants.reduce(
            (isValidArray: boolean, currRest: Record<string, any>) => {
              if (!isValidArray) return false

              // Check if there is a `Cuisines` property on each restaurant
              if (!Object.prototype.hasOwnProperty.call(currRest, 'Cuisines'))
                return false

              // Check if each restaurant is actually open
              if (!currRest.open) return false

              return true
            },
            true
          )
        ).toBe(true)

















        
        // check if ?sort=asc has worked or not
        expect(checkIfAscIds(arrayOfRestaurants, 'restId')).toBe(true)
        return done()
      })
  })
})
