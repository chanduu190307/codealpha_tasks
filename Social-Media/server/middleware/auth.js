import jwt from 'jsonwebtoken';
import { dbGet } from '../db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'pulse-3d-node-super-secret-key-2026';

export async function authMiddleware(req, res, next) {
  let token = null;

  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  // 2. Check Cookie if present
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(';');
    for (const c of cookies) {
      const [key, val] = c.trim().split('=');
      if (key === 'pulse_token' || key === 'sessionid') {
        token = decodeURIComponent(val);
        break;
      }
    }
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dbGet(
      'SELECT id, username, email, display_name, bio, avatar, is_private, who_can_message FROM users WHERE id = ? AND is_active = 1',
      [decoded.userId]
    );
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }

  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      detail: 'Authentication credentials were not provided or are invalid.'
    });
  }
  next();
}
