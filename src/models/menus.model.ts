import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { Restaurant } from './restaurants.model';
import { Category } from './categories.model';
// imports above

export class Menu extends Model<
  InferAttributes<Menu>,
  InferCreationAttributes<Menu>
> {
  declare menuId: CreationOptional<number>;
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

  // Menu.hasMany(Category, {
  //   foreignKey: {
  //     allowNull: false,
  //   },
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // });
  // Category.belongsTo(Menu);

  return Menu;
}
