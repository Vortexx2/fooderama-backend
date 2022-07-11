import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

import { Restaurant } from './restaurants.model';

export class Menu extends Model<
  InferAttributes<Menu>,
  InferCreationAttributes<Menu>
> {
  declare id: CreationOptional<number>;
  declare totalItems: CreationOptional<number>;
}

export type menuModel = typeof Menu;

export function initMenu(sequelize: Sequelize) {
  Menu.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
      },
      totalItems: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  );

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
