'use strict';
/**
 * Auto-Seed Module
 * 
 * Called by server.js at startup when DB_MODE=local.
 * Injects demo data directly into the running adapter instance.
 * This solves the ephemeral in-memory store problem where the
 * standalone seed.js script couldn't populate the live server.
 */

const bcrypt = require('bcryptjs');
const { CATEGORIES, PRODUCTS_DATA, DEMO_COUPONS } = require('./catalogData');

async function autoSeed(db) {
  console.log('[AutoSeed] Populating local in-memory store with demo data...');

  // ── Admin user
  const existingAdmin = await db.findUserByEmail('admin@codealpha.store');
  if (!existingAdmin) {
    const hash = await bcrypt.hash('Admin@123456', 10);
    await db.createUser({ name: 'Admin User', email: 'admin@codealpha.store', password_hash: hash, role: 'ADMIN' });
  }

  // ── Demo customer
  const existingCustomer = await db.findUserByEmail('demo@codealpha.store');
  if (!existingCustomer) {
    const hash = await bcrypt.hash('Demo@123456', 10);
    await db.createUser({ name: 'Demo Customer', email: 'demo@codealpha.store', password_hash: hash, role: 'CUSTOMER' });
  }

  // ── Categories
  const catMap = {};
  for (const cat of CATEGORIES) {
    const existing = await db.findCategoryBySlug(cat.slug);
    if (!existing) {
      const created = await db.createCategory(cat);
      catMap[cat.slug] = created.id;
    } else {
      catMap[cat.slug] = existing.id;
    }
  }

  // ── Products
  for (const p of PRODUCTS_DATA) {
    const existing = await db.findProductBySlug(p.slug);
    if (!existing) {
      const { category, ...productData } = p;
      await db.createProduct({ ...productData, category_id: catMap[category] });
    }
  }

  // ── Coupons
  for (const c of DEMO_COUPONS) {
    const existing = await db.getCouponByCode(c.code);
    if (!existing) {
      await db.createCoupon(c);
    }
  }

  console.log('[AutoSeed] Done. Demo credentials:');
  console.log('          Admin:    admin@codealpha.store  / Admin@123456');
  console.log('          Customer: demo@codealpha.store   / Demo@123456');
  console.log('          Coupons:  WELCOME10 (10% off up to ₹500), SAVE200 (₹200 off), VIP50 (50% off up to ₹2,000)\n');
}

module.exports = { autoSeed };
