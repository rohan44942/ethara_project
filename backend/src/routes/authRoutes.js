import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { signupSchema, loginSchema, updateProfileSchema } from '../validators/authValidator.js';

const router = express.Router();

// POST /api/auth/signup - Register new user
router.post('/signup', validate(signupSchema), authController.signup);

// POST /api/auth/login - Login user
router.post('/login', validate(loginSchema), authController.login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', authenticate, authController.getCurrentUser);

// PATCH /api/auth/me - Update current user profile (protected)
router.patch('/me', authenticate, validate(updateProfileSchema), authController.updateCurrentUser);

export default router;
