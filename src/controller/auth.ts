import type { RequestHandler } from 'express';
import type User from '../models/user.js';
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

let id = 0;
const users: User[] = [];

export const signup: RequestHandler = async (req, res, next) => {
  const body = req.body as RequestBody;
  const name = body.name;
  const email = body.email;
  const password = body.password;
  const phone = body.phone;
  const address = body.address;
  const city = body.city;

  const usrId: number = users.findIndex((user: User) => {
    return user.email === email;
  });

  if (usrId !== -1) {
    return res.status(422).json({ message: 'User already exist.' });
  }

  const hashPw: string = await bcrypt.hash(password, 12);

  const newUser: User = {
    _id: ++id,
    name: name,
    email: email,
    password: hashPw,
    phone: phone,
    address: address,
    city: city.toUpperCase() as City,
  };

  users.push(newUser);
  res.status(201).json({ message: 'User Created!', user: newUser });
};

export const login: RequestHandler = async (req, res, next) => {
  const body = req.body as RequestBody;
  const email = body.email;
  const password = body.password;

  const user = users.find((u: User) => {
    return u.email === email;
  });

  if (!user) {
    return res.status(404).json({ message: 'User does not exist.' });
  }

  const hashedPw = user.password;

  const isEqual: boolean = await bcrypt.compare(password, hashedPw);

  if (!isEqual) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  res.status(200).json({ message: 'Login successful!', userId: user._id });
};

export const deleteUser: RequestHandler = (req, res, next) => {
  const params = req.params as RequestParams;
  const userId = +params.userId;

  const user: User | undefined = users.find((u: User) => {
    return u._id === userId;
  });

  if (!user) {
    res.status(404).json({ message: 'User does not exist.' });
  } else {
    const newUsers: User[] = users.filter((u: User) => {
      return u._id !== user._id;
    });
    res.status(200).json({ message: 'User Deleted.', users: newUsers });
  }
};
