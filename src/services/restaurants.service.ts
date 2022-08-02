import { db } from '../db'
import { Restaurant } from '@models/restaurants/restaurants.model'
import { BaseRestaurant } from '@declarations/restaurants'
import { NotFound } from '../errors'

const { models } = db

// TODO: Check how to implement pagination if there are a lot of entries
// `findAndCountAll` might be a fix
export const findAll = async (): Promise<Restaurant[]> => {
  return models.Restaurant.findAll()
}

export const find = async (id: number): Promise<Restaurant | null> => {
  return models.Restaurant.findByPk(id)
}

export const create = async (
  rest: BaseRestaurant | BaseRestaurant[]
): Promise<Restaurant | Restaurant[]> => {
  if (Array.isArray(rest)) {
    return models.Restaurant.bulkCreate(rest, {
      // validate each row before entering in the DB
      // will fail even if validation on one fails
      validate: true,
    })
  } else {
    return models.Restaurant.create(rest)
  }
}

/**
 * The update method definition for the REST API for restaurants. The `rest` object that will be sent will have
 * all of the fields that restaurant has, even if it is not provided by the user, they will be updated by
 * both the frontend logic and logic on the backend.
 * @param rest A complete restaurant object with the parameters that need to be changed are changed as necessary
 */
export const update = async (
  id: number,
  payload: Partial<BaseRestaurant>
): Promise<Restaurant | null> => {
  const rest = await Restaurant.findByPk(id)

  if (!rest) {
    // throw custom error
    throw new NotFound(`Resource with id ${id} was not found`)
  }

  const updatedRest = await rest.update(payload)
  return updatedRest
}

export const del = async (whereObj: Partial<Restaurant>) => {
  return await Restaurant.destroy({
    where: {
      ...whereObj,
    },
  })
}
