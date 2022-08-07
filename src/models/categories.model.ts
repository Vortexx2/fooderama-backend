import {
  Sequelize,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

// imports above

// config for validation
const config = {
  MIN_CAT_LEN: 3,
  MAX_CAT_LEN: 50,
  MIN_DESC_LEN: 5,
  MAX_DESC_LEN: 256,
}

export class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare categoryId: CreationOptional<number>
  declare categoryName: string
  declare description: CreationOptional<string>
}

export type categoryModel = typeof Category

export function initCategory(sequelize: Sequelize) {
  Category.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrementIdentity: true,
      },
      categoryName: {
        type: DataTypes.STRING(config.MAX_CAT_LEN),
        allowNull: false,
        validate: {
          len: {
            args: [config.MIN_CAT_LEN, config.MAX_CAT_LEN],
            msg: `Category name must be between ${config.MIN_CAT_LEN} and ${config.MAX_CAT_LEN} characters in length`,
          },
        },
      },
      description: {
        type: DataTypes.STRING(config.MAX_DESC_LEN),
        allowNull: true,
        validate: {
          len: {
            args: [config.MIN_DESC_LEN, config.MAX_DESC_LEN],
            msg: `Category name must be between ${config.MIN_DESC_LEN} and ${config.MAX_DESC_LEN} characters in length`,
          },
        },
      },
    },
    {
      sequelize,
      timestamps: true,
    }
  )

  return Category
}
