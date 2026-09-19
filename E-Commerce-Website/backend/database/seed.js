'use strict';
/**
 * Database Seed Script
 * Populates the database with realistic demo data.
 * Run: npm run seed
 */
require('dotenv').config();
const { getDb } = require('./db');
const bcrypt = require('bcryptjs');

const { CATEGORIES, PRODUCTS_DATA, DEMO_COUPONS } = require('./catalogData');

async function seed() {
  console.log('🌱 Starting database seed...\n');

  const db = await getDb();

  // ── Admin user
  console.log('Creating admin user...');
  const existingAdmin = await db.findUserByEmail('admin@codealpha.store');
  if (!existingAdmin) {
    const hash = await bcrypt.hash('Admin@123456', 10);
    await db.createUser({ name: 'Admin User', email: 'admin@codealpha.store', password_hash: hash, role: 'ADMIN' });
    console.log('  ✅ Admin:    admin@codealpha.store / Admin@123456');
  } else {
    console.log('  ℹ️  Admin already exists');
  }

  // ── Demo customer
  const existingCustomer = await db.findUserByEmail('demo@codealpha.store');
  if (!existingCustomer) {
    const hash = await bcrypt.hash('Demo@123456', 10);
    await db.createUser({ name: 'Demo Customer', email: 'demo@codealpha.store', password_hash: hash, role: 'CUSTOMER' });
    console.log('  ✅ Customer: demo@codealpha.store   / Demo@123456');
  }

  // ── Categories
  console.log('\nCreating categories...');
  const catMap = {};
  for (const cat of CATEGORIES) {
    const existing = await db.findCategoryBySlug(cat.slug);
    if (!existing) {
      const created = await db.createCategory(cat);
      catMap[cat.slug] = created.id;
      console.log(`  ✅ ${cat.name}`);
    } else {
      catMap[cat.slug] = existing.id;
      console.log(`  ℹ️  ${cat.name} already exists`);
    }
  }

  // ── Products
  console.log(`\nCreating products (${PRODUCTS_DATA.length} items)...`);
  let createdCount = 0;
  let existingCount = 0;
  for (const p of PRODUCTS_DATA) {
    const existing = await db.findProductBySlug(p.slug);
    if (!existing) {
      const { category, ...productData } = p;
      await db.createProduct({ ...productData, category_id: catMap[category] });
      createdCount++;
    } else {
      existingCount++;
    }
  }
  console.log(`  ✅ Seeded ${createdCount} new products (${existingCount} already existed)`);

  // ── Coupons
  console.log('\nCreating coupons...');
  for (const c of DEMO_COUPONS) {
    const existing = await db.getCouponByCode(c.code);
    if (!existing) {
      await db.createCoupon(c);
      console.log(`  ✅ Coupon: ${c.code}`);
    }
  }

  console.log('\n✨ Seed complete!');
  console.log('\n📋 Demo credentials:');
  console.log('   Admin:    admin@codealpha.store  / Admin@123456');
  console.log('   Customer: demo@codealpha.store   / Demo@123456');
  console.log('   Coupons:  WELCOME10 (10% off), SAVE200 (₹200 off), VIP50 (50% off)\n');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
