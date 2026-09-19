import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbGet, dbRun, dbAll } from '../db.js';
import { JWT_SECRET, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/auth/csrf/
router.get('/csrf/', (req, res) => {
  const token = 'csrf-' + Math.random().toString(36).substring(2) + Date.now();
  res.cookie('csrftoken', token, { path: '/', httpOnly: false, sameSite: 'lax' });
  res.json({ success: true, csrfToken: token, detail: 'CSRF cookie set' });
});

// POST /api/auth/register/
router.post('/register/', async (req, res) => {
  const { username, email, password, password_confirm } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      errors: { detail: 'Username, email and password are required.' }
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      errors: { password: ['Password must be at least 8 characters long.'] }
    });
  }

  if (password_confirm && password !== password_confirm) {
    return res.status(400).json({
      success: false,
      errors: { password: ['Passwords do not match.'] }
    });
  }

  try {
    const existingUser = await dbGet('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: { detail: 'Username or email already exists.' }
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await dbRun(
      'INSERT INTO users (username, email, password_hash, display_name) VALUES (?, ?, ?, ?)',
      [username.trim(), email.trim().toLowerCase(), hash, username.trim()]
    );

    const user = await dbGet(
      'SELECT id, username, email, display_name, bio, avatar FROM users WHERE id = ?',
      [result.lastID]
    );

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '14d' });
    res.cookie('pulse_token', token, { path: '/', httpOnly: true, maxAge: 14 * 24 * 3600 * 1000, sameSite: 'lax' });

    res.status(201).json({
      success: true,
      detail: 'Registered successfully.',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ success: false, detail: err.message });
  }
});

// POST /api/auth/login/
router.post('/login/', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      errors: { detail: 'Username and password are required.' }
    });
  }

  try {
    const user = await dbGet(
      'SELECT id, username, email, password_hash, display_name, bio, avatar, is_active FROM users WHERE (username = ? OR email = ?)',
      [username.trim(), username.trim().toLowerCase()]
    );

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        errors: { detail: 'Invalid username/email or password.' }
      });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({
        success: false,
        errors: { detail: 'Invalid username/email or password.' }
      });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '14d' });
    res.cookie('pulse_token', token, { path: '/', httpOnly: true, maxAge: 14 * 24 * 3600 * 1000, sameSite: 'lax' });

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      display_name: user.display_name,
      bio: user.bio,
      avatar: user.avatar
    };

    res.json({
      success: true,
      detail: 'Logged in successfully.',
      token,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ success: false, detail: err.message });
  }
});

// POST /api/auth/logout/
router.post('/logout/', (req, res) => {
  res.clearCookie('pulse_token');
  res.json({ success: true, detail: 'Logged out successfully.' });
});

// GET /api/auth/me/
router.get('/me/', (req, res) => {
  if (req.user) {
    res.json({
      authenticated: true,
      user: req.user
    });
  } else {
    res.json({
      authenticated: false,
      user: null
    });
  }
});

// PATCH /api/profiles/me/
router.patch('/profiles/me/', requireAuth, async (req, res) => {
  const { display_name, bio, avatar } = req.body;
  try {
    await dbRun(
      'UPDATE users SET display_name = COALESCE(?, display_name), bio = COALESCE(?, bio), avatar = COALESCE(?, avatar) WHERE id = ?',
      [display_name, bio, avatar, req.user.id]
    );

    const updated = await dbGet(
      'SELECT id, username, email, display_name, bio, avatar FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({
      success: true,
      detail: 'Profile updated successfully.',
      user: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, detail: err.message });
  }
});

// GET /api/profiles/:username/
router.get('/profiles/:username/', async (req, res) => {
  const { username } = req.params;
  try {
    const user = await dbGet(
      'SELECT id, username, display_name, bio, avatar, created_at as date_joined FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(404).json({ success: false, detail: 'User not found.' });
    }

    const postsCount = await dbGet('SELECT COUNT(*) as c FROM posts WHERE author_id = ?', [user.id]);
    const followersCount = await dbGet('SELECT COUNT(*) as c FROM follows WHERE following_id = ?', [user.id]);
    const followingCount = await dbGet('SELECT COUNT(*) as c FROM follows WHERE follower_id = ?', [user.id]);

    let isFollowing = false;
    if (req.user) {
      const follow = await dbGet('SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?', [req.user.id, user.id]);
      isFollowing = !!follow;
    }

    res.json({
      id: user.id,
      username: user.username,
      display_name: user.display_name,
      bio: user.bio,
      avatar: user.avatar,
      date_joined: user.date_joined,
      posts_count: postsCount.c,
      followers_count: followersCount.c,
      following_count: followingCount.c,
      is_self: req.user ? req.user.id === user.id : false,
      is_following: isFollowing
    });
  } catch (err) {
    res.status(500).json({ success: false, detail: err.message });
  }
});

