import { db } from '../sequelize';
import { Restaurant } from '../models/restaurants/restaurants.model';
import { BaseRestaurant } from '../declarations/restaurants';

const { models } = db;

// TODO: Check how to implement pagination if there are a lot of entries
// `findAndCountAll` might be a fix
export const findAll = async (): Promise<Restaurant[]> => {
  return models.Restaurant.findAll();
};

export const find = async (id: number): Promise<Restaurant | null> => {
  return models.Restaurant.findByPk(id);
};

export const create = async (rest: BaseRestaurant): Promise<Restaurant> => {
  return models.Restaurant.create(rest);
};
