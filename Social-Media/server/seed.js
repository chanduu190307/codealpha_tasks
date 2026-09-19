import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import { USERS, COMMUNITIES, POSTS, COMMENTS, LIKES, FOLLOWS } from './seeds/seed_data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Safety Check: Refuse destructive operations in production environment
if (process.env.NODE_ENV === 'production' || process.env.PULSE_ENV === 'production') {
  console.error('⛔ [CRITICAL SAFETY GUARD] Refusing to seed database in production environment!');
  console.error('Seeding is strictly permitted in development/test/demo mode only.');
  process.exit(1);
}

const NODE_DB_PATH = path.join(rootDir, 'pulse_3d.sqlite');
const DJANGO_DB_PATH = path.join(rootDir, 'backend', 'db.sqlite3');

console.log('================================================================');
console.log('⚡ PULSE SOCIAL MEDIA PLATFORM — AUTHORITATIVE SEED ENGINE');
console.log('================================================================');
console.log(`Target Node.js SQLite: ${NODE_DB_PATH}`);
console.log(`Target Django SQLite:  ${DJANGO_DB_PATH}`);
console.log('----------------------------------------------------------------');

// Helper for Promisified SQLite queries
function openDb(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) reject(err);
      else resolve(db);
    });
  });
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

// Consistent demo password hashes for "PulseDemo2026!"
const DEMO_PASSWORD_PLAIN = 'PulseDemo2026!';
const NODE_BCRYPT_HASH = bcrypt.hashSync(DEMO_PASSWORD_PLAIN, 10);
const DJANGO_PBKDF2_HASH = 'pbkdf2_sha256$1000000$qai8daT9mVTu0rItabWMeP$t/cakJnu+f/iLfUwrSOdb/ezYHzoL4nndmaQ/kkWa20=';

// Extract hashtags helper
function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#([a-zA-Z0-9_]+)/g);
  if (!matches) return [];
  return [...new Set(matches.map(m => m.substring(1).toLowerCase()))];
}

