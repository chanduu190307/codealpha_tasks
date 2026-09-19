'use strict';
const ApiError = require('../utils/ApiError');
const config = require('../config/env');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle known error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === '23505') {
    // PostgreSQL unique violation
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.code === '23503') {
    // PostgreSQL foreign key violation
    statusCode = 400;
    message = 'Related resource not found';
  }

  // Don't expose stack traces or internal messages in production
  if (config.nodeEnv === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  const response = {
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
    ...(config.isDev && statusCode === 500 && { stack: err.stack }),
  };

  // Log server errors
  if (statusCode >= 500) {
    console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
    if (config.isDev) console.error(err.stack);
  }

  res.status(statusCode).json(response);
};

module.exports = { errorHandler };
