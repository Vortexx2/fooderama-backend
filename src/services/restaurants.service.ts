import { db } from '../db'
import { Restaurant } from '@models/restaurants.model'
import { BaseRestaurant, RestObjOrArr } from '@declarations/restaurants'
import { NotFound } from '../errors'
// Imports Above

const { models } = db

// TODO: Check how to implement pagination if there are a lot of entries
// `findAndCountAll` might be a fix

/**
 *
 * @returns A promise to the array of all the `Restaurant`s in the database.
 */
export const findAll = async () => {
  return models.Restaurant.findAll()
}

/**
 *
 * @param id the id by which to search the `Restaurant` for in the DB.
 * @returns A promise to the Restaurant object that is stored in the DB or `null` if it does not exist.
 */
export const find = async (id: number) => {
  return models.Restaurant.findByPk(id)
}

/**
 * Inputs into the database the `rest` argument, either `bulkCreate`ing or `create`ing depending on if it is an array or an object.
 * @param rest the object or array that is supposed to be entried into the database. Can be both an array of restaurants or a singular restaurant.
 * @returns A promise to the created Restaurant(s)
 */
export const create = async <T extends BaseRestaurant | BaseRestaurant[]>(
  rest: T
): Promise<RestObjOrArr<T>> => {
  // the thing to be returned
  let res: Restaurant | Restaurant[]

  // check if the argument is an array
  if (Array.isArray(rest)) {
    return models.Restaurant.bulkCreate(rest, {
      // validate each row before entering in the DB
      // will fail even if validation on one fails
      validate: true,
    }) as Promise<RestObjOrArr<T>>
  }

  // argument is an object
  else {
    return models.Restaurant.create(rest) as Promise<RestObjOrArr<T>>
  }
}

/**
 * The update method definition for the REST API for restaurants. The `rest` object that will be sent will have all of the fields that restaurant has, even if it is not provided by the user, they will be updated by both the frontend logic and logic on the backend.
 * @param id id of the record you wanna update
 * @param payload object that has the fields that it wants to update of the selected record
 */
export const update = async (id: number, payload: Partial<BaseRestaurant>) => {
  const rest = await Restaurant.findByPk(id)

  if (!rest) {
    // throw custom error
    throw new NotFound(`Resource with id ${id} was not found`)
  }

  const updatedRest = await rest.update(payload)
  return updatedRest
}

/**
 *
 * @param whereObj this is the `where` parameter that will be passed into the `destroy` sequelize method (the `WHERE` that is written in SQL statements)
 * @returns A promise to the number of records destroyed
 */
export const del = async (whereObj: Partial<Restaurant>) => {
  return await Restaurant.destroy({
    where: {
      ...whereObj,
    },
  })
}
