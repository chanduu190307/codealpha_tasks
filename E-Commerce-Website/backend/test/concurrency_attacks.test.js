'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest, loginUser } = require('./testHelper');

test.describe('Concurrency & Adversarial Attack Suite', () => {
  let dbInstance;
  let adminToken;
  let customerTokens = [];

  test.before(async () => {
    const { db } = await setupTestServer();
    dbInstance = db;

    const adm = await loginUser('admin@codealpha.store', 'Admin@123456');
    adminToken = adm.token;

    // Create 5 distinct customer accounts for concurrency tests
    for (let i = 0; i < 5; i++) {
      const email = `concurrent_user_${i}_${Date.now()}@test.com`;
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: { name: `Concurrent User ${i}`, email, password: 'Password@12345!' },
      });
      const user = await loginUser(email, 'Password@12345!');
      customerTokens.push(user.token);
    }
  });

  test.after(async () => {
    await teardownTestServer();
  });

  test('Concurrency Attack: Simultaneous orders competing for final 1 unit of stock', async () => {
    // 1. Create a product with exactly 1 unit of stock (₹1,500 retail)
    const hotProduct = await dbInstance.createProduct({
      name: 'Ultra Rare Item',
      slug: `rare-${Date.now()}`,
      price: 1500.00,
      stock: 1,
      sku: `SKU-RARE-${Date.now()}`,
    });

    // 2. All 5 users add 1 unit to cart
    for (const token of customerTokens) {
      await apiRequest('/api/cart', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      await apiRequest('/api/cart/items', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { product_id: hotProduct.id, quantity: 1 },
      });
    }

    // 3. Fire all 5 checkouts concurrently
    const orderPromises = customerTokens.map((token, idx) =>
      apiRequest('/api/orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          shipping_address: {
            name: `User ${idx}`,
            address: 'Rush St',
            city: 'Metro',
            country: 'IN',
            zip: '110001',
          },
        },
      })
    );

    const results = await Promise.all(orderPromises);
    const successes = results.filter((r) => r.status === 201);
    const failures = results.filter((r) => r.status === 400);

    // Exactly 1 order must succeed
    assert.equal(successes.length, 1, 'Exactly one concurrent order must win the last unit of stock');
    assert.equal(failures.length, 4, 'Remaining concurrent orders must fail due to zero stock');

    // Final stock must be exactly 0 (never negative)
    const productAfter = await dbInstance.findProductById(hotProduct.id);
    assert.equal(productAfter.stock, 0, 'Final stock must never drop below 0');
  });

  test('Concurrency Attack: Concurrent coupon redemptions cannot exceed usage limit', async () => {
    // 1. Create a coupon with usage_limit = 2 (₹100 fixed discount in INR)
    const couponCode = `LIMITED_${Date.now()}`;
    await dbInstance.createCoupon({
      code: couponCode,
      discount_type: 'fixed',
      discount_value: 100,
      min_order_amount: 500,
      usage_limit: 2,
      is_active: true,
    });

    const item = await dbInstance.createProduct({
      name: 'Coupon Test Item',
      slug: `coup-item-${Date.now()}`,
      price: 1000.00,
      stock: 100,
      sku: `SKU-COUP-${Date.now()}`,
    });

    // 2. Prepare carts for 4 users
    const activeUsers = customerTokens.slice(0, 4);
    for (const token of activeUsers) {
      await apiRequest('/api/cart', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      await apiRequest('/api/cart/items', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: { product_id: item.id, quantity: 1 },
      });
    }

    // 3. Fire all 4 checkouts with the limited coupon concurrently
    const promises = activeUsers.map((token, idx) =>
      apiRequest('/api/orders', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: {
          coupon_code: couponCode,
          shipping_address: {
            name: `Coupon User ${idx}`,
            address: 'Deal St',
            city: 'Savings City',
            country: 'US',
            zip: '20002',
          },
        },
      })
    );

    const results = await Promise.all(promises);
    const successfulWithCoupon = results.filter((r) => r.status === 201 && r.body.data.discount_amount > 0);

    assert.ok(successfulWithCoupon.length <= 2, 'No more than 2 orders may claim a coupon with limit=2');

    const couponRecord = await dbInstance.getCouponByCode(couponCode);
    assert.ok(couponRecord.times_used <= 2, 'times_used must never exceed usage_limit');
  });

  test('Concurrency Attack: Concurrent duplicate refund attempts restore stock exactly once', async () => {
    // 1. Create product and order
    const prod = await dbInstance.createProduct({
      name: 'Refund Attack Item',
      slug: `ref-att-${Date.now()}`,
      price: 60.00,
      stock: 10,
      sku: `SKU-REF-${Date.now()}`,
    });

    const token = customerTokens[0];
    await apiRequest('/api/cart', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    await apiRequest('/api/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { product_id: prod.id, quantity: 2 },
    });
    const orderRes = await apiRequest('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        shipping_address: {
          name: 'Refund Target',
          address: 'Refund Blvd',
          city: 'Finance',
          country: 'US',
          zip: '30003',
        },
      },
    });

    const orderId = orderRes.body.data.id;
    // Mark as PAID
    await dbInstance.updateOrderStatus(orderId, 'CONFIRMED', 'PAID');

    const stockBeforeRefund = (await dbInstance.findProductById(prod.id)).stock; // 8

    // 2. Fire 5 simultaneous refund requests for the same order
    const refundPromises = Array(5).fill(0).map((_, i) =>
      apiRequest(`/api/admin/orders/${orderId}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: { reason: `Concurrent refund attempt ${i}` },
      })
    );

    const results = await Promise.all(refundPromises);
    const successRefunds = results.filter((r) => r.status === 200);
    const rejectedRefunds = results.filter((r) => r.status === 400);

    assert.equal(successRefunds.length, 1, 'Only one refund request must succeed');
    assert.equal(rejectedRefunds.length, 4, 'Duplicate concurrent refund requests must be rejected');

    // Stock must have been restored by exactly 2 (from 8 to 10), never 18
    const stockAfterRefund = (await dbInstance.findProductById(prod.id)).stock;
    assert.equal(stockAfterRefund, stockBeforeRefund + 2, 'Stock must be restored exactly once');
  });

  test('Authorization & Review Attacks: Non-author cannot edit or delete review; admin can moderate', async () => {
    const revProduct = await dbInstance.createProduct({
      name: 'Moderation Item',
      slug: `mod-item-${Date.now()}`,
      price: 20.00,
      stock: 5,
      sku: `SKU-MOD-${Date.now()}`,
    });

    const userA = customerTokens[0];
    const userB = customerTokens[1];

    // User A reviews
    const createRev = await apiRequest(`/api/products/${revProduct.id}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userA}` },
      body: { rating: 5, comment: 'User A authentic review' },
    });
    assert.equal(createRev.status, 201);
    const reviewId = createRev.body.data.id;

    // User B attempts to edit User A's review -> 403
    const editAttempt = await apiRequest(`/api/products/${revProduct.id}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userB}` },
      body: { rating: 1, comment: 'Hacked by User B' },
    });
    assert.equal(editAttempt.status, 403);

    // User B attempts to delete User A's review -> 403
    const deleteAttempt = await apiRequest(`/api/products/${revProduct.id}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userB}` },
    });
    assert.equal(deleteAttempt.status, 403);

    // Admin CAN delete review -> 200
    const adminDelete = await apiRequest(`/api/products/${revProduct.id}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(adminDelete.status, 200);

    // Review no longer exists
    const reviewAfter = await dbInstance.findReviewById(reviewId);
    assert.equal(reviewAfter, null);
  });

  test('Order State Machine: Illegal direct transition from PENDING to DELIVERED is rejected', async () => {
    const item = await dbInstance.createProduct({
      name: 'State Test Item',
      slug: `state-item-${Date.now()}`,
      price: 30.00,
      stock: 5,
      sku: `SKU-STATE-${Date.now()}`,
    });

    const token = customerTokens[0];
    await apiRequest('/api/cart', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    await apiRequest('/api/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { product_id: item.id, quantity: 1 },
    });
    const orderRes = await apiRequest('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        shipping_address: { name: 'State User', address: '123 Test St', city: 'City', country: 'US', zip: '12345' },
      },
    });

    const orderId = orderRes.body.data.id;
    // Set to PENDING
    await dbInstance.updateOrderStatus(orderId, 'PENDING', 'UNPAID');

    // Attempt illegal transition: PENDING directly to DELIVERED
    const illegalTransition = await apiRequest(`/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { status: 'DELIVERED' },
    });
    assert.equal(illegalTransition.status, 400);
    assert.match(illegalTransition.body.message, /cannot transition/i);
  });
});
