import sequelize from '../util/database.js';
import { Model, DataTypes } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

class CartItem extends Model<
  InferAttributes<CartItem>,
  InferCreationAttributes<CartItem>
> {
  declare id: CreationOptional<number>;
  declare quantity: number;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: 'CartItem',
    timestamps: true,
  },
);

export default CartItem;
