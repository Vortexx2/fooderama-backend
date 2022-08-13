import {
  Sequelize,
  Model,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

// Imports above

export class RestaurantCuisine extends Model<
  InferAttributes<RestaurantCuisine>,
  InferCreationAttributes<RestaurantCuisine>
> {}

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
