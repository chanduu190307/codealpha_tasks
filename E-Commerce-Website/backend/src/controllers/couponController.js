'use strict';
const { getDb } = require('../../database/db');
const ApiError = require('../utils/ApiError');
const { successResponse } = require('../utils/ApiResponse');
const { calculateCouponDiscount } = require('../utils/couponHelper');

const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) throw ApiError.badRequest('Coupon code is required');

    const db = await getDb();
    const coupon = await db.getCouponByCode(code);
    if (!coupon) throw ApiError.notFound('Invalid coupon code');

    const parsedSubtotal = parseFloat(subtotal) || 0;
    const discount = calculateCouponDiscount(coupon, parsedSubtotal);

    return successResponse(res, {
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: discount,
      min_order_amount: coupon.min_order_amount,
    }, 'Coupon applied successfully');
  } catch (err) { next(err); }
};

module.exports = { validateCoupon };
