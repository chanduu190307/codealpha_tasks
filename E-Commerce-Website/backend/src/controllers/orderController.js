'use strict';
const { getDb } = require('../../database/db');
const { processPayment } = require('../services/paymentService');
const { sendOrderConfirmation } = require('../services/emailService');
const ApiError = require('../utils/ApiError');
const { successResponse, paginatedResponse, createdResponse } = require('../utils/ApiResponse');
const { getPagination } = require('../utils/helpers');
const { calculateCouponDiscount } = require('../utils/couponHelper');

const createOrder = async (req, res, next) => {
  try {
    const db = await getDb();
    const { shipping_address, payment_method = 'MOCK', notes, coupon_code } = req.body;

    // 1. Fetch user's cart
    const cart = await db.getCartWithItems(req.user.id);
    if (!cart.items || cart.items.length === 0) {
      throw ApiError.badRequest('Cart is empty');
    }

    // 2. Validate items & calculate subtotal strictly from DB prices (never trust frontend)
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      if (!item.product) {
        throw ApiError.badRequest(`Product ${item.product_id} is no longer available`);
      }
      if (item.product.stock < item.quantity) {
        throw ApiError.badRequest(`Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`);
      }

      // Always use current database price/discount_price
      const currentPrice = item.product.discount_price !== null && item.product.discount_price !== undefined
        ? parseFloat(item.product.discount_price)
        : parseFloat(item.product.price);

      subtotal += currentPrice * item.quantity;

      orderItems.push({
        product_id: item.product.id,
        name: item.product.name,
        price: currentPrice,
        quantity: item.quantity,
        image: item.product.images?.[0] || null,
      });
    }

    subtotal = parseFloat(subtotal.toFixed(2));

    // 3. Server-side coupon discount calculation
    let discount = 0;
    let validatedCoupon = null;

    if (coupon_code) {
      validatedCoupon = await db.getCouponByCode(coupon_code);
      if (!validatedCoupon) {
        throw ApiError.badRequest(`Invalid coupon code: "${coupon_code}"`);
      }
      discount = calculateCouponDiscount(validatedCoupon, subtotal);
    }

    // 4. Server-side shipping fee (Free if subtotal >= 1000, else ₹99)
    const shipping = subtotal >= 1000 ? 0 : 99;

    // 5. Server-side tax calculation (8% on subtotal in INR)
    const tax = parseFloat((subtotal * 0.08).toFixed(2));

    // 6. Final total in INR: subtotal - discount + shipping + tax
    const total = parseFloat(Math.max(0, subtotal - discount + shipping + tax).toFixed(2));

    // 7. Atomic order creation + stock deduction
    let order;
    try {
      order = await db.createOrder({
        user_id: req.user.id,
        subtotal,
        shipping_amount: shipping,
        tax_amount: tax,
        discount_amount: discount,
        coupon_code: validatedCoupon ? validatedCoupon.code : null,
        total_amount: total,
        currency: 'INR',
        shipping_address,
        payment_method,
        notes,
        items: orderItems,
      });
    } catch (err) {
      throw ApiError.badRequest(err.message);
    }

    // 8. Increment coupon usage
    if (validatedCoupon) {
      await db.incrementCouponUsage(validatedCoupon.code);
    }

    // 9. Payment processing in INR
    let paymentResult;
    try {
      paymentResult = await processPayment(total, 'inr');
    } catch (paymentErr) {
      // Payment failed: rollback stock and mark order as FAILED
      await db.restoreOrderStock(order.id);
      await db.updateOrderStatus(order.id, 'CANCELLED', 'FAILED');
      throw ApiError.badRequest(`Payment failed: ${paymentErr.message}`);
    }

    // 10. Update order with payment details
    if (paymentResult.status === 'succeeded') {
      await db.updateOrderStatus(order.id, 'CONFIRMED', 'PAID', paymentResult.id);
    } else {
      await db.updateOrderStatus(order.id, 'PENDING', paymentResult.status.toUpperCase(), paymentResult.id);
    }

    // 11. Clear cart
    await db.clearCart(req.user.id);

    // 12. Send order confirmation email asynchronously
    sendOrderConfirmation(req.user, order).catch((e) =>
      console.warn('[Email] Failed to send order confirmation:', e.message)
    );

    const finalOrder = await db.getOrderById(order.id, req.user.id);
    return createdResponse(res, finalOrder, 'Order placed successfully');
  } catch (err) {
    next(err);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const db = await getDb();
    const { page, limit } = getPagination(req.query);
    const { data, total } = await db.getOrdersByUser(req.user.id, { page, limit });
    return paginatedResponse(res, data, total, page, limit);
  } catch (err) {
    next(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const db = await getDb();
    const isAdmin = req.user.role === 'ADMIN';
    // IDOR protection: non-admins can strictly access only their own order
    const order = await db.getOrderById(req.params.id, isAdmin ? null : req.user.id);
    if (!order) {
      throw ApiError.notFound('Order not found');
    }
    return successResponse(res, order);
  } catch (err) {
    next(err);
  }
};

const cancelOrder = async (req, res, next) => {
  try {
    const db = await getDb();
    const isAdmin = req.user.role === 'ADMIN';
    // IDOR protection: non-admins can only cancel their own order
    const updated = await db.cancelOrder(req.params.id, isAdmin ? null : req.user.id);
    if (!updated) {
      throw ApiError.notFound('Order not found');
    }
    return successResponse(res, updated, 'Order cancelled and stock restored');
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, getMyOrders, getOrder, cancelOrder };
