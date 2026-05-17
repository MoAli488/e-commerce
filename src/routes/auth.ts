import { Router } from 'express';
import * as authController from '../controller/auth.js';
import { body, param } from 'express-validator';
import User from '../models/user.js';

const router = Router();

// PUT signup
router.put(
  '/signup',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2 })
      .escape(),
    body('email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .custom(async (val) => {
        const user: User | null = await User.findOne({
          where: { email: val },
        });
        if (user) {
          return Promise.reject('User already exist.');
        }
      }),
    body('password')
      .isLength({ min: 6 })
      .withMessage('short password.')
      .escape(),
    body('confirmPassword')
      .escape()
      .custom((val, { req }) => {
        return val === req.body.password;
      })
      .withMessage('Passwords not the same.'),
    body('phone')
      .optional()
      .trim()
      .isNumeric()
      .isLength({ min: 11 })
      .withMessage('Invalid phone number.')
      .escape(),
    body('address').optional().trim().escape(),
    body('city').optional().trim().escape(),
  ],
  authController.signup,
);

// POST login
router.post(
  '/login',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').trim().escape(),
  ],
  authController.login,
);

// DELETE user
router.delete(
  '/delete/:userId',
  param('userId').trim().isNumeric().escape(),
  authController.deleteUser,
);

export default router;
