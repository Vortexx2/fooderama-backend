import {
  FindOptions,
  InferAttributes,
  InstanceUpdateOptions,
  NonNullFindOptions,
} from 'sequelize/types'

import { db } from 'db'
import { TUser, User } from '@models/users.model'
import { zUserType } from '@utils/zodSchemas/userSchema'
import { NotFound } from 'errors'

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

export const update = async (
  id: number,
  user: Partial<zUserType>,
  options?: InstanceUpdateOptions<InferAttributes<User, { omit: never }>>
) => {
  const foundUser = await User.findByPk(id)

  if (!foundUser) {
    throw new NotFound(`Resource with ${id} not found`)
  }

  const updatedUser = await foundUser.update(user, options)
  return updatedUser
}
