'use strict';
const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.post('/',
  [
    body('shipping_address.name').notEmpty().withMessage('Recipient name required'),
    body('shipping_address.address').notEmpty().withMessage('Address required'),
    body('shipping_address.city').notEmpty().withMessage('City required'),
    body('shipping_address.country').notEmpty().withMessage('Country required'),
    body('shipping_address.zip').notEmpty().withMessage('ZIP code required'),
  ],
  validate,
  ctrl.createOrder
);

router.get('/', ctrl.getMyOrders);
router.get('/:id', ctrl.getOrder);
router.patch('/:id/cancel', ctrl.cancelOrder);

module.exports = router;
