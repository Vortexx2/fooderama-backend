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

import { cuisineValidationConfig as config } from '@constants/restaurants'
import { Restaurant } from './restaurants.model'
// Imports above

export class Cuisine extends Model<
  InferAttributes<Cuisine, { omit: 'Restaurants' }>,
  InferCreationAttributes<Cuisine, { omit: 'Restaurants' }>
> {
  declare cuisineId: CreationOptional<number>
  declare cuisineName: string

  // Cuisine belongsToMany Restaurants
  declare Restaurants?: NonAttribute<Restaurant>

  declare static associations: {
    // Cuisines m : n Restaurants
    Restaurants: Association<Cuisine, Restaurant>
  }
}

export function initCuisine(sequelize: Sequelize) {
  Cuisine.init(
    {
      cuisineId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cuisineName: {
        type: DataTypes.STRING(config.MAX_CUISINE_LEN),
        unique: {
          name: 'cuisineName',
          msg: 'Cuisine name must be unique',
        },
        allowNull: false,
      },
    },
    {
      timestamps: true,
      sequelize,
    }
  )

  return Cuisine
}
