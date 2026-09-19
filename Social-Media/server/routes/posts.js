import express from 'express';
import path from 'path';
import fs from 'fs';
import { dbGet, dbRun, dbAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { createSecureUpload, validateUploadedImageFile } from '../middleware/upload.js';

const router = express.Router();

const upload = createSecureUpload('posts');

// Helper to extract hashtags from content
function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#([a-zA-Z0-9_]+)/g);
  if (!matches) return [];
  return [...new Set(matches.map(m => m.substring(1).toLowerCase()))];
}

// Helper to format post with user interaction flags
async function formatPost(post, currentUserId = null) {
  let isLiked = false;
  let isBookmarked = false;
  let isAuthor = false;

  if (currentUserId) {
    const like = await dbGet('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?', [post.id, currentUserId]);
    const bm = await dbGet('SELECT 1 FROM bookmarks WHERE post_id = ? AND user_id = ?', [post.id, currentUserId]);
    isLiked = !!like;
    isBookmarked = !!bm;
    isAuthor = post.author_id === currentUserId;
  }

  // Get hashtags
  const hashtags = await dbAll(`
    SELECT h.name FROM hashtags h
    JOIN post_hashtags ph ON h.id = ph.hashtag_id
    WHERE ph.post_id = ?
  `, [post.id]);

  return {
    id: post.id,
    author: {
      id: post.author_id,
      username: post.author_username,
      display_name: post.author_display_name || post.author_username,
      avatar: post.author_avatar || ''
    },
    content: post.content,
    image: post.image ? (post.image.startsWith('http') ? post.image : `/media/posts/${path.basename(post.image)}`) : null,
    community: post.community_id ? { id: post.community_id, name: post.community_name } : null,
    coords: {
      x: post.coord_x || 0,
      y: post.coord_y || 0,
      z: post.coord_z || 0
    },
    likes_count: post.likes_count || 0,
    comments_count: post.comments_count || 0,
    is_liked: isLiked,
    is_bookmarked: isBookmarked,
    is_author: isAuthor,
    hashtags: hashtags.map(h => h.name),
    created_at: post.created_at,
    updated_at: post.updated_at
  };
}

const POST_BASE_SELECT = `
  SELECT p.*,
         u.username as author_username,
         u.display_name as author_display_name,
         u.avatar as author_avatar,
         c.name as community_name
  FROM posts p
  JOIN users u ON p.author_id = u.id
  LEFT JOIN communities c ON p.community_id = c.id
`;