async function seedNodeDatabase() {
  console.log('\n[1/2] 🌌 Seeding Node.js Express 3D Database (pulse_3d.sqlite)...');
  const db = await openDb(NODE_DB_PATH);

  // Initialize tables schema if not already present
  const { initDatabase } = await import('./db.js');
  await initDatabase();

  await run(db, 'PRAGMA foreign_keys = OFF');

  const tablesToClear = [
    'notifications',
    'messages',
    'conversation_members',
    'conversations',
    'story_views',
    'stories',
    'bookmarks',
    'likes',
    'comments',
    'post_hashtags',
    'hashtags',
    'posts',
    'community_members',
    'communities',
    'follows',
    'creator_drafts',
    'creator_scheduled',
    'user_blocks',
    'reports',
    'verification_requests',
    'users'
  ];

  for (const table of tablesToClear) {
    await run(db, `DELETE FROM ${table}`);
    await run(db, `DELETE FROM sqlite_sequence WHERE name='${table}'`).catch(() => {});
  }
  console.log('   ↳ Reset demo tables cleanly.');

  // 1. Insert Users
  await run(db, 'BEGIN TRANSACTION');
  const userInsertStmt = `
    INSERT INTO users (id, username, email, password_hash, display_name, bio, avatar, is_active, is_private, who_can_message, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 'everyone', ?)
  `;
  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i];
    const userId = i + 1;
    const createdAt = new Date(Date.now() - 35 * 86400000 + i * 3600000).toISOString().replace('T', ' ').substring(0, 19);
    await run(db, userInsertStmt, [
      userId,
      u.username,
      `${u.username}@pulse.test`,
      NODE_BCRYPT_HASH,
      u.display_name,
      u.bio,
      u.avatar,
      createdAt
    ]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${USERS.length} users.`);

  // 2. Insert Communities
  await run(db, 'BEGIN TRANSACTION');
  const commInsertStmt = `
    INSERT INTO communities (id, name, slug, description, type, avatar, creator_id, created_at)
    VALUES (?, ?, ?, ?, 'public', ?, ?, ?)
  `;
  for (const c of COMMUNITIES) {
    const commCreatedAt = new Date(Date.now() - 34 * 86400000).toISOString().replace('T', ' ').substring(0, 19);
    await run(db, commInsertStmt, [
      c.id,
      c.name,
      c.slug,
      c.description,
      c.avatar,
      c.creator_id,
      commCreatedAt
    ]);

    // Add creator as owner member
    await run(db, `INSERT INTO community_members (community_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)`, [
      c.id,
      c.creator_id,
      commCreatedAt
    ]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${COMMUNITIES.length} communities.`);

  // 3. Insert Posts
  await run(db, 'BEGIN TRANSACTION');
  const postInsertStmt = `
    INSERT INTO posts (id, author_id, content, image, community_id, coord_x, coord_y, coord_z, likes_count, comments_count, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  for (const p of POSTS) {
    await run(db, postInsertStmt, [
      p.id,
      p.author_id,
      p.content,
      p.image || '',
      p.community_id || null,
      p.coord_x || 0,
      p.coord_y || 0,
      p.coord_z || 0,
      p.likes_count || 0,
      p.comments_count || 0,
      p.created_at,
      p.created_at
    ]);

    // Process hashtags
    const tags = extractHashtags(p.content);
    for (const tag of tags) {
      let hashtag = await get(db, 'SELECT id FROM hashtags WHERE name = ?', [tag]);
      let tagId;
      if (!hashtag) {
        const res = await run(db, 'INSERT INTO hashtags (name, usage_count) VALUES (?, 1)', [tag]);
        tagId = res.lastID;
      } else {
        tagId = hashtag.id;
        await run(db, 'UPDATE hashtags SET usage_count = usage_count + 1 WHERE id = ?', [tagId]);
      }
      await run(db, 'INSERT OR IGNORE INTO post_hashtags (post_id, hashtag_id) VALUES (?, ?)', [p.id, tagId]);
    }
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${POSTS.length} posts with 3D spatial coordinates & hashtags.`);

  // 4. Insert Comments
  await run(db, 'BEGIN TRANSACTION');
  const commentInsertStmt = `
    INSERT INTO comments (id, post_id, author_id, content, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  for (const cm of COMMENTS) {
    await run(db, commentInsertStmt, [
      cm.id,
      cm.post_id,
      cm.author_id,
      cm.content,
      cm.created_at,
      cm.created_at
    ]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${COMMENTS.length} context-aware comments.`);

  // 5. Insert Likes
  await run(db, 'BEGIN TRANSACTION');
  const likeInsertStmt = `
    INSERT INTO likes (post_id, user_id, created_at)
    VALUES (?, ?, ?)
  `;
  for (const l of LIKES) {
    await run(db, likeInsertStmt, [l.post_id, l.user_id, l.created_at]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${LIKES.length} unique likes.`);

  // 6. Insert Follows
  await run(db, 'BEGIN TRANSACTION');
  const followInsertStmt = `
    INSERT INTO follows (follower_id, following_id, created_at)
    VALUES (?, ?, ?)
  `;
  for (const f of FOLLOWS) {
    await run(db, followInsertStmt, [f.follower_id, f.following_id, f.created_at]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${FOLLOWS.length} social follow relationships.`);

  // 7. Synchronize denormalized counters
  await run(db, `
    UPDATE posts
    SET likes_count = (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id),
        comments_count = (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id)
  `);
  console.log('   ↳ Synchronized denormalized likes_count & comments_count.');

  // 8. Insert Demo Active Stories & Notifications
  await run(db, 'BEGIN TRANSACTION');
  const storyUsers = [2, 3, 6, 7, 9, 11, 13];
  const storyMedia = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
  ];
  for (let s = 0; s < storyUsers.length; s++) {
    const expiresAt = new Date(Date.now() + 20 * 3600000).toISOString().replace('T', ' ').substring(0, 19);
    await run(db, `INSERT INTO stories (author_id, media, caption, expires_at) VALUES (?, ?, ?, ?)`, [
      storyUsers[s],
      storyMedia[s],
      'Live from the workshop! ⚡ #Pulse3D',
      expiresAt
    ]);
  }

  // Demo notifications for primary demo user (id 1)
  const notifUsers = [2, 3, 6, 7, 9, 11];
  for (const nu of notifUsers) {
    await run(db, `INSERT INTO notifications (recipient_id, actor_id, verb, target_id, target_type, is_read, created_at) VALUES (?, ?, 'liked your post', 1, 'post', 0, ?)`, [
      1,
      nu,
      new Date(Date.now() - nu * 3600000).toISOString().replace('T', ' ').substring(0, 19)
    ]);
  }
  await run(db, 'COMMIT');
  console.log('   ↳ Inserted demo stories & notifications for Alex Vance (demo_user).');

  await run(db, 'PRAGMA foreign_keys = ON');
  db.close();
  console.log('✨ [Node.js SQLite Seeding Complete]');
}

