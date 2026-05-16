import type { RequestHandler } from 'express';
import User from '../models/user.js';
import { City } from '../models/user.js';
import bcrypt from 'bcryptjs';

type RequestBody = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
};
type RequestParams = { userId: string };

export const signup: RequestHandler = async (req, res, next) => {
  const body = req.body as RequestBody;
  const name = body.name;
  const email = body.email;
  const password = body.password;
  const phone = body.phone;
  const address = body.address;
  const city = body.city;

  try {
    const user: User | null = await User.findOne({ where: { email: email } });

    if (user) {
      return res.status(422).json({ message: 'User already exist.' });
    }

    const hashPw: string = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name: name,
      email: email,
      password: hashPw,
      phone: phone,
      address: address,
      city: city.toUpperCase() as City,
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

  try {
    const user: User | null = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist.' });
    }

    const hashedPw = user.password;

    const isEqual: boolean = await bcrypt.compare(password, hashedPw);

    if (!isEqual) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    // TODO: add JWT after login
    res.status(200).json({ message: 'Login successful!', userId: user.id });
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

  try {
    const user: User | null = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User does not exist.' });
    } else {
      await user.destroy();
      res.status(200).json({ message: 'User Deleted.', user: user });
    }
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
