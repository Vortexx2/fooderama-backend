import {
  FindOptions,
  InferAttributes,
  NonNullFindOptions,
} from 'sequelize/types'

import { db } from 'db'
import { TUser } from '@models/users.model'
import { zUserType } from '@utils/zodSchemas/userSchema'

// Imports above

const { models } = db

export const findAll = async (options?: FindOptions<TUser>) => {
  return models.User.findAll(options)
}

export const find = async (
  id: number,
  options?: Omit<NonNullFindOptions<TUser>, 'where'>
) => {
  return models.User.findByPk(id, options)
}

export const create = async (user: zUserType, options?: any) => {
  return models.User.create(user, options)
}
