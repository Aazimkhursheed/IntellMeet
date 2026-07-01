import User from '../models/User.js';
import { sendTokenCookies, clearTokenCookies } from '../utils/token.js';
import jwt from 'jsonwebtoken';
import { cloudinary } from '../config/cloudinary.js';

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
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
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
  const user = await User.findById(req.user.id);
  res.status(200).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    company: user.company,
    designation: user.designation,
    createdAt: user.createdAt,
  });
};

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const { fullName, bio, company, designation } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (bio !== undefined) updateFields.bio = bio;
    if (company !== undefined) updateFields.company = company;
    if (designation !== undefined) updateFields.designation = designation;

    // Update user
    const user = await User.findByIdAndUpdate(req.user.id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      company: user.company,
      designation: user.designation,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload user avatar
// @route   POST /api/v1/auth/avatar
// @access  Private
export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get the user
    const user = await User.findById(req.user.id);

    // Delete old avatar if exists
    if (user.avatar) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`intellmeet/avatars/${publicId}`);
    }

    // Update user with new avatar URL
    user.avatar = req.file.path;
    await user.save();

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      company: user.company,
      designation: user.designation,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
};
