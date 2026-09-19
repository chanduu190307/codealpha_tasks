'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest, loginUser } = require('./testHelper');

test.describe('Inventory, Orders, & Coupons Suite', () => {
  let dbInstance;
  let customerToken;
  let adminToken;
  let testProduct;

  async function createOrderHelper(token, productId, quantity, couponCode = null, bodyOverrides = {}) {
    // 1. Clear existing cart
    await apiRequest('/api/cart', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    // 2. Add item to cart
    const cartRes = await apiRequest('/api/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { product_id: productId, quantity },
    });
    if (cartRes.status !== 200) {
      return cartRes;
    }

    // 3. Checkout
    return apiRequest('/api/orders', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        shipping_address: {
          name: 'Jane Doe',
          address: '123 Main St',
          city: 'Metropolis',
          country: 'US',
          zip: '12345',
        },
        coupon_code: couponCode,
        ...bodyOverrides,
      },
    });
  }

  test.before(async () => {
    const { db } = await setupTestServer();
    dbInstance = db;

    const cust = await loginUser('demo@codealpha.store', 'Demo@123456');
    customerToken = cust.token;

    const adm = await loginUser('admin@codealpha.store', 'Admin@123456');
    adminToken = adm.token;

    // Create an isolated product for inventory tests (₹1,000 retail price)
    testProduct = await dbInstance.createProduct({
      name: 'Inventory Test Product',
      slug: `inv-test-${Date.now()}`,
      price: 1000.00,
      stock: 10,
      sku: `SKU-INV-${Date.now()}`,
    });
  });

  test.after(async () => {
    await teardownTestServer();
  });

  test('Price Tampering: Server strictly recalculates totals in INR ignoring client-provided amounts', async () => {
    const res = await createOrderHelper(customerToken, testProduct.id, 2, null, {
      total_amount: 0.02, // Attempted total tampering!
      subtotal: 0.01,     // Attempted subtotal tampering!
    });

    assert.equal(res.status, 201);
    const order = res.body.data;
    // Subtotal should be 2 * ₹1,000.00 = ₹2,000.00
    assert.equal(order.subtotal, 2000);
    // Shipping: subtotal >= ₹1,000 -> free shipping (₹0)
    assert.equal(order.shipping_amount, 0);
    // Tax: 8% of 2000 = ₹160.00
    assert.equal(order.tax_amount, 160);
    // Total: 2000 + 160 = ₹2,160.00 (NOT 0.02)
    assert.equal(order.total_amount, 2160);
    // Currency is INR
    assert.equal(order.currency, 'INR');

    // Stock should have deducted by 2 (from 10 to 8)
    const updatedProd = await dbInstance.findProductById(testProduct.id);
    assert.equal(updatedProd.stock, 8);
  });

  test('Shipping Policy: Applies ₹99 shipping for orders below ₹1,000 threshold', async () => {
    const underThresholdProd = await dbInstance.createProduct({
      name: 'Budget Gadget',
      slug: `budget-${Date.now()}`,
      price: 500.00,
      stock: 20,
      sku: `SKU-BUD-${Date.now()}`,
    });

    const res = await createOrderHelper(customerToken, underThresholdProd.id, 1);
    assert.equal(res.status, 201);
    const order = res.body.data;

    assert.equal(order.subtotal, 500);
    assert.equal(order.shipping_amount, 99); // ₹99 standard shipping below ₹1,000
    assert.equal(order.tax_amount, 40);     // 8% of ₹500 = ₹40
    assert.equal(order.total_amount, 639);   // ₹500 + ₹99 + ₹40 = ₹639
  });

  test('Inventory Control: Rejects adding item exceeding available stock', async () => {
    const currentProd = await dbInstance.findProductById(testProduct.id);
    const excessQty = currentProd.stock + 5;

    const res = await apiRequest('/api/cart/items', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: { product_id: testProduct.id, quantity: excessQty },
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /stock/i);

    // Stock must remain unchanged
    const prodAfter = await dbInstance.findProductById(testProduct.id);
    assert.equal(prodAfter.stock, currentProd.stock);
  });

  test('Coupons: Valid percentage coupon applies INR discount with min order and cap enforced (Section 17 specification)', async () => {
    // 2 items * ₹1,000 = ₹2,000 subtotal
    // WELCOME10: 10% off, min order ₹1,500, max discount ₹500
    // Subtotal: ₹2,000
    // Discount: 10% of ₹2,000 = ₹200
    // Tax: 8% of ₹2,000 = ₹160
    // Shipping: subtotal >= ₹1,000 -> ₹0
    // Expected total: ₹2,000 - ₹200 + ₹160 = ₹1,960
    const res = await createOrderHelper(customerToken, testProduct.id, 2, 'WELCOME10');

    assert.equal(res.status, 201);
    const order = res.body.data;
    assert.equal(order.subtotal, 2000);
    assert.equal(order.discount_amount, 200); // 10% of ₹2,000
    assert.equal(order.coupon_code, 'WELCOME10');
    assert.equal(order.shipping_amount, 0);
    assert.equal(order.tax_amount, 160);
    assert.equal(order.total_amount, 1960);
    assert.equal(order.currency, 'INR');
  });

  test('Coupons: Rejects coupon if subtotal is below minimum order amount in INR', async () => {
    // Create item with price ₹500
    const cheap = await dbInstance.createProduct({
      name: 'Under Min Coupon Item',
      slug: `cheap-${Date.now()}`,
      price: 500.00,
      stock: 50,
      sku: `SKU-CHEAP-${Date.now()}`,
    });

    // SAVE200 requires minimum order amount of ₹2,500
    const res = await createOrderHelper(customerToken, cheap.id, 1, 'SAVE200');

    assert.equal(res.status, 400);
    assert.match(res.body.message, /minimum/i);
  });

  test('Order Cancellation: Restores stock atomically', async () => {
    const prodBefore = await dbInstance.findProductById(testProduct.id);
    const initialStock = prodBefore.stock;

    // Create an order of 2 items
    const orderRes = await createOrderHelper(customerToken, testProduct.id, 2);
    assert.equal(orderRes.status, 201);
    const orderId = orderRes.body.data.id;

    const prodDuring = await dbInstance.findProductById(testProduct.id);
    assert.equal(prodDuring.stock, initialStock - 2);

    // Cancel order via PATCH /api/orders/:id/cancel
    const cancelRes = await apiRequest(`/api/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    assert.equal(cancelRes.status, 200);
    assert.equal(cancelRes.body.data.status, 'CANCELLED');

    // Stock should be restored
    const prodAfter = await dbInstance.findProductById(testProduct.id);
    assert.equal(prodAfter.stock, initialStock);
  });

  test('Admin Refund: Restores stock and prevents double-refunding', async () => {
    // Create an order
    const orderRes = await createOrderHelper(customerToken, testProduct.id, 1);
    assert.equal(orderRes.status, 201);
    const orderId = orderRes.body.data.id;

    // Mock payment status to PAID
    await dbInstance.updateOrderStatus(orderId, 'CONFIRMED', 'PAID');

    const prodBeforeRefund = await dbInstance.findProductById(testProduct.id);
    const stockBefore = prodBeforeRefund.stock;

    // First refund
    const refundRes = await apiRequest(`/api/admin/orders/${orderId}/refund`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { reason: 'Customer returned item' },
    });
    assert.equal(refundRes.status, 200);
    assert.equal(refundRes.body.data.payment_status, 'REFUNDED');
    assert.equal(refundRes.body.data.status, 'CANCELLED');

    // Stock restored by 1
    const prodAfterRefund = await dbInstance.findProductById(testProduct.id);
    assert.equal(prodAfterRefund.stock, stockBefore + 1);

    // Second refund attempt must fail (double refund protection)
    const doubleRefundRes = await apiRequest(`/api/admin/orders/${orderId}/refund`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { reason: 'Duplicate refund attempt' },
    });
    assert.equal(doubleRefundRes.status, 400);
    assert.match(doubleRefundRes.body.message, /already.*refunded/i);
  });
});
