import express from 'express';
import { dbGet, dbRun, dbAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications/
router.get('/notifications/', requireAuth, async (req, res) => {
  try {
    const notifs = await dbAll(`
      SELECT n.*, u.username as actor_username, u.avatar as actor_avatar
      FROM notifications n
      JOIN users u ON n.actor_id = u.id
      WHERE n.recipient_id = ?
      ORDER BY n.created_at DESC LIMIT 30
    `, [req.user.id]);

    const unreadCount = await dbGet('SELECT COUNT(*) as c FROM notifications WHERE recipient_id = ? AND is_read = 0', [req.user.id]);

    const formatted = notifs.map(n => ({
      id: n.id,
      actor: {
        id: n.actor_id,
        username: n.actor_username,
        avatar: n.actor_avatar || ''
      },
      verb: n.verb,
      target_id: n.target_id,
      target_type: n.target_type,
      is_read: !!n.is_read,
      created_at: n.created_at
    }));

    res.json({
      unread_count: unreadCount.c || 0,
      results: formatted
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PATCH /api/notifications/:id/read/
router.patch('/notifications/:id/read/', requireAuth, async (req, res) => {
  try {
    await dbRun('UPDATE notifications SET is_read = 1 WHERE id = ? AND recipient_id = ?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/notifications/read-all/
router.post('/notifications/read-all/', requireAuth, async (req, res) => {
  try {
    await dbRun('UPDATE notifications SET is_read = 1 WHERE recipient_id = ?', [req.user.id]);
    res.json({ success: true, detail: 'All marked as read.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
