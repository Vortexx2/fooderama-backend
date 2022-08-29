import {
  FindOptions,
  InferAttributes,
  NonNullFindOptions,
} from 'sequelize/types'

import { db } from 'db'
import { TUser, User } from '@models/users.model'
import { zUserType } from '@utils/zodSchemas/userSchema'

// Imports above

const { models } = db

export const findAll = async (options?: FindOptions<TUser>) => {
  return models.User.findAll(options)
}

export const findById = async (
  id: number,
  options?: Omit<NonNullFindOptions<TUser>, 'where'>
) => {
  return models.User.findByPk(id, options)
}

export const findOne = async (
  options?: FindOptions<InferAttributes<User, { omit: never }>>
) => {
  return models.User.findOne(options)
}

export const create = async (user: zUserType, options?: any) => {
  return models.User.create(user, options)
}
