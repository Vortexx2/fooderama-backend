import { db } from 'db';
import { Menu } from '@models/menus.model';
import { NotFound } from 'errors';
// imports above

const { models } = db;

export const findAll = async () => {
  return models.Menu.findAll();
};

export const find = async (id: number) => {
  return models.Menu.findByPk(id);
};

export const create = async (payload: Menu | Menu[]) => {
  if (Array.isArray(payload)) {
    return models.Menu.bulkCreate(payload, {
      // validates each and every record before creating
      validate: true,
    });
  } else {
    return models.Menu.create(Menu);
  }
};

export const update = async (id: number, payload: Menu) => {
  const menu = await models.Menu.findByPk(id);

  if (!menu) {
    // throw custom error, if menu to update not found
    throw new NotFound(`Resource with id ${id} was not found`);
  }

  return menu.update(payload);
};
