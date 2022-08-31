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

export class Manager extends Model<
  InferAttributes<Manager, { omit: never }>,
  InferCreationAttributes<Manager, { omit: never }>
> {
  declare managerId: CreationOptional<number>

  declare User?: NonAttribute<User>

  declare static associations: {
    // Admin 1: 1 User if if User is an Admin
    User: Association<Manager, User>
  }
}

export function initManager(sequelize: Sequelize) {
  Manager.init(
    {
      managerId: {
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

  return Manager
}
