import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { Restaurant } from './restaurants.model';
import { Dish } from './dishes.model';
// imports above

const config = {
  MIN_ITEMS: 0,
  MAX_ITEMS: 128,
};
// constants declaration

export class Menu extends Model<
  InferAttributes<Menu>,
  InferCreationAttributes<Menu>
> {
  declare menuId: CreationOptional<number>;
  declare totalItems: CreationOptional<number>;
}

export type menuModel = typeof Menu;

export function initMenu(sequelize: Sequelize) {
  Menu.init(
    {
      menuId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
      },
      totalItems: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: {
            args: [config.MIN_ITEMS],
            msg: `totalItems has to be greater than or equal to ${config.MIN_ITEMS}`,
          },
          max: {
            args: [config.MAX_ITEMS],
            msg: `totalItems has to be lesser than or equal to ${config.MAX_ITEMS}`,
          },
        },
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  );

  // associations
  Restaurant.hasOne(Menu, {
    foreignKey: {
      allowNull: false,
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
  Menu.belongsTo(Restaurant);

  return Menu;
}
