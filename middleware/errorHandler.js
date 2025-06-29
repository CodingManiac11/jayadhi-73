const logger = require('../utils/logger');

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Handle MongoDB validation errors
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB duplicate key errors
 */
const handleDuplicateKeyError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

/**
 * Handle MongoDB cast errors
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

/**
 * Handle JWT expiration errors
 */
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', 401);
};

/**
 * Handle rate limiting errors
 */
const handleRateLimitError = (err) => {
  return new AppError('Too many requests from this IP, please try again later.', 429);
};

/**
 * Handle file upload errors
 */
const handleFileUploadError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large. Maximum size is 10MB.', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files. Maximum is 5 files.', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  return new AppError('File upload failed.', 400);
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, req, res) => {
  // API error response
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  // Rendered error page
  logger.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, req, res) => {
  // API error response
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message
      });
    }
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }

  // Rendered error page
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // Programming or other unknown error: don't leak error details
  logger.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};

/**
 * Main error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the error
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?._id,
    timestamp: new Date()
  });

  // Handle specific error types
  let error = err;
  
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  } else if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  } else if (err.name === 'CastError') {
    error = handleCastError(err);
  } else if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  } else if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  } else if (err.statusCode === 429) {
    error = handleRateLimitError(err);
  } else if (err.code && err.code.startsWith('LIMIT_')) {
    error = handleFileUploadError(err);
  }

  // Send error response based on environment
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
  const error = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

/**
 * Handle async errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Handle unhandled promise rejections
 */
const handleUnhandledRejection = (err) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
};

/**
 * Handle uncaught exceptions
 */
const handleUncaughtException = (err) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(err.name, err.message);
  process.exit(1);
};

module.exports = {
  AppError,
  errorHandler,
  notFound,
  catchAsync,
  handleUnhandledRejection,
  handleUncaughtException
}; 