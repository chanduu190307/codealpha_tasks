'use strict';

const http = require('http');
const app = require('../src/server');
const { getDb } = require('../database/db');
const { autoSeed } = require('../database/autoSeed');

let server = null;
let baseUrl = '';

async function setupTestServer() {
  process.env.NODE_ENV = 'test';
  process.env.DB_MODE = 'local';
  process.env.JWT_SECRET = 'test_jwt_secret_super_secure_key_1234567890';
  process.env.STRIPE_SECRET_KEY = 'sk_test_mock_secret_key';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_mock_webhook_secret';

  const db = await getDb();
  await autoSeed(db);

  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });

  return { baseUrl, db };
}

async function teardownTestServer() {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
    server = null;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const headers = { ...options.headers };

  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (options.body && typeof options.body === 'object' && !(options.body instanceof Buffer) && !isFormData) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return {
    status: res.status,
    headers: res.headers,
    body: data,
  };
}

async function loginUser(email, password) {
  const res = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
  if (res.status !== 200) {
    throw new Error(`Login failed for ${email}: ${JSON.stringify(res.body)}`);
  }
  return res.body.data; // { user, token }
}

module.exports = {
  setupTestServer,
  teardownTestServer,
  apiRequest,
  loginUser,
};
