'use strict';
require('dotenv').config();

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config/env');
const { getDb } = require('../database/db');
const { errorHandler } = require('./middleware/errorHandler');
const { autoSeed } = require('../database/autoSeed');
const { UPLOAD_DIR } = require('./utils/fileUpload');

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const wishlistRoutes = require('./routes/wishlist');
const orderRoutes = require('./routes/orders');
const reviewRoutes = require('./routes/reviews');
const adminRoutes = require('./routes/admin');
const couponRoutes = require('./routes/coupons');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/upload');

const app = express();

// ── Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// ── CORS (Strict origin check)
const allowedOrigins = [config.cors.origin, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or tests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy does not allow access from ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature', 'x-webhook-signature'],
  })
);

// ── Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { success: false, message: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter limiter on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.isDev ? 'dev' : 'combined'));
}

// ── Mount Webhooks BEFORE global JSON parser (Stripe requires raw body buffer)
app.use('/api/payments', paymentRoutes);

// ── Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ── Safe static upload serving
app.use(
  '/uploads',
  express.static(UPLOAD_DIR, {
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'");
    },
  })
);

// ── Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CodeAlpha E-Commerce API is running',
    version: '1.0.0',
    environment: config.nodeEnv,
    dbMode: config.db.mode,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/products/:productId/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

// ── 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ── Centralized error handler (must be last)
app.use(errorHandler);

// ── Start server helper
let serverInstance = null;
async function startServer(port = config.port) {
  try {
    console.log(`[Server] Initializing database (mode: ${config.db.mode})...`);
    const db = await getDb();
    console.log('[Server] Database ready');

    if (config.db.mode === 'local') {
      await autoSeed(db);
    }

    return new Promise((resolve) => {
      serverInstance = app.listen(port, () => {
        console.log(`\n🚀 CodeAlpha E-Commerce API running on port ${port}`);
        console.log(`   Environment: ${config.nodeEnv}`);
        console.log(`   DB Mode:     ${config.db.mode}`);
        console.log(`   Health:      http://localhost:${port}/api/health\n`);
        resolve(serverInstance);
      });
    });
  } catch (err) {
    console.error('[Server] Failed to start:', err.message);
    process.exit(1);
  }
}

// Automatically start when executed directly
if (require.main === module) {
  startServer();
}

module.exports = app;
module.exports.startServer = startServer;
