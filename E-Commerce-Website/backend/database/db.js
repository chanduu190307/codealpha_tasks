'use strict';
/**
 * Database Factory
 * 
 * Returns the configured database adapter based on DB_MODE env var.
 * Application code never imports adapters directly — only this module.
 * 
 * Architecture:
 *   Application → Services → Repositories → db (this module) → Adapter
 */

const config = require('../src/config/env');

let adapter = null;

async function getDb() {
  if (adapter) return adapter;

  if (config.db.mode === 'supabase') {
    const SupabaseAdapter = require('./adapters/supabaseAdapter');
    adapter = new SupabaseAdapter();
  } else {
    const LocalAdapter = require('./adapters/localAdapter');
    adapter = new LocalAdapter();
  }

  await adapter.init();
  return adapter;
}

module.exports = { getDb };
