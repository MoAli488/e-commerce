import { Router } from 'express';
import upload from '../util/multerUpload.js';
import * as shopController from '../controller/shop.js';

const router = Router();

// GET Home Page shop
router.get('/', shopController.getHome);

// GET All Products
router.get('/products', shopController.getProducts);

// GET Product
router.get('/product/:prodId', shopController.getProduct);

// POST Product
router.post('/product/', upload.single('image'), shopController.postProduct);

// PUT Product
router.put(
  '/product/:prodId',
  upload.single('image'),
  shopController.putProduct,
);

// DELETE Product
router.delete('/product/:prodId', shopController.deleteProduct);

export default router;
