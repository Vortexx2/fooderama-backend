import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Association,
  NonAttribute,
  HasManySetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyAddAssociationsMixin,
} from 'sequelize'

import config from 'config'

import { Cuisine } from './cuisines.model'
import { Category } from './categories.model'
import { restValidationConfig } from '@constants/restaurants'
// Imports above

const { MAX_DESC_LEN, MAX_REST_LEN } = restValidationConfig

export class Restaurant extends Model<
  InferAttributes<Restaurant, { omit: 'Cuisines' | 'Categories' }>,
  InferCreationAttributes<Restaurant, { omit: 'Cuisines' | 'Categories' }>
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
  declare Categories?: NonAttribute<Category[]>

  declare addCuisines: HasManyAddAssociationsMixin<
    Cuisine,
    Cuisine['cuisineId']
  >

  declare setCuisines: HasManySetAssociationsMixin<
    Cuisine,
    Cuisine['cuisineId']
  >
  declare setCategories: HasManySetAssociationsMixin<
    Category,
    Category['categoryId']
  >

  declare removeCategories: HasManyRemoveAssociationMixin<
    Category,
    Category['categoryId']
  >

  declare static associations: {
    // Restaurants m: n Cuisines
    Cuisines: Association<Restaurant, Cuisine>

    // Restaurants 1: m Categories
    Categories: Association<Restaurant, Category>
  }
}

export type TRestaurant = typeof Restaurant

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
