import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
  ForeignKey,
} from 'sequelize'

import { db } from 'db'
import { User } from './users.model'
import { ValidationError } from 'errors'
// Imports above

export class Manager extends Model<
  InferAttributes<Manager, { omit: never }>,
  InferCreationAttributes<Manager, { omit: never }>
> {
  declare managerId: CreationOptional<number>
  declare userId: ForeignKey<User['userId']>

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
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
      },
    },
    {
      hooks: {
        /**
         * Hook checks if a User is provided as an association, if that user already exists as an Admin or not. If they are an Admin already, it throws an error
         * @param attrs the attributes that exists on the manager model
         * @param options the options that contains the transaction properyy
         */
        async beforeCreate(attrs, options) {
          if (attrs.User) {
            const userId = attrs.User.userId

            const adminWithId = await db.models.Admin.findOne({
              where: {
                userId,
              },
              transaction: options.transaction,
            })

            if (adminWithId) {
              throw new ValidationError('Admin with given ID already exists')
            }
          }
        },
      },
      sequelize,
      timestamps: true,
    }
  )

  return Manager
}
