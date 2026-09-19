'use strict';
/**
 * Database Initialization Script
 * 
 * Verifies database connection and prepares schema/tables.
 * Run: npm run db:init
 */
require('dotenv').config();
const { getDb } = require('./db');
const { autoSeed } = require('./autoSeed');
const config = require('../src/config/env');

async function init() {
  console.log(`\n📦 Initializing database (mode: ${config.db.mode})...`);
  const db = await getDb();

  if (config.db.mode === 'local') {
    console.log('  ✅ In-memory database store initialized.');
    await autoSeed(db);
    console.log('  ✅ Default development seed verified.');
  } else {
    console.log('  ✅ Connected to PostgreSQL / Supabase instance.');
    console.log('  ℹ️  Ensure migrations in database/migrations/ have been applied to your database.');
  }

  console.log('✨ Database initialization complete!\n');
}

init().catch((err) => {
  console.error('❌ Database initialization failed:', err.message);
  process.exit(1);
});
