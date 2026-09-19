'use strict';
const ApiError = require('../utils/ApiError');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(ApiError.forbidden('Admin access required'));
  }
  next();
};

module.exports = { requireAdmin };
