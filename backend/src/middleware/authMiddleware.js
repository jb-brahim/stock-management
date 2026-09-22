const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const { errorResponse } = require('../utils/response');

/**
 * Protect routes: verify JWT bearer token
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 401, 'Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return errorResponse(res, 401, 'User associated with token no longer exists');
    }

    if (!user.isActive) {
      return errorResponse(res, 403, 'Account is deactivated');
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized, token invalid or expired');
  }
};

/**
 * Authorize roles: restrict route access by role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this route`
      );
    }
    next();
  };
};

module.exports = {
  protect,
  authorize,
};
