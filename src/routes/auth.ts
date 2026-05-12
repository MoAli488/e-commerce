import { Router } from 'express';
import * as authController from '../controller/auth.js';

const router = Router();

// PUT signup
router.put('/signup', authController.signup);

// POST login
router.post('/login', authController.login);

// DELETE user
router.delete('/delete/:userId', authController.deleteUser);

export default router;
