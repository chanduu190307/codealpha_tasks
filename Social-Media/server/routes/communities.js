import express from 'express';
import { dbGet, dbRun, dbAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/communities/
router.get('/communities/', async (req, res) => {
  const currentUserId = req.user ? req.user.id : null;
  try {
    const rawComms = await dbAll(`
      SELECT c.*, COUNT(cm.user_id) as member_count
      FROM communities c
      LEFT JOIN community_members cm ON c.id = cm.community_id
      GROUP BY c.id
      ORDER BY member_count DESC
    `);

    const formatted = await Promise.all(rawComms.map(async (c) => {
      let userRole = null;
      if (currentUserId) {
        const mem = await dbGet('SELECT role FROM community_members WHERE community_id = ? AND user_id = ?', [c.id, currentUserId]);
        if (mem) userRole = mem.role;
      }

      return {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        type: c.type,
        avatar: c.avatar,
        member_count: c.member_count || 0,
        user_role: userRole
      };
    }));

    res.json({ results: formatted });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/communities/
router.post('/communities/', requireAuth, async (req, res) => {
  const { name, description, type } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ detail: 'Community name is required.' });

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const existing = await dbGet('SELECT id FROM communities WHERE slug = ? OR name = ?', [slug, name.trim()]);
    if (existing) return res.status(400).json({ detail: 'Community with this name already exists.' });

    const result = await dbRun(`
      INSERT INTO communities (name, slug, description, type, creator_id)
      VALUES (?, ?, ?, ?, ?)
    `, [name.trim(), slug, description || '', type || 'public', req.user.id]);

    await dbRun(`INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, 'admin')`, [result.lastID, req.user.id]);

    res.status(201).json({
      success: true,
      detail: 'Community created successfully.',
      community: { id: result.lastID, name: name.trim(), slug }
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/communities/:slug/join-leave/
router.post('/communities/:slug/join-leave/', requireAuth, async (req, res) => {
  const { slug } = req.params;
  try {
    const comm = await dbGet('SELECT id, name, type FROM communities WHERE slug = ?', [slug]);
    if (!comm) return res.status(404).json({ detail: 'Community not found.' });

    const existingMem = await dbGet('SELECT id FROM community_members WHERE community_id = ? AND user_id = ?', [comm.id, req.user.id]);

    if (existingMem) {
      await dbRun('DELETE FROM community_members WHERE community_id = ? AND user_id = ?', [comm.id, req.user.id]);
      return res.json({ status: 'left', community: comm.name });
    } else {
      if (comm.type === 'private') {
        return res.json({ status: 'request_submitted', community: comm.name });
      }
      await dbRun('INSERT INTO community_members (community_id, user_id, role) VALUES (?, ?, ?)', [comm.id, req.user.id, 'member']);
      return res.json({ status: 'joined', community: comm.name });
    }
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/communities/:slug/posts/
router.get('/communities/:slug/posts/', async (req, res) => {
  const { slug } = req.params;
  const currentUserId = req.user ? req.user.id : null;

  try {
    const comm = await dbGet('SELECT * FROM communities WHERE slug = ?', [slug]);
    if (!comm) return res.status(404).json({ detail: 'Community not found.' });

    // Enforce private community access rule
    if (comm.type === 'private') {
      if (!currentUserId) {
        return res.status(403).json({ detail: 'Authentication and approved membership required for private community.' });
      }
      const isMember = await dbGet('SELECT 1 FROM community_members WHERE community_id = ? AND user_id = ?', [comm.id, currentUserId]);
      if (!isMember) {
        return res.status(403).json({ detail: 'This community is private. You must be an approved member to view posts.' });
      }
    }

    const posts = await dbAll(`
      SELECT p.*,
             u.username as author_username,
             u.display_name as author_display_name,
             u.avatar as author_avatar
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.community_id = ?
      ORDER BY p.created_at DESC
    `, [comm.id]);

    const formatted = await Promise.all(posts.map(async (p) => {
      let isLiked = false;
      let isBookmarked = false;
      if (currentUserId) {
        const lk = await dbGet('SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?', [p.id, currentUserId]);
        const bm = await dbGet('SELECT 1 FROM bookmarks WHERE post_id = ? AND user_id = ?', [p.id, currentUserId]);
        isLiked = !!lk;
        isBookmarked = !!bm;
      }
      return {
        id: p.id,
        author: {
          id: p.author_id,
          username: p.author_username,
          display_name: p.author_display_name || p.author_username,
          avatar: p.author_avatar || ''
        },
        content: p.content,
        image: p.image || '',
        community: {
          id: comm.id,
          name: comm.name,
          slug: comm.slug
        },
        likes_count: p.likes_count || 0,
        comments_count: p.comments_count || 0,
        is_liked: isLiked,
        is_bookmarked: isBookmarked,
        is_author: currentUserId === p.author_id,
        coords: { x: p.coord_x, y: p.coord_y, z: p.coord_z },
        created_at: p.created_at
      };
    }));

    res.json({ results: formatted, community: { id: comm.id, name: comm.name, slug: comm.slug, type: comm.type } });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
