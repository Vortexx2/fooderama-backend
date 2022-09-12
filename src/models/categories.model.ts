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
import { Dish } from './dishes.model'

import { Restaurant } from './restaurants.model'
// imports above

// config for validation
const config = {
  MIN_CAT_LEN: 3,
  MAX_CAT_LEN: 50,
  MIN_DESC_LEN: 5,
  MAX_DESC_LEN: 256,
}

export class Category extends Model<
  InferAttributes<Category, { omit: 'Restaurant' | 'Dishes' }>,
  InferCreationAttributes<Category, { omit: 'Restaurant' | 'Dishes' }>
> {
  declare categoryId: CreationOptional<number>
  declare categoryName: string
  // declare description: CreationOptional<string>

  declare Restaurant?: NonAttribute<Restaurant>
  declare Dishes?: NonAttribute<Dish[]>

  declare static associations: {
    Restaurant: Association<Category, Restaurant>
    Dishes: Association<Category, Dish>
  }
}

export type categoryModel = typeof Category

export function initCategory(sequelize: Sequelize) {
  Category.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
      },
      categoryName: {
        type: DataTypes.STRING(config.MAX_CAT_LEN),
        allowNull: false,
        validate: {
          len: {
            args: [config.MIN_CAT_LEN, config.MAX_CAT_LEN],
            msg: `Category name must be between ${config.MIN_CAT_LEN} and ${config.MAX_CAT_LEN} characters in length`,
          },
        },
      },
      // description: {
      //   type: DataTypes.STRING(config.MAX_DESC_LEN),
      //   allowNull: true,
      //   validate: {
      //     len: {
      //       args: [config.MIN_DESC_LEN, config.MAX_DESC_LEN],
      //       msg: `Category description must be between ${config.MIN_DESC_LEN} and ${config.MAX_DESC_LEN} characters in length`,
      //     },
      //   },
      // },
    },
    {
      sequelize,
      timestamps: true,
    }
  )

  return Category
}
