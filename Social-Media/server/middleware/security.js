import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// CORS configuration with explicit origin allowlist
const rawOrigins = process.env.ALLOWED_ORIGINS || 'http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000,http://127.0.0.1:3000';
export const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server, or same-origin file requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS error: Origin ${origin} not allowed.`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRFToken', 'x-csrftoken']
});

// Helmet Security Headers with robust Content Security Policy
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // required for inline application state bootstrap
        "https://cdnjs.cloudflare.com" // Three.js WebGL CDN
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
        "data:"
      ],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com"],
      connectSrc: [
        "'self'",
        "ws:",
        "wss:",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Rate limiting configurations
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Too many requests from this IP, please try again after 15 minutes.' }
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Too many authentication attempts, please try again in a minute.' }
});

export const contentLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Posting rate limit reached, please slow down.' }
});

export const sensitiveActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { detail: 'Too many password or security attempts, please try again later.' }
});
