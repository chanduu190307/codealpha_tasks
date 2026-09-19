'use strict';
const { getDb } = require('../../database/db');
const { verifyWebhook } = require('../services/paymentService');
const ApiError = require('../utils/ApiError');

const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'] || req.headers['x-webhook-signature'];
    if (!signature) {
      throw ApiError.badRequest('Missing webhook signature');
    }

    // Verify signature with raw payload
    let event;
    try {
      event = verifyWebhook(req.body, signature);
    } catch (err) {
      console.warn('[Webhook] Signature verification failed:', err.message);
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const db = await getDb();

    // Idempotency check: prevent duplicate event execution / replay attacks
    const alreadyProcessed = await db.findProcessedWebhook(event.id);
    if (alreadyProcessed) {
      return res.status(200).json({ received: true, status: 'already_processed' });
    }

    const paymentIntent = event.data?.object;

    if (event.type === 'payment_intent.succeeded') {
      if (paymentIntent && paymentIntent.id) {
        // Find order associated with this payment intent
        const allOrders = await db.getAllOrders({ limit: 1000 });
        const order = allOrders.data.find((o) => o.payment_intent === paymentIntent.id);

        if (order) {
          // Amount & currency verification (INR / paise)
          const expectedPaise = Math.round(order.total_amount * 100);

          if (paymentIntent.currency && paymentIntent.currency.toLowerCase() !== 'inr') {
            console.error(
              `[Webhook Security Alert] Currency mismatch for order ${order.id}: expected inr, got ${paymentIntent.currency}`
            );
            await db.recordProcessedWebhook(event.id, 'STRIPE', event.type, 'CURRENCY_MISMATCH');
            return res.status(400).json({ success: false, message: 'Payment currency mismatch: expected INR' });
          }

          if (paymentIntent.amount && paymentIntent.amount !== expectedPaise) {
            console.error(
              `[Webhook Security Alert] Amount mismatch for order ${order.id}: expected ${expectedPaise}, got ${paymentIntent.amount}`
            );
            await db.recordProcessedWebhook(event.id, 'STRIPE', event.type, 'AMOUNT_MISMATCH');
            return res.status(400).json({ success: false, message: 'Payment amount mismatch' });
          }

          await db.updateOrderStatus(order.id, 'CONFIRMED', 'PAID');
        }
      }
    } else if (event.type === 'payment_intent.payment_failed') {
      if (paymentIntent && paymentIntent.id) {
        const allOrders = await db.getAllOrders({ limit: 1000 });
        const order = allOrders.data.find((o) => o.payment_intent === paymentIntent.id);

        if (order) {
          await db.restoreOrderStock(order.id);
          await db.updateOrderStatus(order.id, 'CANCELLED', 'FAILED');
        }
      }
    }

    // Record webhook execution as completed
    await db.recordProcessedWebhook(event.id, 'STRIPE', event.type, 'SUCCESS');

    return res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleWebhook };
