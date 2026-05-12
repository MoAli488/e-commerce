import express from 'express';

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

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}/`);
});
