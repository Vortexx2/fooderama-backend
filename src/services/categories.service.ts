import { FindOptions, InferAttributes, InstanceUpdateOptions } from 'sequelize'
import { db } from '../db'

import { Category } from '@models/categories.model'
import {
  zCategoryArrayType,
  zCategoryType,
  zUpdateCategoryType,
} from '@utils/zodSchemas/categorySchema'
import { NotFound } from '../errors/errors'
// Imports above

const { models } = db

export const findAll = async (
  options?: FindOptions<
    InferAttributes<Category, { omit: 'Restaurant' | 'Dishes' }>
  >
) => {
  return models.Category.findAll(options)
}

export const find = async (categoryId: number) => {
  return models.Category.findByPk(categoryId)
}

export const create = async (category: zCategoryType) => {
  return models.Category.create(category)
}

/**
 * Creates multiple categories if all of them pass the validation test.
 * @param categories Array of categories that we will create
 * @returns Array of created categories
 */
export const createAll = async (categories: zCategoryArrayType) => {
  return await models.Category.bulkCreate(categories, { validate: true })
}

/**
 * Updates a particular category instance with id = `categoryId`.
 * @param categoryId the `id` of the category that we want to update
 * @param updateCategory updation object for the particular category
 * @param options
 * @returns updated category
 */
export const update = async (
  categoryId: number,
  updateCategory: zUpdateCategoryType,
  options?: InstanceUpdateOptions<
    InferAttributes<Category, { omit: 'Restaurant' | 'Dishes' }>
  >
) => {
  const categoryToUpdate = await db.models.Category.findByPk(categoryId)

  if (!categoryToUpdate) {
    // throw custom error
    throw new NotFound(`Resource with id ${categoryId} was not found`)
  }

  return await categoryToUpdate.update(updateCategory, options)
}

/**
 * Deletes all categories which have the mentioned `restaurantId`
 * @param restaurantId the particular `restaurantId`s to delete, which has the particular categories
 * @returns the number of rows that are deleted
 */
export const deleteWithId = async (restaurantId: number) => {
  return await db.models.Category.destroy({
    where: {
      restId: restaurantId,
    },
  })
}
