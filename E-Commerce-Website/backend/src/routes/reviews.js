'use strict';
const { Router } = require('express');
const { body, param } = require('express-validator');
const ctrl = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router({ mergeParams: true });

router.get('/', ctrl.getReviews);
router.post('/',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').optional().isLength({ max: 1000 }),
  ],
  validate,
  ctrl.createReview
);

router.put('/:id',
  authenticate,
  [
    body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5'),
    body('comment').optional().isLength({ max: 1000 }),
  ],
  validate,
  ctrl.updateReview
);

router.delete('/:id', authenticate, ctrl.deleteReview);

module.exports = router;
