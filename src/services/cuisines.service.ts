import { db } from '../db'

import { FindOptions, InferAttributes, InstanceUpdateOptions } from 'sequelize'
import { Cuisine } from '@models/cuisines.model'

import type { zCuisineType } from '@utils/zodSchemas/cuisineSchema'
import { NotFound } from '../errors/errors'
// Imports above

const { models } = db

export const findAll = async (
  options?: FindOptions<InferAttributes<Cuisine, { omit: never }>>
) => {
  return models.Cuisine.findAll(options)
}

export const find = async (cuisineId: number) => {
  return models.Cuisine.findByPk(cuisineId)
}

export const create = async (cuisine: zCuisineType) => {
  return models.Cuisine.create(cuisine)
}

// TODO: have a way to accept id: number[] and perform the correct logic to accept those arguments
export const update = async (
  id?: number,
  payload?: Partial<zCuisineType>,
  options?: InstanceUpdateOptions<InferAttributes<Cuisine, { omit: never }>>
) => {
  if (id && payload) {
    const foundCuisine = await models.Cuisine.findByPk(id)

    if (!foundCuisine) {
      // throw custom error if requested cuisine is not found
      throw new NotFound(`Cuisine with ${id} was not found`)
    }

    const updatedCuisine = foundCuisine.update(payload, options)
    return updatedCuisine
  }
}
