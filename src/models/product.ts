import sequelize from '../util/database.js';
import { Model, DataTypes } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

export enum ProductCategory {
  ELECTRONICS = 'ELECTRONICS',
  CLOTHING = 'CLOTHING',
  BOOKS = 'BOOKS',
  HOME = 'HOME',
  BEAUTY = 'BEAUTY',
  SPORTS = 'SPORTS',
  OTHER = 'OTHER',
}

// 1. Declare your class extending Model with the proper inferences
class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  // 'CreationOptional' is used for fields that are auto-generated or have defaults (like primary keys)
  declare id: CreationOptional<number>;
  declare name: string;
  declare price: number;
  declare description: string;
  declare category: string;
}

// 2. Initialize the model schema directly onto the class instead of using sequelize.define()
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize, // Pass the connection instance here
    modelName: 'Product', // The name of the model
    timestamps: true,
  },
);

export default Product;
