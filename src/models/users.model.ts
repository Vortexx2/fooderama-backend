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

import { userValidationConfig as config } from '@constants/users'
// Imports above

export class User extends Model<
  InferAttributes<User, { omit: never }>,
  InferCreationAttributes<User, { omit: never }>
> {
  declare userId: CreationOptional<number>

  // we'll have email and phone number both because if a user wants to reset their password, it might be much cheaper to send a reset mail rather than a text with OTP
  declare email: string
  declare password: string

  // parameters we'll add afterwards
  // declare phoneNumber: string
  // declare firstName: string
  // declare lastName: string
  // declare isVerified: CreationOptional<boolean>
  // declare resetPasswordToken: CreationOptional<string>
  // declare resetPasswordExpires: CreationOptional<Date>
}

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
          msg: 'Email provided must be unique',
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  )
}
