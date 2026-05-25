import type { RequestHandler } from 'express';
import Product from '../models/product.js';
import { ProductCategory } from '../models/product.js';
import cloudinary from '../util/cloudinary.js';
import { validationResult } from 'express-validator';
import { Op } from 'sequelize';
import Stripe from 'stripe';

type RequestBody = {
  name: string;
  price: number;
  description: string;
  category: string;
  currency?: string;
};
type RequestParams = { prodId: string };

type err = {
  message: string;
  statusCode?: number;
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

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
  const query = req.query;
  const page =
    query.page && !isNaN(Number(query.page)) ? Number(query.page) : 1;
  const numPerPage =
    query.num && !isNaN(Number(query.num)) ? Number(query.num) : 100;
  const category = query.category ? String(query.category) : 'all';
  const name = query.name ? String(query.name) : undefined;
  const price = query.price ? Number(query.price) : undefined;
  const priceOp = query.op ? String(query.op) : 'eq';

  const whereClause: any = {};

  if (category && category !== 'all') {
    whereClause.category = category.toUpperCase() as ProductCategory;
  }

  if (name) {
    whereClause.name = { [Op.iLike]: `%${name}%` };
  }

  if (price !== undefined && !isNaN(price)) {
    switch (priceOp) {
      case 'gt':
        whereClause.price = { [Op.gt]: price };
        break;
      case 'gte':
        whereClause.price = { [Op.gte]: price };
        break;
      case 'lt':
        whereClause.price = { [Op.lt]: price };
        break;
      case 'lte':
        whereClause.price = { [Op.lte]: price };
        break;
      default:
        whereClause.price = price;
    }
  }

  try {
    const prods = (
      await Product.findAll({
        where: whereClause,
        limit: numPerPage,
        offset: (page - 1) * numPerPage,
      })
    ).map((prod) => {
      return prod.toJSON();
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

export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const cart = await req.user!.getCart();
    const result = await cart.getProducts();

    res.status(200).json({ message: 'Cart fetched.', cart: result });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const addCart: RequestHandler = async (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;
  let newQuantity = 1;
  try {
    let product;
    const cart = await req.user!.getCart();
    const cartProducts = await cart.getProducts({ where: { id: prodId } });
    if (cartProducts.length > 0) {
      product = cartProducts[0] as Product & {
        CartItem: { quantity: number };
      };
      newQuantity = product.CartItem.quantity + 1;
    } else {
      product = await Product.findByPk(prodId);
    }
    if (!product) {
      const error: err = new Error('Product not found.');
      error.statusCode = 404;
      throw error;
    }

    const result = await cart.addProduct(product, {
      through: { quantity: newQuantity },
    });

    res.status(200).json({ message: 'Product added to the cart.', cart: cart });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const deleteCart: RequestHandler = async (req, res, next) => {
  const params = req.params as RequestParams;
  const prodId = params.prodId;
  try {
    let product;
    const cart = await req.user!.getCart();
    const cartProducts = await cart.getProducts({ where: { id: prodId } });
    if (cartProducts.length > 0) {
      product = cartProducts[0] as Product & {
        CartItem: { quantity: number; destroy: () => Promise<void> };
      };
      await product.CartItem.destroy();
    }

    res
      .status(200)
      .json({ message: 'Product deleted from the cart.', cart: cart });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const postCheckout: RequestHandler = async (req, res, next) => {
  try {
    const body = req.body as RequestBody;
    const cart = await req.user!.getCart();
    const products = await cart.getProducts();
    if (products.length == 0) {
      return res.status(400).json({ message: 'empty cart.' });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((p) => {
        const product = p as Product & {
          CartItem: { quantity: number };
        };
        return {
          price_data: {
            currency: body?.currency || 'egp',
            product_data: {
              name: product.name,
              description: product.description,
              images: product.image.url ? [product.image.url] : [],
            },
            unit_amount: product.price * 100,
          },
          quantity: product.CartItem.quantity,
        };
      }),
      mode: 'payment',
      success_url: req.protocol + '://' + req.get('host') + '/shop/order/',
      cancel_url: req.protocol + '://' + req.get('host') + '/shop/cart/',
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const getOrder: RequestHandler = async (req, res, next) => {
  try {
    const cart = await req.user!.getCart();
    const products = await cart.getProducts();
    if (products.length == 0) {
      return res.status(400).json({ message: 'empty cart.' });
    }
    const order = await req.user!.createOrder();
    type ProdOrderType = Product & {
      OrderItem: { quantity: number };
      CartItem: { quantity: number };
    };
    const newOrder = await order.addProducts(
      products.map((p) => {
        const product = p as ProdOrderType;
        product.OrderItem = { quantity: product.CartItem.quantity };
        return product;
      }),
    );
    await cart.setProducts([]);
    res
      .status(201)
      .json({ message: 'Order created successfully!', order: newOrder });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};

export const getOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await req.user!.getOrders({ include: Product });
    res.status(200).json({ orders: orders });
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    throw err;
  }
};
