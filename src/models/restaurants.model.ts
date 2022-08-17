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

import { restValidationConfig } from '@constants/restaurants'

import config from 'config'
import { Cuisine } from './cuisines.model'
// Imports above

const { MAX_DESC_LEN, MAX_REST_LEN } = restValidationConfig

export class Restaurant extends Model<
  InferAttributes<Restaurant, { omit: 'Cuisines' }>,
  InferCreationAttributes<Restaurant, { omit: 'Cuisines' }>
> {
  declare restId: CreationOptional<number>
  declare restName: string
  declare restImage: CreationOptional<string>
  declare description: CreationOptional<string>
  declare open: CreationOptional<boolean>
  declare rating: CreationOptional<number>
  declare openingTime: CreationOptional<string>
  declare closingTime: CreationOptional<string>

  declare Cuisines?: NonAttribute<Cuisine[]>

  declare static associations: {
    Cuisines: Association<Restaurant, Cuisine>
  }
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
      },
      restImage: {
        type: DataTypes.STRING(),
        allowNull: false,
        defaultValue: config.get('defaultRestaurantImage'),
      },
      description: {
        type: DataTypes.STRING(MAX_DESC_LEN),
        allowNull: true,
      },
      open: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
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
