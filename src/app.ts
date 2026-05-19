import 'dotenv/config';
import cloudinary from './util/cloudinary.js';
import express from 'express';
import sequelize from './util/database.js';
import shopRouter from './routes/shop.js';
import authRouter from './routes/auth.js';
import Product from './models/product.js';
import User from './models/user.js';
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Welcome to the website!' });
});
app.use('/shop', shopRouter);
app.use('/auth', authRouter);

app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
  },
);

User.hasMany(Product, { onDelete: 'CASCADE' });
Product.belongsTo(User, {
  onDelete: 'CASCADE',
});

try {
  await sequelize.sync({ force: true });
  console.log('Database synced successfully.');
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}/`);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
