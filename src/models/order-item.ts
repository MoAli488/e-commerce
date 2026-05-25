import sequelize from '../util/database.js';
import { Model, DataTypes } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare id: CreationOptional<number>;
  declare quantity: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    timestamps: true,
  },
);

export default OrderItem;
