import express from 'express';
import { dbGet, dbAll } from '../db.js';

const router = express.Router();

// GET /api/trending/hashtags/
router.get('/trending/hashtags/', async (req, res) => {
  try {
    const tags = await dbAll('SELECT name, usage_count as count FROM hashtags ORDER BY usage_count DESC LIMIT 15');
    res.json(tags);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/discovery/suggestions/
router.get('/discovery/suggestions/', async (req, res) => {
  const currentUserId = req.user ? req.user.id : 0;
  try {
    const suggestions = await dbAll(`
      SELECT id, username, display_name, avatar, bio
      FROM users
      WHERE id != ? AND is_active = 1 AND id NOT IN (
        SELECT following_id FROM follows WHERE follower_id = ?
      )
      LIMIT 6
    `, [currentUserId, currentUserId]);

    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/users/search/
router.get('/users/search/', async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) return res.json({ results: [] });

  try {
    const cleanQ = q.trim();
    const results = await dbAll(`
      SELECT id, username, display_name, avatar
      FROM users
      WHERE (username LIKE ? OR display_name LIKE ?) AND is_active = 1
      LIMIT 10
    `, [`%${cleanQ}%`, `%${cleanQ}%`]);

    res.json({ results });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/search/ (Multi-Entity Ranked Search across Users, Posts, and Hashtags)
router.get('/search/', async (req, res) => {
  const q = req.query.q || '';
  if (!q.trim()) {
    return res.json({ users: [], posts: [], hashtags: [] });
  }

  const cleanQ = q.trim();
  const searchPattern = `%${cleanQ}%`;
  const tagPattern = `%${cleanQ.replace(/^#/, '')}%`;

  try {
    // 1. Matching users
    const users = await dbAll(`
      SELECT id, username, display_name, avatar, bio
      FROM users
      WHERE (username LIKE ? OR display_name LIKE ?) AND is_active = 1
      LIMIT 8
    `, [searchPattern, searchPattern]);

    // 2. Matching hashtags
    const hashtags = await dbAll(`
      SELECT id, name, usage_count as count
      FROM hashtags
      WHERE name LIKE ?
      ORDER BY usage_count DESC
      LIMIT 8
    `, [tagPattern]);

    // 3. Matching posts (filtering out private communities)
    const rawPosts = await dbAll(`
      SELECT p.*,
             u.username as author_username,
             u.display_name as author_display_name,
             u.avatar as author_avatar
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.content LIKE ?
        AND (p.community_id IS NULL OR p.community_id IN (SELECT id FROM communities WHERE type != 'private'))
      ORDER BY p.created_at DESC
      LIMIT 8
    `, [searchPattern]);

    const posts = rawPosts.map(p => ({
      id: p.id,
      author: {
        id: p.author_id,
        username: p.author_username,
        display_name: p.author_display_name || p.author_username,
        avatar: p.author_avatar || ''
      },
      content: p.content,
      image: p.image || '',
      likes_count: p.likes_count || 0,
      comments_count: p.comments_count || 0,
      coords: { x: p.coord_x, y: p.coord_y, z: p.coord_z },
      created_at: p.created_at
    }));

    res.json({ users, posts, hashtags });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/hashtags/:name/posts/
router.get('/hashtags/:name/posts/', async (req, res) => {
  const tagName = req.params.name.toLowerCase().replace(/^#/, '');
  try {
    const rawPosts = await dbAll(`
      SELECT p.*,
             u.username as author_username,
             u.display_name as author_display_name,
             u.avatar as author_avatar
      FROM posts p
      JOIN users u ON p.author_id = u.id
      JOIN post_hashtags ph ON p.id = ph.post_id
      JOIN hashtags h ON ph.hashtag_id = h.id
      WHERE LOWER(h.name) = ?
        AND (p.community_id IS NULL OR p.community_id IN (SELECT id FROM communities WHERE type != 'private'))
      ORDER BY p.created_at DESC
    `, [tagName]);

    const formatted = rawPosts.map(p => ({
      id: p.id,
      author: {
        id: p.author_id,
        username: p.author_username,
        display_name: p.author_display_name || p.author_username,
        avatar: p.author_avatar || ''
      },
      content: p.content,
      image: p.image || '',
      likes_count: p.likes_count || 0,
      comments_count: p.comments_count || 0,
      coords: { x: p.coord_x, y: p.coord_y, z: p.coord_z },
      created_at: p.created_at
    }));

    res.json({ results: formatted });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
