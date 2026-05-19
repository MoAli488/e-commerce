import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  'ecommerce_db',
  'mo',
  `${process.env.DATABASE_PASSWORD}`,
  {
    host: `${process.env.DATABASE_URL}`,
    dialect: 'postgres',
    // logging: console.log,
    logging: false,
  },
);

export default sequelize;
