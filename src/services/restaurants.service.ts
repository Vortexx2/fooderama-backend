import Restaurant from '../models/restaurants/restaurants.class';
import { BaseRestaurant } from '../declarations/restaurants';

// TODO: Check how to implement pagination if there are a lot of entries
// `findAndCountAll` might be a fix
export const findAll = async (): Promise<Restaurant[]> => {
  return Restaurant.findAll();
};

export const find = async (id: number): Promise<Restaurant | null> => {
  return Restaurant.findByPk(id);
};

export const create = async (rest: BaseRestaurant): Promise<Restaurant> => {
  return Restaurant.create(rest);
}
