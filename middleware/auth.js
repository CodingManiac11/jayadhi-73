const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Verify JWT token and attach user to request
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally, fetch user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    logger.error('JWT verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * Check if user has specific permission
 */
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission denied: ${permission} required`
      });
    }

    next();
  };
};

/**
 * Check if user has specific role
 */
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: `Role required: ${role}`
      });
    }

    next();
  };
};

/**
 * Check if user can access specific feature based on subscription
 */
const requireFeature = (feature) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!req.user.canAccessFeature(feature)) {
      return res.status(403).json({
        success: false,
        message: `Feature not available in your subscription plan. Upgrade to access ${feature}.`
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    // Try Firebase token first
    try {
      const decodedToken = await verifyIdToken(token);
      const user = await User.findOne({ email: decodedToken.email });
      
      if (user && user.isActive) {
        req.user = user;
        req.token = token;
      }
    } catch (firebaseError) {
      // If Firebase token fails, try JWT token
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (user && user.isActive) {
          req.user = user;
          req.token = token;
        }
      } catch (jwtError) {
        // Silently ignore invalid tokens for optional auth
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

/**
 * API key authentication for external integrations
 */
const authenticateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;

    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key required'
      });
    }

    const user = await User.findOne({
      'security.apiKeys.key': apiKey,
      'security.apiKeys.isActive': true
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }

    // Update last used timestamp
    const apiKeyEntry = user.security.apiKeys.find(key => key.key === apiKey);
    if (apiKeyEntry) {
      apiKeyEntry.lastUsed = new Date();
      await user.save();
    }

    req.user = user;
    req.apiKey = apiKey;
    next();
  } catch (error) {
    logger.error('API key authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

/**
 * Organization access control
 */
const requireOrganizationAccess = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const requestedOrgId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
  
  if (requestedOrgId && requestedOrgId !== req.user._id.toString()) {
    // Check if user has admin role to access other organizations
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this organization'
      });
    }
  }

  next();
};

/**
 * Rate limiting for failed login attempts
 */
const checkLoginAttempts = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return next();
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return next();
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    next();
  } catch (error) {
    logger.error('Login attempts check error:', error);
    next();
  }
};

/**
 * Log user activity
 */
const logActivity = (action) => {
  return (req, res, next) => {
    if (req.user) {
      logger.info(`User activity: ${action}`, {
        userId: req.user._id,
        email: req.user.email,
        action,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date()
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireRole,
  requireFeature,
  optionalAuth,
  authenticateApiKey,
  requireOrganizationAccess,
  checkLoginAttempts,
  logActivity
}; 