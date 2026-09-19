'use strict';
const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/couponController');
const { validate } = require('../middleware/validate');

const router = Router();

router.post('/validate',
  [
    body('code').trim().notEmpty().withMessage('Coupon code is required'),
    body('subtotal').isFloat({ min: 0 }).withMessage('Valid subtotal is required'),
  ],
  validate,
  ctrl.validateCoupon
);

module.exports = router;
