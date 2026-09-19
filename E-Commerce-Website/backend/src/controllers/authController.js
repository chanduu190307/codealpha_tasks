'use strict';
const authService = require('../services/authService');
const { successResponse, createdResponse } = require('../utils/ApiResponse');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return createdResponse(res, result, 'Account created successfully');
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    return successResponse(res, result, 'Login successful');
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return successResponse(res, user);
  } catch (err) { next(err); }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.user.id, req.body);
    return successResponse(res, user, 'Profile updated');
  } catch (err) { next(err); }
};

const forgotPassword = async (req, res, next) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return successResponse(res, null, result.message);
  } catch (err) { next(err); }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const result = await authService.resetPassword(token, password);
    return successResponse(res, null, result.message);
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe, updateProfile, forgotPassword, resetPassword };
