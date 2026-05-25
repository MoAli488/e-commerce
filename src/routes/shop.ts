import { Router } from 'express';
import upload from '../util/multerUpload.js';
import * as shopController from '../controllers/shop.js';
import { body, param, query } from 'express-validator';
import { ProductCategory } from '../models/product.js';
import isAuth from '../middleware/is-auth.js';

const router = Router();

const validCategory = new Set(Object.values(ProductCategory));

// GET Home Page shop
router.get('/', shopController.getHome);

// GET All Products
router.get(
  '/products',
  query('category')
    .optional()
    .trim()
    .custom((val) => {
      if (!validCategory.has(val.toUpperCase as ProductCategory)) {
        throw Error('the value is NOT a product category.');
      }
      return true;
    }),
  shopController.getProducts,
);

// GET Product
router.get(
  '/product/:prodId',
  param('prodId').trim().isNumeric().escape(),
  shopController.getProduct,
);

// POST Product
router.post(
  '/product/',
  isAuth,
  upload.single('image'),
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .escape(),
    body('price')
      .trim()
      .notEmpty()
      .withMessage('Price is required')
      .isNumeric(),
    body('description').trim().escape(),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .custom((val: any) => {
        if (typeof val !== 'string') {
          throw new Error('Category must be a string');
        }
        if (!validCategory.has(val.toUpperCase() as ProductCategory)) {
          throw new Error('Invalid category value');
        }
        return true;
      }),
  ],
  shopController.postProduct,
);

// PUT Product
router.put(
  '/product/:prodId',
  isAuth,
  upload.single('image'),
  [
    param('prodId').trim().isNumeric().escape(),
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .escape(),
    body('price')
      .trim()
      .notEmpty()
      .withMessage('Price is required')
      .isNumeric(),
    body('description').trim().escape(),
    body('category')
      .trim()
      .notEmpty()
      .withMessage('Category is required')
      .custom((val: any) => {
        if (typeof val !== 'string') {
          throw new Error('Category must be a string');
        }
        if (!validCategory.has(val.toUpperCase() as ProductCategory)) {
          throw new Error('Invalid category value');
        }
        return true;
      }),
  ],
  shopController.putProduct,
);

// DELETE Product
router.delete(
  '/product/:prodId',
  isAuth,
  param('prodId').trim().isNumeric().escape(),
  shopController.deleteProduct,
);

router.get('/cart', isAuth, shopController.getCart);

router.post(
  '/cart/:prodId',
  isAuth,
  param('prodId').trim().isNumeric().escape(),
  shopController.addCart,
);

router.delete(
  '/cart/:prodId',
  isAuth,
  param('prodId').trim().isNumeric().escape(),
  shopController.deleteCart,
);

router.get('/order', isAuth, shopController.getOrder);

router.post('/order', isAuth, shopController.postOrder);

export default router;
