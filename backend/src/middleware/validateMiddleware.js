const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

/**
 * Validates request payload based on express-validator rules
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return errorResponse(res, 400, 'Validation failed', formattedErrors);
  }
  next();
};

module.exports = validate;
