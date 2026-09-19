'use strict';
const { verifyToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const { getDb } = require('../../database/db');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('No token provided');
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    const db = await getDb();
    const user = await db.findUserById(decoded.id);
    if (!user || !user.is_active) {
      throw ApiError.unauthorized('User not found or inactive');
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Invalid or expired token'));
    }
    next(err);
  }
};

module.exports = { authenticate };
