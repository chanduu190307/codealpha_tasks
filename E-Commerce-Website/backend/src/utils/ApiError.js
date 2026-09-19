'use strict';

class ApiError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg, errors = null) { return new ApiError(msg, 400, errors); }
  static unauthorized(msg = 'Unauthorized') { return new ApiError(msg, 401); }
  static forbidden(msg = 'Forbidden') { return new ApiError(msg, 403); }
  static notFound(msg = 'Not found') { return new ApiError(msg, 404); }
  static conflict(msg) { return new ApiError(msg, 409); }
  static internal(msg = 'Internal server error') { return new ApiError(msg, 500); }
}

module.exports = ApiError;
