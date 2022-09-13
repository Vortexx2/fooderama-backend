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

import { dishValidationConfig as config } from '@constants/restaurants'
import { Category } from './categories.model'
// Imports above

export class Dish extends Model<
  InferAttributes<Dish, { omit: 'Category' }>,
  InferCreationAttributes<Dish, { omit: 'Category' }>
> {
  declare dishId: CreationOptional<number>
  declare dishName: string
  declare price: number
  declare sortId: number
  // declare description: CreationOptional<string>

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
        comment:
          'The name that the dish has. Can contain the size of the dish, if it has one, in parentheses next to the name of the dish (like seen on Zomato)',
      },
      price: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        validate: {
          max: config.MAX_PRICE,
        },
      },
      sortId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // description: {
      //   type: DataTypes.STRING(config.MAX_DESC_LEN),
      //   allowNull: true,
      //   validate: {
      //     len: {
      //       args: [config.MIN_DESC_LEN, config.MAX_DESC_LEN],
      //       msg: `Dish Description has to between ${config.MIN_DESC_LEN} and ${config.MAX_DESC_LEN} characters in length`,
      //     },
      //   },
      // },
    },
    {
      sequelize,
      timestamps: true,
    }
  )

  return Dish
}
