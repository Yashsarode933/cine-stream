import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  refreshAccessToken,
  logoutUser,
} from '../controllers/authController.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply auth rate limiting to registration, login, and Google sign-in
router.post('/register', authRateLimiter, registerUser);
router.post('/login', authRateLimiter, loginUser);
router.post('/google', authRateLimiter, googleAuth);

// Refresh and logout routes
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

export default router;
