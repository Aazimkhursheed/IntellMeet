export const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = [];

  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  if (!password || typeof password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
    }
    if (!/[a-z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
    }
    if (!/[0-9]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' });
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, message: errors[0].message });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }
  }

  if (!password || typeof password !== 'string' || password.trim() === '') {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors, message: errors[0].message });
  }

  next();
};
