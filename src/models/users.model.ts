import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Association,
} from 'sequelize'

import { userValidationConfig as config } from '@constants/users'
import { Admin } from './admins.model'
import { Manager } from './managers.model'
// Imports above

export class User extends Model<
  InferAttributes<User, { omit: never }>,
  InferCreationAttributes<User, { omit: never }>
> {
  declare userId: CreationOptional<number>

  // we'll have email and phone number both because if a user wants to reset their password, it might be much cheaper to send a reset mail rather than a text with OTP
  declare email: string
  declare password: string
  declare refreshToken: CreationOptional<string>

  // parameters we'll add afterwards
  // declare firstName: string
  // declare lastName: string
  // declare isVerified: CreationOptional<boolean>
  // declare resetPasswordToken: CreationOptional<string>
  // declare resetPasswordExpires: CreationOptional<Date>

  declare Admin?: NonAttribute<Admin>

  declare static associations: {
    // Admin 1: 1 User if User is an Admin
    Admin: Association<User, Admin>
    // Manager 1: 1 User if User is an Manager
    Manager: Association<User, Manager>
  }
}

export type TUser = typeof User

export function initUser(sequelize: Sequelize) {
  User.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(config.MAX_EMAIL_LEN),
        allowNull: false,
        unique: {
          name: 'email',
          msg: 'Provided email must be unique',
        },
        validate: {
          isEmail: {
            msg: 'Provided email is not valid',
          },
        },
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
          is: config.JWT_REGEX,
        },
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  )

  return User
}
