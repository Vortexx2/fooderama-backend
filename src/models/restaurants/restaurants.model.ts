import { Sequelize, DataTypes } from 'sequelize';

import { restValidationConfig } from '../../constants/restaurants';
import Restaurant from './restaurants.class';
// Imports above

const {
  MAX_DESC_LEN,
  MAX_REST_LEN,
  MIN_REST_LEN,
  MIN_DESC_LEN,
  MIN_RATING,
  MAX_RATING,
} = restValidationConfig;

export default function (sequelize: Sequelize) {
  Restaurant.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      restName: {
        type: DataTypes.STRING(MAX_REST_LEN),
        allowNull: false,
        unique: {
          name: 'unique restName',
          msg: 'restName must be unique',
        },
        validate: {
          len: [MIN_REST_LEN, MAX_REST_LEN],
          isAlphanumeric: true,
        },
      },
      description: {
        type: DataTypes.STRING(MAX_DESC_LEN),
        allowNull: true,

        validate: {
          len: [MIN_DESC_LEN, MAX_DESC_LEN],
          isAlphanumeric: {
            msg: 'Restaurant Name should be alphanumeric only',
          },
        },
      },
      open: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
          min: MIN_RATING,
          max: MAX_RATING,
        },
      },
      openingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      closingTime: {
        type: DataTypes.TIME,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      sequelize,
    }
  );

  return Restaurant;
}
