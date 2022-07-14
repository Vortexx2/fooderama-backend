import { db } from 'db';
import { Menu } from '@models/menus.model';

const { models } = db;
export const findAll = async (): Promise<Menu[]> => {
  return models.Menu.findAll();
};

export const find = async (id: number): Promise<Menu | null> => {
  return models.Menu.findByPk(id);
};
