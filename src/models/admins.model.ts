import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
} from 'sequelize'

import { User } from './users.model'
// Imports above

export class Admin extends Model<
  InferAttributes<Admin, { omit: never }>,
  InferCreationAttributes<Admin, { omit: never }>
> {
  declare adminId: CreationOptional<number>

  declare User?: NonAttribute<User>

  declare static associations: {
    // Admin 1: 1 User if if User is an Admin
    User: Association<Admin, User>
  }
}

export function initAdmin(sequelize: Sequelize) {
  Admin.init(
    {
      adminId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  )

  return Admin
}
