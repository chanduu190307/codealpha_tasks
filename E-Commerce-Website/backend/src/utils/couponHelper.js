'use strict';
const ApiError = require('./ApiError');

const calculateCouponDiscount = (coupon, subtotal) => {
  if (!coupon) return 0;
  if (!coupon.is_active) {
    throw ApiError.badRequest('This coupon is inactive');
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    throw ApiError.badRequest('This coupon has expired');
  }
  if (coupon.usage_limit && coupon.times_used >= coupon.usage_limit) {
    throw ApiError.badRequest('This coupon usage limit has been reached');
  }
  if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
    throw ApiError.badRequest(`Minimum order amount of ₹${coupon.min_order_amount} required for this coupon`);
  }

  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (subtotal * coupon.discount_value) / 100;
    if (coupon.max_discount && discount > coupon.max_discount) {
      discount = coupon.max_discount;
    }
  } else if (coupon.discount_type === 'fixed') {
    discount = coupon.discount_value;
  } else {
    throw ApiError.badRequest('Invalid coupon discount type');
  }

  // Cap discount to subtotal (never produce negative prices)
  discount = Math.max(0, Math.min(discount, subtotal));
  return parseFloat(discount.toFixed(2));
};

module.exports = { calculateCouponDiscount };
