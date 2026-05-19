import type { RequestHandler } from 'express';
import Product from '../models/product.js';
import { ProductCategory } from '../models/product.js';
import cloudinary from '../util/cloudinary.js';
import { validationResult } from 'express-validator';

type RequestBody = {
  name: string;
  price: number;
  description: string;
  category: string;
};
type RequestParams = { prodId: string };

type err = {
  message: string;
  statusCode?: number;
};

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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error: err = new Error('Validation Error.');
    error.statusCode = 422;
    throw error;
  }
  try {
    const product = await Product.findByPk(prodId);
    if (!product) {
      const error: err = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }
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
  const price: number = +body.price;
  const description = body.description;
  const category = body.category;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error: err = new Error('Validation Error.');
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error: err = new Error('No file uploaded.');
    error.statusCode = 400;
    throw error;
  }

  const fileBase64 = req.file.buffer.toString('base64');
  const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;

  try {
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: 'ecommerce',
    });

    const newProduct = await req.user!.createProduct({
      name: name,
      price: price,
      image: { url: result.secure_url, public_id: result.public_id },
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error: err = new Error('Validation Error.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const product = await Product.findByPk(prodId);
    if (!product) {
      const error: err = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    if (product.UserId !== req.user!.id) {
      const error: err = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    let image = product.image;

    const body = req.body as RequestBody;

    if (req.file) {
      cloudinary.uploader.destroy(image.public_id);
      const fileBase64 = req.file.buffer.toString('base64');
      const fileUri = `data:${req.file.mimetype};base64,${fileBase64}`;
      const result = await cloudinary.uploader.upload(fileUri, {
        folder: 'ecommerce',
      });
      image = { url: result.secure_url, public_id: result.public_id };
    }

    product.set({
      name: body.name,
      price: +body.price,
      image: image,
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error: err = new Error('Validation Error.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const product = await Product.findByPk(prodId);
    if (!product) {
      const error: err = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    if (product.UserId !== req.user!.id) {
      const error: err = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }

    await product.destroy();

    res.status(200).json({ message: 'Product Deleted!', product: product });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
