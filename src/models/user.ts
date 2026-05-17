import sequelize from '../util/database.js';
import { Model, DataTypes } from 'sequelize';
import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

// export enum City {
//   CAIRO = 'CAIRO',
//   ZATOUN = 'ZATOUN',
//   HAWAMDEIA = 'HAWAMDEIA',
//   MARG = 'MARG',
// }

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare email: string;
  declare password: string;
  declare image: { url: string; public_id: string } | null;
  declare phone: string;
  declare address: string;
  declare city: string;
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
  },
);

export default User;
