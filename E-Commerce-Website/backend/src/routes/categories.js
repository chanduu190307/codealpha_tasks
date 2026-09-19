'use strict';
const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { validate } = require('../middleware/validate');

const router = Router();

router.get('/', ctrl.getCategories);
router.get('/:slug', ctrl.getCategory);

router.post('/',
  authenticate, requireAdmin,
  [body('name').trim().notEmpty().withMessage('Name is required')],
  validate,
  ctrl.createCategory
);

router.put('/:id', authenticate, requireAdmin, ctrl.updateCategory);
router.delete('/:id', authenticate, requireAdmin, ctrl.deleteCategory);

module.exports = router;
