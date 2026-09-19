'use strict';
const { Router } = require('express');
const { body, query } = require('express-validator');
const ctrl = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { validate } = require('../middleware/validate');

const router = Router();

router.get('/', ctrl.getProducts);
router.get('/:id', ctrl.getProduct);

router.post('/',
  authenticate, requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be non-negative'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be non-negative integer'),
    body('images').optional().isArray(),
  ],
  validate,
  ctrl.createProduct
);

router.put('/:id',
  authenticate, requireAdmin,
  [
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
  ],
  validate,
  ctrl.updateProduct
);

router.delete('/:id', authenticate, requireAdmin, ctrl.deleteProduct);

module.exports = router;
