'use strict';
const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getCart);
router.post('/items',
  [
    body('product_id').notEmpty().withMessage('Product ID required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  ],
  validate,
  ctrl.addItem
);
router.put('/items/:id',
  [body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1')],
  validate,
  ctrl.updateItem
);
router.delete('/items/:id', ctrl.removeItem);
router.delete('/', ctrl.clearCart);

module.exports = router;
