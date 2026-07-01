import jwt from 'jsonwebtoken';

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'super_secret_access_token_123456789_change_me_in_prod',
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_token_987654321_change_me_in_prod',
    { expiresIn: '7d' }
  );
};

export const sendTokenCookies = async (res, user, statusCode = 200) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Save the refresh token to the database user record
  user.refreshToken = refreshToken;
  await user.save();

  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax', // Lax for dev, can be Strict/Lax in prod. As requested, SameSite=Lax for dev.
  };

  // Set cookies
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Return user info in response (excluding password and refreshToken)
  return res.status(statusCode).json({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
};

export const clearTokenCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};
