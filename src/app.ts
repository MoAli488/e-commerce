import express from 'express';
import sequelize from './util/database.js';
import dotenv from 'dotenv';
import shopRouter from './routes/shop.js';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();
app.use(express.json());

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

try {
  await sequelize.sync({ force: false });
  console.log('Database synced successfully.');
  app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}/`);
  });
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
