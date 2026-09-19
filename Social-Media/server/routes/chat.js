import express from 'express';
import { dbGet, dbRun, dbAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/conversations/
router.get('/conversations/', requireAuth, async (req, res) => {
  try {
    const convs = await dbAll(`
      SELECT c.id, c.updated_at,
             other_u.id as other_id, other_u.username as other_username, other_u.display_name as other_display_name, other_u.avatar as other_avatar
      FROM conversations c
      JOIN conversation_members cm1 ON c.id = cm1.conversation_id AND cm1.user_id = ?
      JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id != ?
      JOIN users other_u ON cm2.user_id = other_u.id
      ORDER BY c.updated_at DESC
    `, [req.user.id, req.user.id]);

    const formatted = await Promise.all(convs.map(async (c) => {
      const lastMsg = await dbGet(`
        SELECT content, created_at FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at DESC LIMIT 1
      `, [c.id]);

      return {
        id: c.id,
        other_user: {
          id: c.other_id,
          username: c.other_username,
          display_name: c.other_display_name,
          avatar: c.other_avatar
        },
        last_message: lastMsg || null,
        updated_at: c.updated_at
      };
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/conversations/
router.post('/conversations/', requireAuth, async (req, res) => {
  const { recipient_id, recipient_username } = req.body;
  let targetUser = null;

  try {
    if (recipient_id) {
      targetUser = await dbGet('SELECT id, username, display_name, avatar FROM users WHERE id = ?', [recipient_id]);
    } else if (recipient_username) {
      targetUser = await dbGet('SELECT id, username, display_name, avatar FROM users WHERE username = ?', [recipient_username]);
    }

    if (!targetUser) {
      return res.status(404).json({ detail: 'Recipient user not found.' });
    }

    if (targetUser.id === req.user.id) {
      return res.status(400).json({ detail: 'Cannot start conversation with yourself.' });
    }

    // Check if 1-on-1 conversation already exists
    const existing = await dbGet(`
      SELECT cm1.conversation_id as id
      FROM conversation_members cm1
      JOIN conversation_members cm2 ON cm1.conversation_id = cm2.conversation_id
      WHERE cm1.user_id = ? AND cm2.user_id = ?
    `, [req.user.id, targetUser.id]);

    if (existing) {
      return res.json({
        id: existing.id,
        other_user: {
          id: targetUser.id,
          username: targetUser.username,
          display_name: targetUser.display_name || targetUser.username,
          avatar: targetUser.avatar || ''
        },
        detail: 'Existing conversation retrieved.'
      });
    }

    // Create new conversation
    const convResult = await dbRun('INSERT INTO conversations (created_at, updated_at) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)');
    const convId = convResult.lastID;

    await dbRun('INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)', [convId, req.user.id]);
    await dbRun('INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?)', [convId, targetUser.id]);

    res.status(201).json({
      id: convId,
      other_user: {
        id: targetUser.id,
        username: targetUser.username,
        display_name: targetUser.display_name || targetUser.username,
        avatar: targetUser.avatar || ''
      },
      detail: 'Conversation created successfully.'
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/conversations/:id/messages/
router.get('/conversations/:id/messages/', requireAuth, async (req, res) => {
  const convId = req.params.id;
  try {
    const isMember = await dbGet('SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?', [convId, req.user.id]);
    if (!isMember) return res.status(403).json({ detail: 'Access denied.' });

    const msgs = await dbAll(`
      SELECT m.*, u.username as sender_username, u.display_name as sender_display_name, u.avatar as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ?
      ORDER BY m.created_at ASC
    `, [convId]);

    const formatted = msgs.map(m => ({
      id: m.id,
      conversation: m.conversation_id,
      sender: {
        id: m.sender_id,
        username: m.sender_username,
        display_name: m.sender_display_name,
        avatar: m.sender_avatar
      },
      content: m.content,
      created_at: m.created_at
    }));

    res.json({ results: formatted });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/conversations/:id/messages/
router.post('/conversations/:id/messages/', requireAuth, async (req, res) => {
  const convId = req.params.id;
  const { content } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ detail: 'Content is required.' });

  try {
    const isMember = await dbGet('SELECT 1 FROM conversation_members WHERE conversation_id = ? AND user_id = ?', [convId, req.user.id]);
    if (!isMember) return res.status(403).json({ detail: 'Access denied.' });

    const resMsg = await dbRun(
      'INSERT INTO messages (conversation_id, sender_id, content) VALUES (?, ?, ?)',
      [convId, req.user.id, content.trim()]
    );

    await dbRun('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [convId]);

    const created = await dbGet(`
      SELECT m.*, u.username as sender_username, u.display_name as sender_display_name, u.avatar as sender_avatar
      FROM messages m
      JOIN users u ON m.sender_id = u.id
      WHERE m.id = ?
    `, [resMsg.lastID]);

    res.status(201).json({
      id: created.id,
      conversation: created.conversation_id,
      sender: {
        id: created.sender_id,
        username: created.sender_username,
        display_name: created.sender_display_name,
        avatar: created.sender_avatar
      },
      content: created.content,
      created_at: created.created_at
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
