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

export class Admin extends Model<
  InferAttributes<Admin, { omit: never }>,
  InferCreationAttributes<Admin, { omit: never }>
> {
  declare adminId: CreationOptional<number>
  declare userId: ForeignKey<User['userId']>

  declare User?: NonAttribute<User>

  declare static associations: {
    // Admin 1: 1 User if User is an Admin
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
      userId: {
        type: DataTypes.INTEGER,
        unique: true,
      },
    },
    {
      hooks: {
        /**
         * Hook checks if a User is provided as an association, if that user already exists as an Manager or not. If they are an Manager already, it throws an error
         * @param attrs the attributes that exists on the admin model
         * @param options the options that contains the transaction properyy
         */
        async beforeCreate(attrs, options) {
          if (attrs.User) {
            const userId = attrs.User.userId

            const managerWithId = await db.models.Manager.findOne({
              where: {
                userId,
              },
              transaction: options.transaction,
            })

            if (managerWithId) {
              throw new ValidationError('Manager with given ID already exists')
            }
          }
        },
      },
      sequelize,
      timestamps: true,
    }
  )

  return Admin
}