// POST /api/users/:username/follow/
router.post('/users/:username/follow/', requireAuth, async (req, res) => {
  const { username } = req.params;
  try {
    const target = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (!target) return res.status(404).json({ detail: 'User not found' });
    if (target.id === req.user.id) return res.status(400).json({ detail: 'Cannot follow yourself' });

    await dbRun('INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)', [req.user.id, target.id]);
    const count = await dbGet('SELECT COUNT(*) as c FROM follows WHERE following_id = ?', [target.id]);

    res.json({
      success: true,
      detail: `You are now following @${username}`,
      is_following: true,
      followers_count: count.c
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/users/:username/unfollow/
router.post('/users/:username/unfollow/', requireAuth, async (req, res) => {
  const { username } = req.params;
  try {
    const target = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (!target) return res.status(404).json({ detail: 'User not found' });

    await dbRun('DELETE FROM follows WHERE follower_id = ? AND following_id = ?', [req.user.id, target.id]);
    const count = await dbGet('SELECT COUNT(*) as c FROM follows WHERE following_id = ?', [target.id]);

    res.json({
      success: true,
      detail: `Unfollowed @${username}`,
      is_following: false,
      followers_count: count.c
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/users/:username/followers/
router.get('/users/:username/followers/', async (req, res) => {
  const { username } = req.params;
  try {
    const target = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (!target) return res.status(404).json({ detail: 'User not found' });

    const followers = await dbAll(`
      SELECT u.id, u.username, u.display_name, u.avatar
      FROM follows f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
    `, [target.id]);

    res.json({ results: followers });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/users/:username/following/
router.get('/users/:username/following/', async (req, res) => {
  const { username } = req.params;
  try {
    const target = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (!target) return res.status(404).json({ detail: 'User not found' });

    const following = await dbAll(`
      SELECT u.id, u.username, u.display_name, u.avatar
      FROM follows f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ?
    `, [target.id]);

    res.json({ results: following });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/users/export-data/
router.get('/users/export-data/', requireAuth, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, username, email, display_name, bio, created_at FROM users WHERE id = ?', [req.user.id]);
    const posts = await dbAll('SELECT id, content, created_at, likes_count, comments_count FROM posts WHERE author_id = ?', [req.user.id]);
    const comments = await dbAll('SELECT id, post_id, content, created_at FROM comments WHERE author_id = ?', [req.user.id]);

    res.json({
      export_version: '2.0.0-node-3d',
      timestamp: new Date().toISOString(),
      user,
      posts,
      comments
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/users/delete-account/
router.post('/users/delete-account/', requireAuth, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await dbGet('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(password || '', user.password_hash);
    if (!match) {
      return res.status(400).json({ detail: 'Incorrect password.' });
    }

    await dbRun('DELETE FROM users WHERE id = ?', [req.user.id]);
    res.clearCookie('pulse_token');
    res.json({ success: true, detail: 'Account deleted successfully.' });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/auth/change-password/
router.post('/change-password/', requireAuth, async (req, res) => {
  const current_password = req.body.current_password;
  const new_password = req.body.new_password;
  const new_password_confirm = req.body.new_password_confirm || req.body.confirm_password;

  if (!current_password || !new_password || !new_password_confirm) {
    return res.status(400).json({
      success: false,
      detail: 'Current password, new password, and confirmation are required.'
    });
  }

  if (new_password.length < 8) {
    return res.status(400).json({
      success: false,
      detail: 'New password must be at least 8 characters long.'
    });
  }

  if (new_password !== new_password_confirm) {
    return res.status(400).json({
      success: false,
      detail: 'New passwords do not match.'
    });
  }

  try {
    const user = await dbGet('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);
    const match = await bcrypt.compare(current_password, user.password_hash);
    if (!match) {
      return res.status(400).json({
        success: false,
        detail: 'Current password is incorrect.'
      });
    }

    const newHash = await bcrypt.hash(new_password, 10);
    await dbRun('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);

    // Issue a new token to rotate session credentials
    const token = jwt.sign({ userId: req.user.id, username: req.user.username }, JWT_SECRET, { expiresIn: '14d' });
    res.cookie('pulse_token', token, { path: '/', httpOnly: true, maxAge: 14 * 24 * 3600 * 1000, sameSite: 'lax' });

    res.json({
      success: true,
      token,
      detail: 'Password changed successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, detail: err.message });
  }
});

// POST /api/users/:username/block/
router.post('/users/:username/block/', requireAuth, async (req, res) => {
  const { username } = req.params;
  try {
    const target = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (!target) return res.status(404).json({ detail: 'User not found.' });
    if (target.id === req.user.id) return res.status(400).json({ detail: 'Cannot block yourself.' });

    // Remove any mutual follow relationships
    await dbRun('DELETE FROM follows WHERE (follower_id = ? AND following_id = ?) OR (follower_id = ? AND following_id = ?)',
      [req.user.id, target.id, target.id, req.user.id]
    );

    await dbRun('INSERT OR IGNORE INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)', [req.user.id, target.id]);

    res.json({
      success: true,
      is_blocked: true,
      detail: `You have blocked @${username}.`
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/users/:username/unblock/
router.post('/users/:username/unblock/', requireAuth, async (req, res) => {
  const { username } = req.params;
  try {
    const target = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (!target) return res.status(404).json({ detail: 'User not found.' });

    await dbRun('DELETE FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?', [req.user.id, target.id]);

    res.json({
      success: true,
      is_blocked: false,
      detail: `You have unblocked @${username}.`
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// GET /api/users/blocked/
router.get('/users/blocked/', requireAuth, async (req, res) => {
  try {
    const blockedUsers = await dbAll(`
      SELECT u.id, u.username, u.display_name, u.avatar, ub.created_at as blocked_at
      FROM user_blocks ub
      JOIN users u ON ub.blocked_id = u.id
      WHERE ub.blocker_id = ?
      ORDER BY ub.created_at DESC
    `, [req.user.id]);

    res.json({ results: blockedUsers });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

// POST /api/reports/
router.post('/reports/', requireAuth, async (req, res) => {
  const { target_type, target_id, reason, details } = req.body;

  if (!target_type || !target_id || !reason) {
    return res.status(400).json({ detail: 'target_type, target_id, and reason are required.' });
  }

  try {
    const result = await dbRun(`
      INSERT INTO reports (reporter_id, target_type, target_id, reason, details, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `, [req.user.id, target_type, target_id, reason, details || '']);

    res.status(201).json({
      success: true,
      report_id: result.lastID,
      detail: 'Report submitted for review.'
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

export default router;
