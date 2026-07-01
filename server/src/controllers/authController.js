import User from '../models/User.js';
import { sendTokenCookies, clearTokenCookies } from '../utils/token.js';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create new user (password is hashed in pre-save hook)
    const user = new User({
      fullName,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'member', // Default to member
    });

    // Save and send response with cookies
    await sendTokenCookies(res, user, 201);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get tokens
// @route   POST /api/v1/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for user and explicitly select password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Send response with cookies
    await sendTokenCookies(res, user, 200);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookies
// @route   POST /api/v1/auth/logout
// @access  Public
export const logoutUser = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      // Find user and remove refresh token from DB
      const user = await User.findOne({ refreshToken }).select('+refreshToken');
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    // Clear cookies
    clearTokenCookies(res);

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    let decoded;
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_token_987654321_change_me_in_prod'
      );
    } catch {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    // Find user by ID and ensure their stored refresh token matches the cookie
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token session' });
    }

    // Rotate tokens: generate new tokens and set cookies
    await sendTokenCookies(res, user, 200);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user details
// @route   GET /api/v1/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Get user profile (mapped to me for now)
// @route   GET /api/v1/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  res.status(200).json(req.user);
};
