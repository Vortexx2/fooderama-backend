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

import { categoryValidationConfig as config } from '@constants/restaurants'

import { Dish } from './dishes.model'
import { Restaurant } from './restaurants.model'

// imports above

export class Category extends Model<
  InferAttributes<Category, { omit: 'Restaurant' | 'Dishes' }>,
  InferCreationAttributes<Category, { omit: 'Restaurant' | 'Dishes' }>
> {
  declare categoryId: CreationOptional<number>
  declare categoryName: string
  declare sortId: number
  // declare description: CreationOptional<string>

  declare Restaurant?: NonAttribute<Restaurant>
  declare Dishes?: NonAttribute<Dish[]>

  declare restId: ForeignKey<Restaurant['restId']>
  declare dishId: ForeignKey<Dish['dishId']>

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
        autoIncrement: true,
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
      sortId: {
        type: DataTypes.SMALLINT,
        allowNull: false,
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
