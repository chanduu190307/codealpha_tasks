import express from 'express';
import path from 'path';
import fs from 'fs';
import { dbGet, dbRun, dbAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { createSecureUpload, validateUploadedImageFile } from '../middleware/upload.js';

const router = express.Router();

const upload = createSecureUpload('stories');

// GET /api/stories/feed/
router.get('/stories/feed/', requireAuth, async (req, res) => {
  try {
    const rawStories = await dbAll(`
      SELECT s.*, u.username as author_username, u.avatar as author_avatar
      FROM stories s
      JOIN users u ON s.author_id = u.id
      WHERE s.expires_at > CURRENT_TIMESTAMP
      ORDER BY s.created_at DESC
    `);

    const formatted = await Promise.all(rawStories.map(async (s) => {
      const view = await dbGet('SELECT 1 FROM story_views WHERE story_id = ? AND user_id = ?', [s.id, req.user.id]);
      return {
        id: s.id,
        author: {
          id: s.author_id,
          username: s.author_username,
          avatar: s.author_avatar || ''
        },
        media: s.media.startsWith('http') ? s.media : `/media/stories/${path.basename(s.media)}`,
        caption: s.caption,
        has_viewed: !!view,
        created_at: s.created_at
      };
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/stories/
router.post('/stories/', requireAuth, upload.single('media'), validateUploadedImageFile, async (req, res) => {
  const { caption } = req.body;
  if (!req.file) {
    return res.status(400).json({ detail: 'Media file is required for story.' });
  }

  const mediaPath = `/media/stories/${req.file.filename}`;
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

  try {
    const result = await dbRun(`
      INSERT INTO stories (author_id, media, caption, expires_at)
      VALUES (?, ?, ?, ?)
    `, [req.user.id, mediaPath, caption || '', expiresAt]);

    res.status(201).json({
      success: true,
      detail: 'Story created successfully.',
      story_id: result.lastID
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/stories/:id/view/
router.post('/stories/:id/view/', requireAuth, async (req, res) => {
  try {
    await dbRun('INSERT OR IGNORE INTO story_views (story_id, user_id) VALUES (?, ?)', [req.params.id, req.user.id]);
    res.json({ status: 'viewed' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
