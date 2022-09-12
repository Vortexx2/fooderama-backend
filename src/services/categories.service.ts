import { FindOptions, InferAttributes } from 'sequelize'
import { db } from '../db'

import { Category } from '@models/categories.model'
import { zCategoryType } from '@utils/zodSchemas/categorySchema'
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
