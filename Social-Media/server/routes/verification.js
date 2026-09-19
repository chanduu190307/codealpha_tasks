import express from 'express';
import { dbGet, dbRun } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Ensure verification_requests table exists
async function ensureVerificationTable() {
  await dbRun(`
    CREATE TABLE IF NOT EXISTS verification_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      category TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      review_notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}
ensureVerificationTable().catch(console.error);

// GET /api/verification/request/
router.get('/request/', requireAuth, async (req, res) => {
  try {
    const latest = await dbGet(
      'SELECT * FROM verification_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
      [req.user.id]
    );

    if (!latest) {
      return res.json({ status: 'none' });
    }

    res.json({
      id: latest.id,
      full_name: latest.full_name,
      category: latest.category,
      reason: latest.reason,
      status: latest.status,
      created_at: latest.created_at
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/verification/request/
router.post('/request/', requireAuth, async (req, res) => {
  const full_name = req.body.full_name || req.user.display_name || req.user.username;
  const { category, reason } = req.body;

  if (!category || !category.trim()) {
    return res.status(400).json({ detail: 'Category is required.' });
  }
  if (!reason || !reason.trim()) {
    return res.status(400).json({ detail: 'Reason for verification is required.' });
  }

  try {
    const pending = await dbGet(
      "SELECT id FROM verification_requests WHERE user_id = ? AND status = 'pending'",
      [req.user.id]
    );

    if (pending) {
      return res.status(400).json({ detail: 'You already have a pending verification request under review.' });
    }

    const result = await dbRun(`
      INSERT INTO verification_requests (user_id, full_name, category, reason, status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [req.user.id, full_name.trim(), category.trim(), reason.trim()]);

    res.status(201).json({
      id: result.lastID,
      status: 'pending',
      full_name: full_name.trim(),
      category: category.trim(),
      detail: 'Verification request submitted for staff review.'
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
