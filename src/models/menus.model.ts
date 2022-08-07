import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

// imports above

export class Menu extends Model<
  InferAttributes<Menu>,
  InferCreationAttributes<Menu>
> {
  declare menuId: CreationOptional<number>
}

export type menuModel = typeof Menu

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
  )

  // associations
  return Menu
}
