import sequelize from '../util/database.js';
import { Model, DataTypes } from 'sequelize';
import cloudinary from '../util/cloudinary.js';
import type {
  HasManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneCreateAssociationMixin,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize';
import type Product from './product.js';
import Cart from './cart.js';
import type Order from './order.js';

class User extends Model<
  InferAttributes<User, { omit: 'products' }>,
  InferCreationAttributes<User, { omit: 'products' }>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare image: { url: string; public_id: string } | null;
  declare phone: string;
  declare address: string;
  declare city: string;

  declare products?: NonAttribute<Product[]>;

  declare getProducts: HasManyGetAssociationsMixin<Product>;
  declare addProduct: HasManyAddAssociationMixin<Product, number>;
  declare hasProduct: HasManyHasAssociationMixin<Product, number>;
  declare countProducts: HasManyCountAssociationsMixin;
  declare createProduct: HasManyCreateAssociationMixin<Product, 'UserId'>;
  declare getCart: HasOneGetAssociationMixin<Cart>;
  declare createCart: HasOneCreateAssociationMixin<Cart>;
  declare createOrder: HasManyCreateAssociationMixin<Order>;
  declare getOrders: HasManyGetAssociationsMixin<Order>;
}

User.init(
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
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.JSONB,
    },
    phone: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
    hooks: {
      beforeDestroy: async (user) => {
        const publicIds = (await user.getProducts({
          attributes: ['image']
        })).map((prod) => {
          return prod.image.public_id;
        });

        if (publicIds.length > 0) {
          await cloudinary.api.delete_resources(publicIds);
        }

        if (user.image?.public_id) {
          await cloudinary.uploader.destroy(user.image.public_id);
        }
      },
    },
  },
);

export default User;