async function seedDjangoDatabase() {
  if (!fs.existsSync(DJANGO_DB_PATH)) {
    console.log('\n[2/2] ⚠️  Django SQLite file not found at backend/db.sqlite3, skipping Django seed.');
    return;
  }

  console.log('\n[2/2] 🐍 Seeding Python Django Database (backend/db.sqlite3)...');
  const db = await openDb(DJANGO_DB_PATH);

  await run(db, 'PRAGMA foreign_keys = OFF');

  // Clear demo data in Django tables
  const djangoTablesToClear = [
    'notifications_notification',
    'chat_message',
    'chat_conversationmember',
    'chat_conversation',
    'interactions_bookmark',
    'interactions_like',
    'comments_comment',
    'discovery_hashtag_posts',
    'discovery_hashtag',
    'stories_story',
    'posts_post',
    'communities_communitymember',
    'communities_community',
    'interactions_follow',
    'accounts_userprivacysettings',
    'accounts_profile',
    'auth_user'
  ];

  for (const table of djangoTablesToClear) {
    await run(db, `DELETE FROM ${table}`).catch(() => {});
    await run(db, `DELETE FROM sqlite_sequence WHERE name='${table}'`).catch(() => {});
  }
  console.log('   ↳ Reset Django demo tables cleanly.');

  // 1. Insert Users into auth_user, accounts_profile, and accounts_userprivacysettings
  await run(db, 'BEGIN TRANSACTION');
  const authUserStmt = `
    INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined)
    VALUES (?, ?, NULL, ?, ?, ?, ?, ?, 1, 1, ?)
  `;
  const profileStmt = `
    INSERT INTO accounts_profile (id, display_name, bio, avatar, created_at, updated_at, user_id, is_verified, verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const privacyStmt = `
    INSERT INTO accounts_userprivacysettings (id, is_private, who_can_message, who_can_mention, who_can_tag, show_online_status, show_last_seen, created_at, updated_at, user_id)
    VALUES (?, 0, 'everyone', 'everyone', 'everyone', 1, 1, ?, ?, ?)
  `;

  for (let i = 0; i < USERS.length; i++) {
    const u = USERS[i];
    const userId = i + 1;
    const nameParts = u.display_name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const createdAt = new Date(Date.now() - 35 * 86400000 + i * 3600000).toISOString().replace('T', ' ').substring(0, 19);
    const isSuperuser = (userId === 1) ? 1 : 0;

    await run(db, authUserStmt, [
      userId,
      DJANGO_PBKDF2_HASH,
      isSuperuser,
      u.username,
      firstName,
      lastName,
      `${u.username}@pulse.test`,
      createdAt
    ]);

    await run(db, profileStmt, [
      userId,
      u.display_name,
      u.bio,
      u.avatar,
      createdAt,
      createdAt,
      userId,
      u.is_verified,
      u.is_verified ? createdAt : null
    ]);

    await run(db, privacyStmt, [
      userId,
      createdAt,
      createdAt,
      userId
    ]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${USERS.length} users with Django profiles & privacy settings.`);

  // 2. Insert Communities into communities_community
  await run(db, 'BEGIN TRANSACTION');
  const djangoCommStmt = `
    INSERT INTO communities_community (id, name, slug, description, type, avatar, banner, rules, created_at, created_by_id)
    VALUES (?, ?, ?, ?, 'public', ?, '', '', ?, ?)
  `;
  const djangoMemberStmt = `
    INSERT INTO communities_communitymember (id, role, joined_at, community_id, user_id)
    VALUES (?, 'owner', ?, ?, ?)
  `;

  let memberIdCounter = 1;
  for (const c of COMMUNITIES) {
    const commCreatedAt = new Date(Date.now() - 34 * 86400000).toISOString().replace('T', ' ').substring(0, 19);
    await run(db, djangoCommStmt, [
      c.id,
      c.name,
      c.slug,
      c.description,
      c.avatar,
      commCreatedAt,
      c.creator_id
    ]);

    await run(db, djangoMemberStmt, [
      memberIdCounter++,
      commCreatedAt,
      c.id,
      c.creator_id
    ]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${COMMUNITIES.length} communities into Django.`);

  // 3. Insert Posts into posts_post
  await run(db, 'BEGIN TRANSACTION');
  const djangoPostStmt = `
    INSERT INTO posts_post (id, content, image, content_warning, created_at, updated_at, author_id, community_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  for (const p of POSTS) {
    await run(db, djangoPostStmt, [
      p.id,
      p.content,
      p.image || '',
      p.content_warning || 'none',
      p.created_at,
      p.created_at,
      p.author_id,
      p.community_id || null
    ]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${POSTS.length} posts into Django.`);

  // 4. Insert Comments into comments_comment
  await run(db, 'BEGIN TRANSACTION');
  const djangoCommentStmt = `
    INSERT INTO comments_comment (id, content, created_at, updated_at, author_id, post_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  for (const cm of COMMENTS) {
    await run(db, djangoCommentStmt, [
      cm.id,
      cm.content,
      cm.created_at,
      cm.created_at,
      cm.author_id,
      cm.post_id
    ]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${COMMENTS.length} comments into Django.`);

  // 5. Insert Likes into interactions_like
  await run(db, 'BEGIN TRANSACTION');
  const djangoLikeStmt = `
    INSERT INTO interactions_like (id, post_id, user_id, created_at)
    VALUES (?, ?, ?, ?)
  `;
  let likeId = 1;
  for (const l of LIKES) {
    await run(db, djangoLikeStmt, [likeId++, l.post_id, l.user_id, l.created_at]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${LIKES.length} likes into Django.`);

  // 6. Insert Follows into interactions_follow
  await run(db, 'BEGIN TRANSACTION');
  const djangoFollowStmt = `
    INSERT INTO interactions_follow (id, follower_id, following_id, created_at)
    VALUES (?, ?, ?, ?)
  `;
  let followId = 1;
  for (const f of FOLLOWS) {
    await run(db, djangoFollowStmt, [followId++, f.follower_id, f.following_id, f.created_at]);
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${FOLLOWS.length} follow relationships into Django.`);

  // 7. Insert Hashtags into discovery_hashtag and discovery_hashtag_posts
  await run(db, 'BEGIN TRANSACTION');
  let dTagId = 1;
  let dPostTagId = 1;
  const tagMap = new Map();
  for (const p of POSTS) {
    const tags = p.content.match(/#([a-zA-Z0-9_]+)/g) || [];
    for (const tagWithHash of tags) {
      const tag = tagWithHash.substring(1).toLowerCase();
      let tid = tagMap.get(tag);
      if (!tid) {
        tid = dTagId++;
        tagMap.set(tag, tid);
        await run(db, 'INSERT INTO discovery_hashtag (id, name, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)', [tid, tag]);
      }
      await run(db, 'INSERT OR IGNORE INTO discovery_hashtag_posts (id, hashtag_id, post_id) VALUES (?, ?, ?)', [dPostTagId++, tid, p.id]);
    }
  }
  await run(db, 'COMMIT');
  console.log(`   ↳ Inserted ${tagMap.size} hashtags and associations into Django.`);

  // 8. Insert Stories into stories_story
  await run(db, 'BEGIN TRANSACTION');
  const dStoryUsers = [2, 3, 6, 7, 9, 11, 13];
  const dStoryMedia = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
  ];
  for (let s = 0; s < dStoryUsers.length; s++) {
    const expiresAt = new Date(Date.now() + 20 * 3600000).toISOString().replace('T', ' ').substring(0, 19);
    const createdAt = new Date(Date.now() - 4 * 3600000).toISOString().replace('T', ' ').substring(0, 19);
    await run(db, `INSERT INTO stories_story (id, author_id, media, caption, audience, created_at, expires_at, is_deleted) VALUES (?, ?, ?, ?, 'everyone', ?, ?, 0)`, [
      s + 1,
      dStoryUsers[s],
      dStoryMedia[s],
      'Live from the workshop! ⚡ #Pulse3D',
      createdAt,
      expiresAt
    ]);
  }
  await run(db, 'COMMIT');
  console.log('   ↳ Inserted demo stories into Django.');

  await run(db, 'PRAGMA foreign_keys = ON');
  db.close();
  console.log('✨ [Python Django SQLite Seeding Complete]');
}

async function main() {
  try {
    await seedNodeDatabase();
    await seedDjangoDatabase();

    console.log('\n================================================================');
    console.log('🎉 PULSE SOCIAL MEDIA DEMO DATASET SEEDED SUCCESSFULLY!');
    console.log('================================================================');
    console.log('Standard Demo Credentials for Video & Demonstration:');
    console.log(`  Username: demo_user   (Alex Vance)`);
    console.log(`  Password: ${DEMO_PASSWORD_PLAIN}`);
    console.log('  All 70 fictional users share the same demo password for testing.');
    console.log('================================================================\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding Failed with Error:', err);
    process.exit(1);
  }
}

main();
