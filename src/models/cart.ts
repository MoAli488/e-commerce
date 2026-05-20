import sequelize from '../util/database.js';
import { Model, DataTypes } from 'sequelize';
import type Product from './product.js';
import type {
  BelongsToManyAddAssociationMixin,
  BelongsToManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

class Cart extends Model<InferAttributes<Cart>, InferCreationAttributes<Cart>> {
  declare id: CreationOptional<number>;

  declare getProducts: BelongsToManyGetAssociationsMixin<Product>;
  declare addProduct: BelongsToManyAddAssociationMixin<Product, number>;
}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
  },
  {
    sequelize,
    modelName: 'Cart',
    timestamps: true,
  },
);

export default Cart;
