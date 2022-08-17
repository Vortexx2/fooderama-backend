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

import { menuValidationConfig as config } from '@constants/restaurants'
import { Category } from './categories.model'
// Imports above

export class Dish extends Model<
  InferAttributes<Dish, { omit: 'Category' }>,
  InferCreationAttributes<Dish, { omit: 'Category' }>
> {
  declare dishId: CreationOptional<number>
  declare dishName: string
  declare description: CreationOptional<string>

  declare Category?: NonAttribute<Category>

  declare static associations: {
    // Dish m : 1 Category
    Category: Association<Dish, Category>
  }
}

export type dishModel = typeof Dish

export function initDish(sequelize: Sequelize) {
  Dish.init(
    {
      dishId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
      },
      dishName: {
        type: DataTypes.STRING(config.MAX_DISH_LEN),
        allowNull: false,
        validate: {
          len: {
            args: [config.MIN_DISH_LEN, config.MAX_DISH_LEN],
            msg: `Dish Name has to be between ${config.MIN_DISH_LEN} and ${config.MAX_DISH_LEN} characters in length`,
          },
        },
      },
      description: {
        type: DataTypes.STRING(config.MAX_DESC_LEN),
        allowNull: true,
        validate: {
          len: {
            args: [config.MIN_DESC_LEN, config.MAX_DESC_LEN],
            msg: `Dish Description has to between ${config.MIN_DESC_LEN} and ${config.MAX_DESC_LEN} characters in length`,
          },
        },
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  )

  return Dish
}
