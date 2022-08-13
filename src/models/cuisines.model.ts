import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

import { cuisineValidationConfig as config } from '@constants/restaurants'
// Imports above

export class Cuisine extends Model<
  InferAttributes<Cuisine>,
  InferCreationAttributes<Cuisine>
> {
  declare cuisineId: CreationOptional<number>
  declare cuisineName: string
  static Restaurants: any
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