// GET /api/posts/ (Explore Feed & 3D Spatial Nodes)
router.get('/posts/', async (req, res) => {
  const currentUserId = req.user ? req.user.id : null;
  try {
    const rawPosts = await dbAll(`${POST_BASE_SELECT} ORDER BY p.created_at DESC LIMIT 100`);
    const formatted = await Promise.all(rawPosts.map(p => formatPost(p, currentUserId)));
    res.json({
      count: formatted.length,
      total_pages: 1,
      results: formatted
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/feed/ (Following Feed)
router.get('/feed/', requireAuth, async (req, res) => {
  const currentUserId = req.user.id;
  try {
    const rawPosts = await dbAll(`
      ${POST_BASE_SELECT}
      WHERE p.author_id = ? OR p.author_id IN (
        SELECT following_id FROM follows WHERE follower_id = ?
      )
      ORDER BY p.created_at DESC LIMIT 50
    `, [currentUserId, currentUserId]);

    const formatted = await Promise.all(rawPosts.map(p => formatPost(p, currentUserId)));
    res.json({
      count: formatted.length,
      total_pages: 1,
      results: formatted
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/posts/saved/ (Bookmarked Posts)
router.get('/posts/saved/', requireAuth, async (req, res) => {
  try {
    const rawPosts = await dbAll(`
      ${POST_BASE_SELECT}
      JOIN bookmarks b ON p.id = b.post_id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    const formatted = await Promise.all(rawPosts.map(p => formatPost(p, req.user.id)));
    res.json({
      count: formatted.length,
      total_pages: 1,
      results: formatted
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/users/:username/posts/
router.get('/users/:username/posts/', async (req, res) => {
  const { username } = req.params;
  const currentUserId = req.user ? req.user.id : null;
  try {
    const target = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (!target) return res.status(404).json({ detail: 'User not found' });

    const rawPosts = await dbAll(`${POST_BASE_SELECT} WHERE p.author_id = ? ORDER BY p.created_at DESC`, [target.id]);
    const formatted = await Promise.all(rawPosts.map(p => formatPost(p, currentUserId)));
    res.json({ results: formatted });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/hashtags/:name/posts/
router.get('/hashtags/:name/posts/', async (req, res) => {
  const { name } = req.params;
  const currentUserId = req.user ? req.user.id : null;
  try {
    const rawPosts = await dbAll(`
      ${POST_BASE_SELECT}
      JOIN post_hashtags ph ON p.id = ph.post_id
      JOIN hashtags h ON ph.hashtag_id = h.id
      WHERE h.name = ?
      ORDER BY p.created_at DESC
    `, [name.toLowerCase()]);

    const formatted = await Promise.all(rawPosts.map(p => formatPost(p, currentUserId)));
    res.json({ results: formatted });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/posts/ (Create Post with 3D Spatial Vector & Hashtags)
router.post('/posts/', requireAuth, upload.single('image'), validateUploadedImageFile, async (req, res) => {
  const { content, community_id } = req.body;
  const imageFile = req.file;

  if ((!content || !content.trim()) && !imageFile) {
    return res.status(400).json({
      success: false,
      errors: { content: ['Content or image is required.'] }
    });
  }

  // Generate pleasant 3D spherical constellation coordinate
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(Math.random()) * 25 + 5; // Radius between 5 and 30 units
  const coordX = parseFloat((r * Math.sin(phi) * Math.cos(theta)).toFixed(2));
  const coordY = parseFloat((r * Math.sin(phi) * Math.sin(theta)).toFixed(2));
  const coordZ = parseFloat((r * Math.cos(phi)).toFixed(2));

  const imagePath = imageFile ? `/media/posts/${imageFile.filename}` : '';

  try {
    const result = await dbRun(`
      INSERT INTO posts (author_id, content, image, community_id, coord_x, coord_y, coord_z)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, content || '', imagePath, community_id || null, coordX, coordY, coordZ]);

    const postId = result.lastID;

    // Attach extracted hashtags
    const tagList = extractHashtags(content);
    for (const tag of tagList) {
      await dbRun(`INSERT OR IGNORE INTO hashtags (name, usage_count) VALUES (?, 0)`, [tag]);
      await dbRun(`UPDATE hashtags SET usage_count = usage_count + 1 WHERE name = ?`, [tag]);
      const tagRow = await dbGet(`SELECT id FROM hashtags WHERE name = ?`, [tag]);
      if (tagRow) {
        await dbRun(`INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)`, [postId, tagRow.id]);
      }
    }

    const created = await dbGet(`${POST_BASE_SELECT} WHERE p.id = ?`, [postId]);
    const formatted = await formatPost(created, req.user.id);

    res.status(201).json({
      success: true,
      detail: 'Post created successfully.',
      post: formatted
    });
  } catch (err) {
    res.status(500).json({ success: false, detail: err.message });
  }
});

// GET /api/posts/:id/
router.get('/posts/:id/', async (req, res) => {
  const currentUserId = req.user ? req.user.id : null;
  try {
    const post = await dbGet(`${POST_BASE_SELECT} WHERE p.id = ?`, [req.params.id]);
    if (!post) return res.status(404).json({ detail: 'Post not found.' });

    const formatted = await formatPost(post, currentUserId);
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PATCH /api/posts/:id/
router.patch('/posts/:id/', requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ detail: 'Post content cannot be empty.' });
  }
  try {
    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post) return res.status(404).json({ detail: 'Post not found.' });
    if (post.author_id !== req.user.id) {
      return res.status(403).json({ detail: 'You do not have permission to perform this action.' });
    }

    await dbRun('UPDATE posts SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [content, post.id]);

    const updated = await dbGet(`${POST_BASE_SELECT} WHERE p.id = ?`, [post.id]);
    const formatted = await formatPost(updated, req.user.id);

    res.json({
      success: true,
      detail: 'Post updated successfully.',
      post: formatted
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// DELETE /api/posts/:id/
router.delete('/posts/:id/', requireAuth, async (req, res) => {
  try {
    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post) return res.status(404).json({ detail: 'Post not found.' });
    if (post.author_id !== req.user.id) {
      return res.status(403).json({ detail: 'You do not have permission to perform this action.' });
    }

    await dbRun('DELETE FROM posts WHERE id = ?', [post.id]);
    res.json({ success: true, detail: 'Post deleted successfully.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/posts/:id/like/
router.post('/posts/:id/like/', requireAuth, async (req, res) => {
  const postId = req.params.id;
  try {
    await dbRun('INSERT OR IGNORE INTO likes (post_id, user_id) VALUES (?, ?)', [postId, req.user.id]);
    const countRes = await dbGet('SELECT COUNT(*) as c FROM likes WHERE post_id = ?', [postId]);
    await dbRun('UPDATE posts SET likes_count = ? WHERE id = ?', [countRes.c, postId]);

    res.json({
      success: true,
      is_liked: true,
      likes_count: countRes.c
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/posts/:id/unlike/
router.post('/posts/:id/unlike/', requireAuth, async (req, res) => {
  const postId = req.params.id;
  try {
    await dbRun('DELETE FROM likes WHERE post_id = ? AND user_id = ?', [postId, req.user.id]);
    const countRes = await dbGet('SELECT COUNT(*) as c FROM likes WHERE post_id = ?', [postId]);
    await dbRun('UPDATE posts SET likes_count = ? WHERE id = ?', [countRes.c, postId]);

    res.json({
      success: true,
      is_liked: false,
      likes_count: countRes.c
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/posts/:id/bookmark/
router.post('/posts/:id/bookmark/', requireAuth, async (req, res) => {
  const postId = req.params.id;
  try {
    await dbRun('INSERT OR IGNORE INTO bookmarks (post_id, user_id) VALUES (?, ?)', [postId, req.user.id]);
    res.json({ status: 'bookmarked', post_id: parseInt(postId) });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/posts/:id/unbookmark/
router.post('/posts/:id/unbookmark/', requireAuth, async (req, res) => {
  const postId = req.params.id;
  try {
    await dbRun('DELETE FROM bookmarks WHERE post_id = ? AND user_id = ?', [postId, req.user.id]);
    res.json({ status: 'unbookmarked', post_id: parseInt(postId) });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
