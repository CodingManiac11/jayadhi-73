const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword, comparePassword, generateSecureToken } = require('../utils/encryption');
const { authenticateToken, checkLoginAttempts, logActivity } = require('../middleware/auth');
const { AppError, catchAsync } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('organization.name').trim().isLength({ min: 2, max: 200 }).withMessage('Organization name must be between 2 and 200 characters'),
  body('organization.type').isIn(['startup', 'sme', 'enterprise', 'government']).withMessage('Invalid organization type'),
  body('organization.size').isIn(['1-10', '11-50', '51-200', '201-1000', '1000+']).withMessage('Invalid organization size')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, catchAsync(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    organization
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  try {
    // Only create user in our database (MongoDB)
    const user = new User({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      organization,
      role: 'admin', // First user in organization is admin
      permissions: [
        'manage_users',
        'manage_assets',
        'view_threats',
        'manage_threats',
        'view_compliance',
        'manage_compliance',
        'view_insurance',
        'manage_insurance',
        'view_reports',
        'manage_settings'
      ]
    });
    await user.save();
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
    // Log the registration
    logger.info('User registered successfully', {
      userId: user._id,
      email: user.email,
      organization: user.organization.name
    });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          organization: user.organization,
          role: user.role,
          subscription: user.subscription
        },
        token
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    throw new AppError('Registration failed. Please try again.', 500);
  }
}));

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, checkLoginAttempts, catchAsync(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }

  // Check if account is locked
  if (user.isLocked()) {
    return res.status(423).json({
      success: false,
      message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
    });
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    // Increment failed login attempts
    user.security.failedLoginAttempts += 1;
    
    // Lock account after 5 failed attempts for 30 minutes
    if (user.security.failedLoginAttempts >= 5) {
      user.security.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    }
    
    await user.save();

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Reset failed login attempts on successful login
  user.security.failedLoginAttempts = 0;
  user.security.lockedUntil = null;
  user.lastLogin = new Date();
  user.lastActivity = new Date();
  await user.save();

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );

  // Log the login
  logger.info('User logged in successfully', {
    userId: user._id,
    email: user.email
  });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organization: user.organization,
        role: user.role,
        permissions: user.permissions,
        subscription: user.subscription,
        preferences: user.preferences
      },
      token
    }
  });
}));

/**
 * @route   POST /api/auth/firebase-login
 * @desc    Login with Firebase token
 * @access  Public
 */
router.post('/firebase-login', catchAsync(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      success: false,
      message: 'Firebase ID token is required'
    });
  }

  try {
    // Verify Firebase token
    const decodedToken = await verifyIdToken(idToken);
    
    // Find or create user
    let user = await User.findOne({ email: decodedToken.email });
    
    if (!user) {
      // Create new user from Firebase data
      user = new User({
        email: decodedToken.email,
        firstName: decodedToken.name?.split(' ')[0] || 'User',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || 'Name',
        organization: {
          name: 'New Organization',
          type: 'sme',
          size: '11-50'
        },
        role: 'admin',
        isEmailVerified: decodedToken.email_verified || false,
        password: generateSecureToken(32) // Generate random password for Firebase users
      });

      await user.save();
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    user.lastActivity = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );

    res.json({
      success: true,
      message: 'Firebase login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          organization: user.organization,
          role: user.role,
          permissions: user.permissions,
          subscription: user.subscription,
          preferences: user.preferences
        },
        token
      }
    });
  } catch (error) {
    logger.error('Firebase login error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid Firebase token'
    });
  }
}));

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticateToken, logActivity('profile_view'), catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -security.passwordHistory');
  
  res.json({
    success: true,
    data: { user }
  });
}));

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticateToken, logActivity('profile_update'), catchAsync(async (req, res) => {
  const { firstName, lastName, phone, preferences } = req.body;

  const user = await User.findById(req.user._id);
  
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (phone) user.phone = phone;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  user.updatedBy = req.user._id;
  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        preferences: user.preferences
      }
    }
  });
}));

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authenticateToken, logActivity('password_change'), catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long'
    });
  }

  const user = await User.findById(req.user._id);
  
  // Verify current password
  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Check if new password is same as current
  const isNewPasswordSame = await user.comparePassword(newPassword);
  if (isNewPasswordSame) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password'
    });
  }

  // Update password
  user.password = newPassword;
  user.updatedBy = req.user._id;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticateToken, logActivity('logout'), catchAsync(async (req, res) => {
  // In a more sophisticated implementation, you might want to blacklist the token
  // For now, we'll just return a success response
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}));

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    // Don't reveal if user exists or not
    return res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.'
    });
  }

  // Generate reset token
  const resetToken = generateSecureToken(32);
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  // TODO: Send email with reset link
  // For now, just return the token (in production, send via email)
  res.json({
    success: true,
    message: 'Password reset link sent to your email',
    data: {
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    }
  });
}));

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required'
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters long'
    });
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  // Update password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successfully'
  });
}));

module.exports = router; 