'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { setupTestServer, teardownTestServer, apiRequest, loginUser } = require('./testHelper');

test.describe('Authentication & Authorization Suite', () => {
  let dbInstance;

  test.before(async () => {
    const { db } = await setupTestServer();
    dbInstance = db;
  });

  test.after(async () => {
    await teardownTestServer();
  });

  test('Password policy: Rejects weak passwords during registration', async () => {
    const weakPasswords = [
      'short',               // too short
      'nouppercase123!',     // no uppercase
      'NOLOWERCASE123!',     // no lowercase
      'NoSpecialChars123',   // no special symbol
      'NoNumbers!@#$%',      // no numbers
    ];

    for (const pwd of weakPasswords) {
      const res = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Weak Pwd Tester',
          email: `weak_${Date.now()}_${Math.random()}@test.com`,
          password: pwd,
        },
      });

      assert.equal(res.status, 400, `Expected 400 for password: ${pwd}`);
      assert.equal(res.body.success, false);
    }
  });

  test('Registration: Successfully registers user with strong password', async () => {
    const email = `strong_${Date.now()}@test.com`;
    const res = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Strong User',
        email,
        password: 'Valid@Password123!',
      },
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.user.email, email);
    assert.ok(res.body.data.token, 'Token must be returned');
  });

  test('Registration: Rejects duplicate email', async () => {
    const email = `duplicate_${Date.now()}@test.com`;
    // First registration
    const res1 = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'First User', email, password: 'Valid@Password123!' },
    });
    assert.equal(res1.status, 201);

    // Second registration with same email
    const res2 = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Duplicate User', email, password: 'Valid@Password123!' },
    });
    assert.equal(res2.status, 409);
    assert.equal(res2.body.success, false);
  });

  test('Login: Returns JWT token on valid credentials', async () => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@codealpha.store', password: 'Admin@123456' },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.role, 'ADMIN');
  });

  test('Login: Rejects invalid password', async () => {
    const res = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: 'admin@codealpha.store', password: 'WrongPassword999!' },
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('Forgot & Reset Password: Complete secure token cycle', async () => {
    const resetEmail = `reset_${Date.now()}@test.com`;
    await apiRequest('/api/auth/register', {
      method: 'POST',
      body: { name: 'Reset User', email: resetEmail, password: 'OldPassword@123!' },
    });

    // 1. Request forgot password
    const forgotRes = await apiRequest('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: resetEmail },
    });
    assert.equal(forgotRes.status, 200);
    assert.equal(forgotRes.body.success, true);

    // 2. Fetch raw token from local db table
    const user = await dbInstance.findUserByEmail(resetEmail);
    assert.ok(user, 'User should exist');

    // 3. Attempt reset with invalid/tampered token
    const badResetRes = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { token: 'invalid_raw_token', password: 'NewPassword@123!' },
    });
    assert.equal(badResetRes.status, 400);

    // 4. In test mode, create a known token and test successful reset
    const crypto = require('crypto');
    const rawToken = 'test_token_' + crypto.randomBytes(16).toString('hex');
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
    await dbInstance.createPasswordReset(
      user.id,
      hashed,
      new Date(Date.now() + 3600000).toISOString()
    );

    const goodResetRes = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { token: rawToken, password: 'NewPassword@123!' },
    });
    assert.equal(goodResetRes.status, 200);
    assert.equal(goodResetRes.body.success, true);

    // 5. Verify old password no longer works and new password works
    const oldLogin = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: resetEmail, password: 'OldPassword@123!' },
    });
    assert.equal(oldLogin.status, 401);

    const newLogin = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email: resetEmail, password: 'NewPassword@123!' },
    });
    assert.equal(newLogin.status, 200);

    // 6. Token reuse is prevented (token marked used)
    const reuseRes = await apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: { token: rawToken, password: 'AnotherPassword@123!' },
    });
    assert.equal(reuseRes.status, 400);
  });

  test('Authorization: Customer cannot access admin endpoints', async () => {
    const customerAuth = await loginUser('demo@codealpha.store', 'Demo@123456');
    const res = await apiRequest('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${customerAuth.token}` },
    });

    assert.equal(res.status, 403, 'Customer role must be denied access to admin dashboard');
    assert.equal(res.body.success, false);
  });

  test('Authorization: Admin can access admin endpoints', async () => {
    const adminAuth = await loginUser('admin@codealpha.store', 'Admin@123456');
    const res = await apiRequest('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminAuth.token}` },
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });
});
