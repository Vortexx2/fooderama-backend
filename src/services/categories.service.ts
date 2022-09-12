import { FindOptions, InferAttributes, InstanceUpdateOptions } from 'sequelize'
import { db } from '../db'

import { Category } from '@models/categories.model'
import {
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
