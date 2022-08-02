import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

import { restValidationConfig } from '@constants/restaurants'

import config from 'config'
// Imports above

const {
  MAX_DESC_LEN,
  MAX_REST_LEN,
  MIN_REST_LEN,
  MIN_DESC_LEN,
  MIN_RATING,
  MAX_RATING,
} = restValidationConfig

export class Restaurant extends Model<
  InferAttributes<Restaurant>,
  InferCreationAttributes<Restaurant>
> {
  declare restId: CreationOptional<number>
  declare restName: string
  declare restImage: CreationOptional<string>
  declare description: CreationOptional<string>
  declare open: CreationOptional<boolean>
  declare rating: CreationOptional<number>
  declare openingTime: CreationOptional<Date>
  declare closingTime: CreationOptional<Date>
}

export type restModel = typeof Restaurant

export function initRestaurant(sequelize: Sequelize) {
  Restaurant.init(
    {
      restId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      restName: {
        type: DataTypes.STRING(MAX_REST_LEN),
        allowNull: false,
        unique: {
          name: 'restName',
          msg: 'Restaurant name must be unique',
        },
        validate: {
          len: {
            args: [MIN_REST_LEN, MAX_REST_LEN],
            msg: `restName must be between ${MIN_REST_LEN} and ${MAX_REST_LEN} characters in length`,
          },
        },
      },
      restImage: {
        type: DataTypes.STRING(),
        allowNull: false,
        defaultValue: config.get('defaultRestaurantImage'),
        validate: {
          isUrl: {
            msg: 'Restaurant image URL must be a valid URL',
          },
        },
      },
      description: {
        type: DataTypes.STRING(MAX_DESC_LEN),
        allowNull: true,

        validate: {
          len: {
            args: [MIN_DESC_LEN, MAX_DESC_LEN],
            msg: `Description must be between ${MIN_DESC_LEN} and ${MAX_DESC_LEN} characters in length`,
          },
        },
      },
      open: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: {
            args: [MIN_RATING],
            msg: `Rating must be greater than or equal to ${MIN_RATING}`,
          },
          max: {
            args: [MAX_RATING],
            msg: `Rating must be lesser than or equal to ${MAX_RATING}`,
          },
        },
      },
      openingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      closingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      sequelize,
    }
  )

  return Restaurant
}
