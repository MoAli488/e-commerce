import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

type err = {
  message: string;
  statusCode?: number;
};

const isAuth: RequestHandler = (req: any, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error: err = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    const error: err = new Error('Not authenticated');
    error.statusCode = 401;
    throw error;
  }
  let decodedToken: any;
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_SECRET}`);
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
  if (!decodedToken) {
    const error: err = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  User.findByPk(decodedToken.userId)
    .then((user: User | null) => {
      if (!user) {
        const error: err = new Error('User does not exist');
        error.statusCode = 404;
        throw error;
      }
      req.user = user;
      next();
    })
    .catch((err: any) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export default isAuth;
