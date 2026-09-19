'use strict';
const { getDb } = require('../../database/db');
const ApiError = require('../utils/ApiError');
const { successResponse, paginatedResponse, createdResponse } = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');
const { ORDER_TRANSITIONS } = require('../config/constants');

const getDashboard = async (req, res, next) => {
  try {
    const db = await getDb();
    const metrics = await db.getDashboardMetrics();
    return successResponse(res, metrics);
  } catch (err) { next(err); }
};

const getAllOrders = async (req, res, next) => {
  try {
    const db = await getDb();
    const { page, limit } = getPagination(req.query);
    const { status } = req.query;
    const { data, total } = await db.getAllOrders({ page, limit, status });
    return paginatedResponse(res, data, total, page, limit);
  } catch (err) { next(err); }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const db = await getDb();
    const { status } = req.body;
    const order = await db.getOrderById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    const allowed = ORDER_TRANSITIONS[order.status] || [];
    if (!allowed.includes(status) && status !== order.status) {
      throw ApiError.badRequest(`Cannot transition from ${order.status} to ${status}`);
    }

    const updated = await db.updateOrderStatus(req.params.id, status, null);

    await db.createAuditLog({
      user_id: req.user.id,
      user_email: req.user.email,
      action: 'UPDATE_ORDER_STATUS',
      resource_type: 'ORDER',
      resource_id: req.params.id,
      details: { from: order.status, to: status },
      ip_address: req.ip,
    });

    return successResponse(res, updated, 'Order status updated');
  } catch (err) { next(err); }
};

const refundOrder = async (req, res, next) => {
  try {
    const db = await getDb();
    const { reason = 'Admin initiated refund' } = req.body;
    const order = await db.getOrderById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    if (order.payment_status === 'REFUNDED') {
      throw ApiError.badRequest('Order has already been refunded');
    }
    if (order.payment_status !== 'PAID') {
      throw ApiError.badRequest(`Cannot refund order with payment status "${order.payment_status}". Only PAID orders can be refunded.`);
    }

    const refunded = await db.refundOrder(req.params.id, req.user, reason);
    return successResponse(res, refunded, 'Order refunded successfully and inventory restored');
  } catch (err) { next(err); }
};

const getAllCustomers = async (req, res, next) => {
  try {
    const db = await getDb();
    const { page, limit } = getPagination(req.query);
    const { data, total } = await db.getAllUsers({ page, limit });
    return paginatedResponse(res, data, total, page, limit);
  } catch (err) { next(err); }
};

const updateCustomerStatus = async (req, res, next) => {
  try {
    const db = await getDb();
    const { is_active } = req.body;
    const user = await db.findUserById(req.params.id);
    if (!user) throw ApiError.notFound('Customer not found');

    const updated = await db.setUserActive(req.params.id, is_active);

    await db.createAuditLog({
      user_id: req.user.id,
      user_email: req.user.email,
      action: is_active ? 'ACTIVATE_CUSTOMER' : 'DEACTIVATE_CUSTOMER',
      resource_type: 'USER',
      resource_id: req.params.id,
      details: { is_active },
      ip_address: req.ip,
    });

    return successResponse(res, updated, `Customer ${is_active ? 'activated' : 'deactivated'} successfully`);
  } catch (err) { next(err); }
};

// ── Coupons Management ────────────────────────
const getAllCoupons = async (req, res, next) => {
  try {
    const db = await getDb();
    const { page, limit } = getPagination(req.query);
    const { data, total } = await db.getAllCoupons({ page, limit });
    return paginatedResponse(res, data, total, page, limit);
  } catch (err) { next(err); }
};

const createCoupon = async (req, res, next) => {
  try {
    const db = await getDb();
    let coupon;
    try {
      coupon = await db.createCoupon(req.body);
    } catch (e) {
      throw ApiError.badRequest(e.message);
    }

    await db.createAuditLog({
      user_id: req.user.id,
      user_email: req.user.email,
      action: 'CREATE_COUPON',
      resource_type: 'COUPON',
      resource_id: coupon.id,
      details: { code: coupon.code, discount_type: coupon.discount_type, discount_value: coupon.discount_value },
      ip_address: req.ip,
    });

    return createdResponse(res, coupon, 'Coupon created successfully');
  } catch (err) { next(err); }
};

const updateCoupon = async (req, res, next) => {
  try {
    const db = await getDb();
    let coupon;
    try {
      coupon = await db.updateCoupon(req.params.id, req.body);
    } catch (e) {
      throw ApiError.badRequest(e.message);
    }
    if (!coupon) throw ApiError.notFound('Coupon not found');

    await db.createAuditLog({
      user_id: req.user.id,
      user_email: req.user.email,
      action: 'UPDATE_COUPON',
      resource_type: 'COUPON',
      resource_id: req.params.id,
      details: req.body,
      ip_address: req.ip,
    });

    return successResponse(res, coupon, 'Coupon updated successfully');
  } catch (err) { next(err); }
};

const deleteCoupon = async (req, res, next) => {
  try {
    const db = await getDb();
    const deleted = await db.deleteCoupon(req.params.id);
    if (!deleted) throw ApiError.notFound('Coupon not found');

    await db.createAuditLog({
      user_id: req.user.id,
      user_email: req.user.email,
      action: 'DELETE_COUPON',
      resource_type: 'COUPON',
      resource_id: req.params.id,
      ip_address: req.ip,
    });

    return successResponse(res, null, 'Coupon deleted successfully');
  } catch (err) { next(err); }
};

// ── Audit Logs ────────────────────────────────
const getAuditLogs = async (req, res, next) => {
  try {
    const db = await getDb();
    const { page, limit } = getPagination(req.query);
    const { data, total } = await db.getAuditLogs({ page, limit });
    return paginatedResponse(res, data, total, page, limit);
  } catch (err) { next(err); }
};

module.exports = {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  refundOrder,
  getAllCustomers,
  updateCustomerStatus,
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAuditLogs,
};
