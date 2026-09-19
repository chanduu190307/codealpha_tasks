'use strict';
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { getDb } = require('../../database/db');
const { signToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const { sendPasswordResetEmail } = require('./emailService');

const SALT_ROUNDS = 12;

const validatePasswordPolicy = (password) => {
  if (!password || password.length < 8) {
    throw ApiError.badRequest('Password must be at least 8 characters long');
  }
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    throw ApiError.badRequest(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  }
};

const register = async ({ name, email, password }) => {
  validatePasswordPolicy(password);

  const db = await getDb();
  const existing = await db.findUserByEmail(email);
  if (existing) throw ApiError.conflict('Email already registered');

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await db.createUser({ name, email, password_hash, role: 'CUSTOMER' });

  const { password_hash: _, ...safeUser } = user;
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user: safeUser, token };
};

const login = async ({ email, password }) => {
  const db = await getDb();
  const user = await db.findUserByEmail(email);
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw ApiError.unauthorized('Invalid email or password');

  if (user.is_active === false) {
    throw ApiError.forbidden('Your account has been deactivated. Please contact support.');
  }

  const { password_hash: _, ...safeUser } = user;
  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { user: safeUser, token };
};

const getProfile = async (userId) => {
  const db = await getDb();
  const user = await db.findUserById(userId);
  if (!user) throw ApiError.notFound('User not found');
  const { password_hash: _, ...safeUser } = user;
  return safeUser;
};

const updateProfile = async (userId, updates) => {
  const db = await getDb();
  const allowed = {};
  if (updates.name) allowed.name = updates.name.trim();
  if (updates.avatar !== undefined) allowed.avatar = updates.avatar;

  if (updates.newPassword) {
    if (!updates.currentPassword) {
      throw ApiError.badRequest('Current password is required to set a new password');
    }
    validatePasswordPolicy(updates.newPassword);

    const user = await db.findUserById(userId);
    const valid = await bcrypt.compare(updates.currentPassword, user.password_hash);
    if (!valid) throw ApiError.badRequest('Current password is incorrect');

    allowed.password_hash = await bcrypt.hash(updates.newPassword, SALT_ROUNDS);
  }

  const updated = await db.updateUser(userId, allowed);
  const { password_hash: _, ...safeUser } = updated;
  return safeUser;
};

const forgotPassword = async (email) => {
  const db = await getDb();
  const user = await db.findUserByEmail(email);

  // Always return consistent message to prevent email enumeration
  if (!user) {
    return { message: 'If that email address is in our database, we will send you a password reset link.' };
  }

  // Generate cryptographically secure random token
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  await db.createPasswordReset(user.id, tokenHash, expiresAt);

  // Send email (non-blocking)
  sendPasswordResetEmail(user, rawToken).catch((err) =>
    console.warn('[Email] Forgot password email error:', err.message)
  );

  return { message: 'If that email address is in our database, we will send you a password reset link.' };
};

const resetPassword = async (token, newPassword) => {
  if (!token) throw ApiError.badRequest('Reset token is required');
  validatePasswordPolicy(newPassword);

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const db = await getDb();

  const resetRecord = await db.findPasswordReset(tokenHash);
  if (!resetRecord) {
    throw ApiError.badRequest('Invalid or expired reset token');
  }

  if (new Date(resetRecord.expires_at) < new Date()) {
    throw ApiError.badRequest('Reset token has expired');
  }

  const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await db.updateUser(resetRecord.user_id, { password_hash });
  await db.markPasswordResetUsed(resetRecord.id);

  return { message: 'Password has been reset successfully. You can now log in.' };
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  validatePasswordPolicy,
};
