'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { setupTestServer, teardownTestServer, apiRequest, loginUser } = require('./testHelper');

test.describe('File Upload Security Suite', () => {
  let customerToken;
  let adminToken;

  test.before(async () => {
    await setupTestServer();
    const cust = await loginUser('demo@codealpha.store', 'Demo@123456');
    customerToken = cust.token;

    const adm = await loginUser('admin@codealpha.store', 'Admin@123456');
    adminToken = adm.token;
  });

  test.after(async () => {
    await teardownTestServer();
  });

  test('Upload Security: Rejects unauthenticated upload attempt', async () => {
    const formData = new FormData();
    const dummyBlob = new Blob([Buffer.alloc(20)], { type: 'image/jpeg' });
    formData.append('image', dummyBlob, 'test.jpg');

    const res = await apiRequest('/api/upload', {
      method: 'POST',
      body: formData,
    });

    assert.equal(res.status, 401);
  });

  test('Upload Security: Rejects SVG files (XSS vector)', async () => {
    const formData = new FormData();
    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>';
    const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
    formData.append('image', svgBlob, 'malicious.svg');

    const res = await apiRequest('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: formData,
    });

    assert.equal(res.status, 400);
    assert.match(res.body.message, /invalid file format|allowed/i);
  });

  test('Upload Security: Rejects file with spoofed extension and invalid magic bytes', async () => {
    const formData = new FormData();
    // A fake PHP/text script named fake.png
    const fakeContent = '<?php system($_GET["cmd"]); ?>This is not a real PNG image.';
    const fakeBlob = new Blob([fakeContent], { type: 'image/png' });
    formData.append('image', fakeBlob, 'fake.png');

    const res = await apiRequest('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: formData,
    });

    assert.equal(res.status, 400);
    assert.match(res.body.message, /invalid image signature|forbidden/i);
  });

  test('Upload Security: Successfully uploads authentic JPEG with valid magic bytes', async () => {
    const formData = new FormData();
    // Valid JPEG header bytes: FF D8 FF E0 00 10 4A 46 49 46 00 01
    const jpegHeader = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
      0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
    ]);
    const jpegBlob = new Blob([jpegHeader], { type: 'image/jpeg' });
    formData.append('image', jpegBlob, 'photo.jpg');

    const res = await apiRequest('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: formData,
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.url.startsWith('/uploads/'));
    assert.ok(res.body.data.filename.endsWith('.jpg'));

    // Verify stored file on disk
    const filePath = path.resolve(__dirname, '../uploads', res.body.data.filename);
    assert.ok(fs.existsSync(filePath), 'Saved file must exist in uploads directory');

    // Clean up test file
    fs.unlinkSync(filePath);
  });

  test('Upload Security: Successfully uploads authentic PNG with valid magic bytes', async () => {
    const formData = new FormData();
    // Valid PNG header bytes: 89 50 4E 47 0D 0A 1A 0A
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01,
    ]);
    const pngBlob = new Blob([pngHeader], { type: 'image/png' });
    formData.append('image', pngBlob, 'screenshot.png');

    const res = await apiRequest('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}` },
      body: formData,
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.filename.endsWith('.png'));

    // Clean up test file
    const filePath = path.resolve(__dirname, '../uploads', res.body.data.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  });
});
