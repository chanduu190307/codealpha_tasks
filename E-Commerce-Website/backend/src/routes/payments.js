'use strict';
const express = require('express');
const { Router } = require('express');
const ctrl = require('../controllers/paymentWebhookController');

const router = Router();

// Stripe requires raw buffer for signature verification
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  ctrl.handleWebhook
);

module.exports = router;
