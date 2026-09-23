const env = require('../config/env');
const { errorResponse } = require('../utils/response');

/**
 * 404 Handler for missing routes
 */
const notFound = (req, res, next) => {
  return errorResponse(res, 404, `Route not found - ${req.originalUrl}`);
};

/**
 * Centralized Error Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found with the specified ID';
  }

  // Mongoose Duplicate Key Error (11000)
  if (err.code === 11000) {
    statusCode = 409;
    const rawKeys = Object.keys(err.keyValue || {});
    const filteredKeys = rawKeys.filter((k) => k !== 'createdBy');
    const field = filteredKeys[0] || rawKeys[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    if (field === 'reference') {
      message = `Product reference '${value}' already exists`;
    } else if (field === 'barcode') {
      message = `Product barcode '${value}' already exists`;
    } else {
      message = `A record with ${field} '${value}' already exists`;
    }
    errors = [{ field, message: `${field} must be unique` }];
  }

  // Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  if (env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('Unhandled Error:', err);
  }

  return errorResponse(res, statusCode, message, errors);
};

module.exports = {
  notFound,
  errorHandler,
};
