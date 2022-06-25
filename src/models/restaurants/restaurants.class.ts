import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

class Restaurant extends Model<
  InferAttributes<Restaurant>,
  InferCreationAttributes<Restaurant>
> {
  declare id: number;
  declare restName: string;
  declare description: CreationOptional<string>;
  declare open: boolean;
  declare rating: CreationOptional<number>;
  declare openingTime: CreationOptional<Date>;
  declare closingTime: CreationOptional<Date>;
}

export default Restaurant;
