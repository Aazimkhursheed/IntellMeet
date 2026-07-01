import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  getUserProfile,
} from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getCurrentUser);
router.get('/profile', protect, getUserProfile);

export default router;
