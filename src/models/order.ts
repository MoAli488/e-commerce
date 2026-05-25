import sequelize from '../util/database.js';
import { Model, DataTypes } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  BelongsToManyAddAssociationsMixin,
} from 'sequelize';
import type Product from './product.js';

class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare addProducts: BelongsToManyAddAssociationsMixin<Product, number>;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    timestamps: true,
  },
);

export default Order;
