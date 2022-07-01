import { db } from '../sequelize';
import { BaseRestaurant } from '../declarations/restaurants';

// TODO check typing fix by seeing results here
const { models } = db;
const Restaurant = models.Restaurant;

// TODO: Check how to implement pagination if there are a lot of entries
// `findAndCountAll` might be a fix
export const findAll = async (): Promise<typeof Restaurant[]> => {
  return Restaurant.findAll();
};

export const find = async (id: number): Promise<typeof Restaurant | null> => {
  return Restaurant.findByPk(id);
};

export const create = async (
  rest: BaseRestaurant
): Promise<typeof Restaurant> => {
  return Restaurant.create(rest);
};
