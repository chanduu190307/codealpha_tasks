'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest, loginUser } = require('./testHelper');

test.describe('Application Security & IDOR Suite', () => {
  let dbInstance;
  let customerAToken;
  let customerBToken;
  let adminToken;
  let testProduct;

  async function createOrderHelper(token, productId, quantity) {
    await apiRequest('/api/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await apiRequest('/api/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { product_id: productId, quantity },
    });
    return apiRequest('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        shipping_address: {
          name: 'Secure Recipient',
          address: '100 Security Blvd',
          city: 'Fortress',
          country: 'US',
          zip: '10101',
        },
      },
    });
  }

  test.before(async () => {
    const { db } = await setupTestServer();
    dbInstance = db;

    // Customer A (demo user)
    const custA = await loginUser('demo@codealpha.store', 'Demo@123456');
    customerAToken = custA.token;

    // Customer B
    const emailB = `cust_b_${Date.now()}@test.com`;
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Customer B', email: emailB, password: 'Password@12345!' },
    });
    const custB = await loginUser(emailB, 'Password@12345!');
    customerBToken = custB.token;

    // Admin
    const adm = await loginUser('admin@codealpha.store', 'Admin@123456');
    adminToken = adm.token;

    // Product
    testProduct = await dbInstance.createProduct({
      name: 'Security Test Product',
      slug: `sec-prod-${Date.now()}`,
      price: 50.00,
      stock: 20,
      sku: `SKU-SEC-${Date.now()}`,
    });
  });

  test.after(async () => {
    await teardownTestServer();
  });

  test('Security Headers: Helmet active and sending nosniff, frameguard, etc.', async () => {
    const res = await apiRequest('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  });

  test('IDOR Protection: Customer B cannot view Customer A order details', async () => {
    // Customer A creates an order
    const orderRes = await createOrderHelper(customerAToken, testProduct.id, 1);
    assert.equal(orderRes.status, 201);
    const orderId = orderRes.body.data.id;

    // Customer B attempts to fetch Customer A's order
    const bFetchRes = await apiRequest(`/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${customerBToken}` },
    });
    // Must return 404 (resource not found for this user), never Customer A's order data
    assert.equal(bFetchRes.status, 404);
    assert.equal(bFetchRes.body.success, false);
  });

  test('IDOR Protection: Customer B cannot cancel Customer A order', async () => {
    // Customer A creates an order
    const orderRes = await createOrderHelper(customerAToken, testProduct.id, 1);
    assert.equal(orderRes.status, 201);
    const orderId = orderRes.body.data.id;

    // Customer B attempts to cancel Customer A's order
    const bCancelRes = await apiRequest(`/api/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerBToken}` },
    });
    assert.equal(bCancelRes.status, 404);
    assert.equal(bCancelRes.body.success, false);

    // Verify order is still CONFIRMED (or PENDING)
    const adminFetch = await apiRequest(`/api/admin/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.notEqual(adminFetch.body.data.status, 'CANCELLED');
  });

  test('Review Security: Unverified reviewer is flagged is_verified_buyer=false', async () => {
    // Customer A creates a new isolated product that nobody has bought
    const unboughtProduct = await dbInstance.createProduct({
      name: 'Unbought Product',
      slug: `unbought-${Date.now()}`,
      price: 25.00,
      stock: 10,
      sku: `SKU-UNBOUGHT-${Date.now()}`,
    });

    // Customer A reviews without purchasing
    const res = await apiRequest(`/api/products/${unboughtProduct.id}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerAToken}` },
      body: { rating: 4, comment: 'Nice product preview!' },
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.data.is_verified_buyer, false, 'Unpurchased product review must have is_verified_buyer=false');
  });

  test('Review Security: Verified purchaser has is_verified_buyer=true and XSS is sanitized', async () => {
    const verifiedProduct = await dbInstance.createProduct({
      name: 'Verified Review Product',
      slug: `ver-rev-${Date.now()}`,
      price: 40.00,
      stock: 10,
      sku: `SKU-VER-${Date.now()}`,
    });

    // Customer B buys product
    const orderRes = await createOrderHelper(customerBToken, verifiedProduct.id, 1);
    assert.equal(orderRes.status, 201);
    const orderId = orderRes.body.data.id;

    // Mark order as DELIVERED directly
    await dbInstance.updateOrderStatus(orderId, 'DELIVERED', 'PAID');

    // Customer B submits review with potential XSS payloads
    const xssPayload = "<script>alert('pwned')</script>Great product! <img src=x onerror=alert(1)>";
    const revRes = await apiRequest(`/api/products/${verifiedProduct.id}/reviews`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerBToken}` },
      body: { rating: 5, comment: xssPayload },
    });

    assert.equal(revRes.status, 201);
    const comment = revRes.body.data.comment;
    assert.ok(!comment.includes('<script>'), 'Script tags must be stripped');
    assert.ok(!comment.includes('onerror='), 'Event handlers must be stripped');
    assert.equal(revRes.body.data.is_verified_buyer, true, 'Delivered purchaser must be marked as verified buyer');
  });

  test('Account Status: Admin can deactivate user and deactivated user cannot login', async () => {
    const tempEmail = `temp_user_${Date.now()}@test.com`;
    const regRes = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Deactivate Target', email: tempEmail, password: 'Password@12345!' },
    });
    const userId = regRes.body.data.user.id;

    // Deactivate user via Admin API (PATCH /api/admin/customers/:id/status)
    const deactRes = await apiRequest(`/api/admin/customers/${userId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { is_active: false },
    });
    assert.equal(deactRes.status, 200);
    assert.equal(deactRes.body.data.is_active, false);

    // Attempt login as deactivated user
    const loginRes = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: tempEmail, password: 'Password@12345!' },
    });
    assert.equal(loginRes.status, 403);
    assert.match(loginRes.body.message, /deactivated/i);

    // Re-activate user
    await apiRequest(`/api/admin/customers/${userId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { is_active: true },
    });
    const loginAfter = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: tempEmail, password: 'Password@12345!' },
    });
    assert.equal(loginAfter.status, 200);
  });
});
