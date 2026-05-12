import type { RequestHandler } from 'express';
import type Product from '../models/product.js';
import { ProductCategory } from '../models/product.js';

type RequestBody = {
  name: string;
  price: number;
  description: string;
  category: string;
};
type RequestParams = { prodId: string };

let id = 0;
const prods: Product[] = [];

export const getHome: RequestHandler = (req, res, next) => {
  res.status(200).json({ message: 'hello from shop', products: prods });
};

export const getProducts: RequestHandler = (req, res, next) => {
  res.status(200).json({ products: prods });
};

export const getProduct: RequestHandler = (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;
  const product: Product | undefined = prods.find((prod: Product) => {
    return prod._id === +prodId;
  });
  if (!product) return res.status(404).json({ message: 'Product not found.' });
  res.status(200).json({ product: product });
};

export const postProduct: RequestHandler = (req, res, next) => {
  const body = req.body as RequestBody;
  const name = body.name;
  const price = body.price;
  const description = body.description;
  const category = body.category;

  const newProduct: Product = {
    _id: ++id,
    name: name,
    price: price,
    description: description,
    category: category.toUpperCase() as ProductCategory,
  };

  prods.push(newProduct);
  res.status(201).json({ message: 'Product Created!', prod: newProduct });
};

export const putProduct: RequestHandler = (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;

  const product: Product | undefined = prods.find((prod: Product) => {
    return prod._id === +prodId;
  });
  if (!product) return res.status(404).json({ message: 'Product not found.' });

  const body = req.body as RequestBody;

  product.name = body.name;
  product.price = body.price;
  product.description = body.description;
  product.category = body.category as ProductCategory;

  res.status(200).json({ message: 'Product Updated!', product: product });
};

export const deleteProduct: RequestHandler = (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;

  const ind: number = prods.findIndex((prod: Product) => {
    return prod._id === +prodId;
  });

  if (ind >= 0) {
    prods.splice(ind, 1);
    res.status(200).json({ message: 'Product Deleted!', products: prods });
  } else res.status(404).json({ message: 'Product not found.' });
};
