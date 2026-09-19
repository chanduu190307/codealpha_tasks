'use strict';
const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const { uploadMiddleware } = require('../utils/fileUpload');
const ctrl = require('../controllers/uploadController');

const router = Router();

// Uploads require authentication
router.post(
  ['/', '/image'],
  authenticate,
  uploadMiddleware.single('image'),
  ctrl.uploadImage
);

module.exports = router;
