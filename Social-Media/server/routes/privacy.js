import express from 'express';
import { dbGet, dbRun } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/privacy/settings/
router.get('/settings/', requireAuth, async (req, res) => {
  try {
    const user = await dbGet('SELECT is_private, who_can_message FROM users WHERE id = ?', [req.user.id]);
    res.json({
      is_private: !!user.is_private,
      who_can_message: user.who_can_message || 'everyone'
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PATCH /api/privacy/settings/
router.patch('/settings/', requireAuth, async (req, res) => {
  const { is_private, who_can_message } = req.body;
  try {
    await dbRun(
      'UPDATE users SET is_private = COALESCE(?, is_private), who_can_message = COALESCE(?, who_can_message) WHERE id = ?',
      [is_private !== undefined ? (is_private ? 1 : 0) : null, who_can_message, req.user.id]
    );

    res.json({ success: true, detail: 'Privacy settings updated.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
