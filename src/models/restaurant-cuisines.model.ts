import {
  Sequelize,
  Model,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from 'sequelize'
import { Cuisine } from './cuisines.model'
import { Restaurant } from './restaurants.model'

// Imports above

export class RestaurantCuisine extends Model<
  InferAttributes<RestaurantCuisine>,
  InferCreationAttributes<RestaurantCuisine>
> {
  // foreign keys don't normally need to be declared, but while writing queries with junction tables, these are needed for type annotations
  declare restId: ForeignKey<Restaurant['restId']>
  declare cuisineId: ForeignKey<Cuisine['cuisineId']>
}

export function initRestaurantCuisine(sequelize: Sequelize) {
  RestaurantCuisine.init(
    {},
    {
      sequelize,
      timestamps: true,
    }
  )

  return RestaurantCuisine
}
