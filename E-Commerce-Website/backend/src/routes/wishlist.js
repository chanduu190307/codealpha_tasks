'use strict';
const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/wishlistController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();

router.use(authenticate);

router.get('/', ctrl.getWishlist);
router.post('/',
  [body('product_id').notEmpty().withMessage('Product ID required')],
  validate,
  ctrl.addItem
);
router.delete('/:productId', ctrl.removeItem);

module.exports = router;
