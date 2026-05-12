import { Router } from 'express';
import * as shopController from '../controller/shop.js';

const router = Router();

// GET Home Page shop
router.get('/', shopController.getHome);

// GET All Products
router.get('/products', shopController.getProducts);

// GET Product
router.get('/product/:prodId', shopController.getProduct);

// POST Product
router.post('/product/', shopController.postProduct);

// PUT Product
router.put('/product/:prodId', shopController.putProduct);

// DELETE Product
router.delete('/product/:prodId', shopController.deleteProduct);

export default router;
