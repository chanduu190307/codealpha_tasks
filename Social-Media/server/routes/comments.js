import express from 'express';
import { dbGet, dbRun, dbAll } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/posts/:postId/comments/
router.get('/posts/:postId/comments/', async (req, res) => {
  const { postId } = req.params;
  const currentUserId = req.user ? req.user.id : null;
  try {
    const rawComments = await dbAll(`
      SELECT c.*,
             u.username as author_username,
             u.display_name as author_display_name,
             u.avatar as author_avatar
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, [postId]);

    const formatted = rawComments.map(c => ({
      id: c.id,
      post: c.post_id,
      author: {
        id: c.author_id,
        username: c.author_username,
        display_name: c.author_display_name || c.author_username,
        avatar: c.author_avatar || ''
      },
      content: c.content,
      is_author: currentUserId ? c.author_id === currentUserId : false,
      created_at: c.created_at,
      updated_at: c.updated_at
    }));

    res.json({ results: formatted });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/posts/:postId/comments/
router.post('/posts/:postId/comments/', requireAuth, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ detail: 'Comment content cannot be empty.' });
  }

  try {
    const post = await dbGet('SELECT * FROM posts WHERE id = ?', [postId]);
    if (!post) return res.status(404).json({ detail: 'Post not found.' });

    const result = await dbRun(
      'INSERT INTO comments (post_id, author_id, content) VALUES (?, ?, ?)',
      [postId, req.user.id, content.trim()]
    );

    // Update post comments count
    const countRes = await dbGet('SELECT COUNT(*) as c FROM comments WHERE post_id = ?', [postId]);
    await dbRun('UPDATE posts SET comments_count = ? WHERE id = ?', [countRes.c, postId]);

    // Dispatch notification to post author if not self
    if (post.author_id !== req.user.id) {
      await dbRun(`
        INSERT INTO notifications (recipient_id, actor_id, verb, target_id, target_type)
        VALUES (?, ?, ?, ?, ?)
      `, [post.author_id, req.user.id, 'commented on your 3D spatial post', postId, 'post']);
    }

    const created = await dbGet(`
      SELECT c.*,
             u.username as author_username,
             u.display_name as author_display_name,
             u.avatar as author_avatar
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.id = ?
    `, [result.lastID]);

    res.status(201).json({
      success: true,
      detail: 'Comment added successfully.',
      comment: {
        id: created.id,
        post: created.post_id,
        author: {
          id: created.author_id,
          username: created.author_username,
          display_name: created.author_display_name || created.author_username,
          avatar: created.author_avatar || ''
        },
        content: created.content,
        is_author: true,
        created_at: created.created_at,
        updated_at: created.updated_at
      }
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// PATCH /api/comments/:id/
router.patch('/comments/:id/', requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ detail: 'Comment content cannot be empty.' });
  }

  try {
    const comment = await dbGet('SELECT * FROM comments WHERE id = ?', [req.params.id]);
    if (!comment) return res.status(404).json({ detail: 'Comment not found.' });
    if (comment.author_id !== req.user.id) {
      return res.status(403).json({ detail: 'Permission denied.' });
    }

    await dbRun('UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [content.trim(), comment.id]);

    const updated = await dbGet('SELECT * FROM comments WHERE id = ?', [comment.id]);
    res.json({
      success: true,
      comment: {
        id: updated.id,
        content: updated.content,
        updated_at: updated.updated_at
      }
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// DELETE /api/comments/:id/
router.delete('/comments/:id/', requireAuth, async (req, res) => {
  try {
    const comment = await dbGet('SELECT * FROM comments WHERE id = ?', [req.params.id]);
    if (!comment) return res.status(404).json({ detail: 'Comment not found.' });

    const post = await dbGet('SELECT author_id FROM posts WHERE id = ?', [comment.post_id]);
    const isCommentAuthor = comment.author_id === req.user.id;
    const isPostAuthor = post && post.author_id === req.user.id;

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ detail: 'Permission denied. You can only delete your own comments or comments on your post.' });
    }

    await dbRun('DELETE FROM comments WHERE id = ?', [comment.id]);

    const countRes = await dbGet('SELECT COUNT(*) as c FROM comments WHERE post_id = ?', [comment.post_id]);
    await dbRun('UPDATE posts SET comments_count = ? WHERE id = ?', [countRes.c, comment.post_id]);

    res.json({ success: true, detail: 'Comment deleted successfully.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
