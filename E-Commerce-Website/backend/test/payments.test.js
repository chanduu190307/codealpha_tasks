'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Stripe = require('stripe');
const { setupTestServer, teardownTestServer, apiRequest, loginUser } = require('./testHelper');

test.describe('Payment & Webhook Security Suite', () => {
  let dbInstance;
  let customerToken;
  let testOrder;
  const mockSecret = 'whsec_test_mock_webhook_secret';
  const stripe = new Stripe('sk_test_mock_secret_key', { apiVersion: '2023-10-16' });

  test.before(async () => {
    const { db } = await setupTestServer();
    dbInstance = db;

    const cust = await loginUser('demo@codealpha.store', 'Demo@123456');
    customerToken = cust.token;

    // Create a product for payment testing (₹500.00 retail)
    const prod = await dbInstance.createProduct({
      name: 'Payment Test Product',
      slug: `pay-test-${Date.now()}`,
      price: 500.00,
      stock: 50,
      sku: `SKU-PAY-${Date.now()}`,
    });

    // 1. Add to cart
    await apiRequest('/api/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { product_id: prod.id, quantity: 2 }, // 2 * 500 = ₹1,000 subtotal (free shipping)
    });

    // 2. Checkout
    const orderRes = await apiRequest('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: {
        shipping_address: {
          name: 'Payer Name',
          address: 'Pay Street',
          city: 'Mumbai',
          country: 'IN',
          zip: '400001',
        },
      },
    });

    testOrder = orderRes.body.data;
  });

  test.after(async () => {
    await teardownTestServer();
  });

  test('Webhook Security: Rejects webhook missing signature header', async () => {
    const res = await apiRequest('/api/payments/webhook', {
      method: 'POST',
      body: JSON.stringify({ type: 'payment_intent.succeeded' }),
    });

    assert.equal(res.status, 400);
    assert.match(res.body.message, /missing webhook signature/i);
  });

  test('Webhook Security: Rejects webhook with invalid signature', async () => {
    const rawPayload = JSON.stringify({ id: 'evt_fake', type: 'payment_intent.succeeded' });
    const res = await apiRequest('/api/payments/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': 't=12345,v1=invalidsignaturehere0000000000000000000000000000000000000000',
      },
      body: rawPayload,
    });

    assert.equal(res.status, 400);
    assert.match(res.body.message, /invalid webhook signature/i);
  });

  test('Webhook Processing: Successfully processes verified payment_intent.succeeded event in INR', async () => {
    const paymentIntentId = `pi_test_${Date.now()}`;
    await dbInstance.updateOrderStatus(testOrder.id, 'PENDING', 'UNPAID', paymentIntentId);

    const rawPayload = JSON.stringify({
      id: `evt_success_${Date.now()}`,
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: paymentIntentId,
          amount: Math.round(testOrder.total_amount * 100), // amount in paise
          currency: 'inr',
          status: 'succeeded',
        },
      },
    });

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: mockSecret,
    });

    const res = await apiRequest('/api/payments/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': signature,
      },
      body: rawPayload,
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.received, true);

    // Verify order marked as PAID and CONFIRMED
    const updatedOrder = await dbInstance.getOrderById(testOrder.id);
    assert.equal(updatedOrder.payment_status, 'PAID');
    assert.equal(updatedOrder.status, 'CONFIRMED');
  });

  test('Webhook Idempotency: Replaying duplicate event ID returns already_processed', async () => {
    const eventId = `evt_replay_${Date.now()}`;
    const paymentIntentId = `pi_replay_${Date.now()}`;

    const rawPayload = JSON.stringify({
      id: eventId,
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: paymentIntentId,
          amount: Math.round(testOrder.total_amount * 100),
          currency: 'inr',
        },
      },
    });

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: mockSecret,
    });

    // First delivery
    const res1 = await apiRequest('/api/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
      body: rawPayload,
    });
    assert.equal(res1.status, 200);

    // Second delivery (replay attempt)
    const res2 = await apiRequest('/api/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
      body: rawPayload,
    });
    assert.equal(res2.status, 200);
    assert.equal(res2.body.status, 'already_processed');
  });

  test('Webhook Security: Rejects payment when currency does not match INR (e.g. USD)', async () => {
    const currencyMismatchPi = `pi_curr_mismatch_${Date.now()}`;
    await dbInstance.updateOrderStatus(testOrder.id, 'PENDING', 'UNPAID', currencyMismatchPi);

    const rawPayload = JSON.stringify({
      id: `evt_curr_mismatch_${Date.now()}`,
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: currencyMismatchPi,
          amount: Math.round(testOrder.total_amount * 100),
          currency: 'usd', // Attacker sends USD instead of INR
        },
      },
    });

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: mockSecret,
    });

    const res = await apiRequest('/api/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
      body: rawPayload,
    });

    assert.equal(res.status, 400);
    assert.match(res.body.message, /currency mismatch/i);
  });

  test('Webhook Security: Rejects payment when amount in paise does not match expected order total', async () => {
    const mismatchPi = `pi_mismatch_${Date.now()}`;
    await dbInstance.updateOrderStatus(testOrder.id, 'PENDING', 'UNPAID', mismatchPi);

    const rawPayload = JSON.stringify({
      id: `evt_mismatch_${Date.now()}`,
      object: 'event',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: mismatchPi,
          amount: 100, // 100 paise (₹1.00) instead of expected order total
          currency: 'inr',
        },
      },
    });

    const signature = stripe.webhooks.generateTestHeaderString({
      payload: rawPayload,
      secret: mockSecret,
    });

    const res = await apiRequest('/api/payments/webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'stripe-signature': signature },
      body: rawPayload,
    });

    assert.equal(res.status, 400);
    assert.match(res.body.message, /amount mismatch/i);
  });
});
