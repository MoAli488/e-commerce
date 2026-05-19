import type { RequestHandler } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import cloudinary from '../util/cloudinary.js';
import jwt from 'jsonwebtoken';

type RequestBody = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
};
type RequestParams = { userId: string };

type err = {
  message: string;
  statusCode?: number;
};

export const signup: RequestHandler = async (req, res, next) => {
  const body = req.body as RequestBody;
  const name = body.name;
  const email = body.email;
  const password = body.password;
  const phone = body.phone;
  const address = body.address;
  const city = body.city;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    const error: err = new Error('Validation Error.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const hashPw: string = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashPw,
      image: null,
      phone: phone,
      address: address,
      city: city.toUpperCase(),
    });

    res.status(201).json({ message: 'User Created!', user: newUser });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const login: RequestHandler = async (req, res, next) => {
  const body = req.body as RequestBody;
  const email = body.email;
  const password = body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error: err = new Error('Validation Error.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const user: User | null = await User.findOne({ where: { email: email } });

    if (!user) {
      const error: err = new Error('User does not exist.');
      error.statusCode = 404;
      throw error;
    }

    const hashedPw = user.password;

    const isEqual: boolean = await bcrypt.compare(password, hashedPw);

    if (!isEqual) {
      const error: err = new Error('Invalid password.');
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ userId: user.id }, `${process.env.JWT_SECRET}`, {
      expiresIn: '1h',
    });
    res
      .status(200)
      .json({ message: 'Login successful!', userId: user.id, token: token });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  const params = req.params as RequestParams;
  const userId = +params.userId;
  const errors = validationResult(req);

  if (userId !== (req.user!.id as number)) {
    const error: err = new Error('Not Authorized.');
    error.statusCode = 403;
    throw error;
  }

  if (!errors.isEmpty()) {
    const error: err = new Error('Validation Error.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const user: User | null = await User.findByPk(userId);

    if (!user) {
      const error: err = new Error('User does not exist.');
      error.statusCode = 404;
      throw error;
    }
    await user.destroy();
    res.status(200).json({ message: 'User Deleted.', user: user });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
