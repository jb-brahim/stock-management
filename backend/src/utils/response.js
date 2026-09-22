/**
 * Success response builder
 */
const successResponse = (res, statusCode = 200, message = 'Success', data = null, meta = {}) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta && Object.keys(meta).length > 0) {
    Object.assign(response, meta);
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response builder
 */
const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: Array.isArray(errors) ? errors : [errors],
  });
};

module.exports = {
  successResponse,
  errorResponse,
};
