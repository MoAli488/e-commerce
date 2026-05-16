import type { RequestHandler } from 'express';
import Product from '../models/product.js';
import { ProductCategory } from '../models/product.js';

type RequestBody = {
  name: string;
  price: number;
  description: string;
  category: string;
};
type RequestParams = { prodId: string };

export const getHome: RequestHandler = async (req, res, next) => {
  try {
    const prods = (await Product.findAll()).map((user) => {
      return user.toJSON();
    });
    res.status(200).json({ message: 'hello from shop', products: prods });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const getProducts: RequestHandler = async (req, res, next) => {
  try {
    const prods = (await Product.findAll()).map((user) => {
      return user.toJSON();
    });
    res.status(200).json({ products: prods });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const getProduct: RequestHandler = async (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;
  try {
    const product = await Product.findByPk(prodId);
    if (!product)
      return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json({ product: product });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const postProduct: RequestHandler = async (req, res, next) => {
  const body = req.body as RequestBody;
  const name = body.name;
  const price = body.price;
  const description = body.description;
  const category = body.category;

  try {
    const newProduct = await Product.create({
      name: name,
      price: price,
      description: description,
      category: category.toUpperCase() as ProductCategory,
    });

    res.status(201).json({ message: 'Product Created!', prod: newProduct });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const putProduct: RequestHandler = async (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;

  try {
    const product = await Product.findByPk(prodId);
    if (!product)
      return res.status(404).json({ message: 'Product not found.' });

    const body = req.body as RequestBody;

    product.set({
      name: body.name,
      price: body.price,
      description: body.description,
      category: body.category as ProductCategory,
    });

    await product.save();

    res.status(200).json({ message: 'Product Updated!', product: product });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const deleteProduct: RequestHandler = async (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;

  try {
    const product = await Product.findByPk(prodId);
    if (!product)
      return res.status(404).json({ message: 'Product not found.' });

    await product.destroy();

    res.status(200).json({ message: 'Product Deleted!', product: product });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
