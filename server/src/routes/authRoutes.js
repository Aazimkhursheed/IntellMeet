import express from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
} from '../controllers/authController.js';
import { validateRegister, validateLogin } from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';
import { storage } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage });

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validateRegister, registerUser);
router.post('/login', authLimiter, validateLogin, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);
router.get('/me', protect, getCurrentUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);

export default router;
