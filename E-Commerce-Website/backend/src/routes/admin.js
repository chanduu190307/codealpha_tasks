'use strict';
const { Router } = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/adminController');
const productCtrl = require('../controllers/productController');
const categoryCtrl = require('../controllers/categoryController');
const { authenticate } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/admin');
const { validate } = require('../middleware/validate');

const router = Router();

// All admin routes strictly require authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', ctrl.getDashboard);

// Orders management
router.get('/orders', ctrl.getAllOrders);
router.get('/orders/:id', (req, res, next) => {
  const orderCtrl = require('../controllers/orderController');
  return orderCtrl.getOrder(req, res, next);
});
router.patch('/orders/:id/status',
  [body('status').notEmpty().withMessage('Status required')],
  validate,
  ctrl.updateOrderStatus
);
router.post('/orders/:id/refund',
  [body('reason').optional().isString().trim()],
  validate,
  ctrl.refundOrder
);

// Customers
router.get('/customers', ctrl.getAllCustomers);
router.patch('/customers/:id/status',
  [body('is_active').isBoolean().withMessage('is_active must be a boolean')],
  validate,
  ctrl.updateCustomerStatus
);

// Coupons
router.get('/coupons', ctrl.getAllCoupons);
router.post('/coupons',
  [
    body('code').trim().notEmpty().withMessage('Coupon code required'),
    body('discount_type').isIn(['percentage', 'fixed']).withMessage('discount_type must be percentage or fixed'),
    body('discount_value').isFloat({ min: 0.01 }).withMessage('discount_value must be greater than 0'),
    body('min_order_amount').optional().isFloat({ min: 0 }),
    body('max_discount').optional({ nullable: true }).isFloat({ min: 0 }),
    body('usage_limit').optional({ nullable: true }).isInt({ min: 1 }),
    body('expires_at').optional({ nullable: true }).isISO8601().withMessage('expires_at must be valid date'),
    body('is_active').optional().isBoolean(),
  ],
  validate,
  ctrl.createCoupon
);
router.put('/coupons/:id',
  [
    body('discount_type').optional().isIn(['percentage', 'fixed']),
    body('discount_value').optional().isFloat({ min: 0.01 }),
    body('min_order_amount').optional().isFloat({ min: 0 }),
    body('is_active').optional().isBoolean(),
  ],
  validate,
  ctrl.updateCoupon
);
router.delete('/coupons/:id', ctrl.deleteCoupon);

// Audit Logs
router.get('/audit-logs', ctrl.getAuditLogs);

// Products (admin CRUD)
router.get('/products', productCtrl.getProducts);
router.post('/products', productCtrl.createProduct);
router.put('/products/:id', productCtrl.updateProduct);
router.delete('/products/:id', productCtrl.deleteProduct);

// Categories
router.get('/categories', categoryCtrl.getCategories);
router.post('/categories', categoryCtrl.createCategory);
router.put('/categories/:id', categoryCtrl.updateCategory);
router.delete('/categories/:id', categoryCtrl.deleteCategory);

module.exports = router;
