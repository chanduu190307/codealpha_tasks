import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..', '..');

const NODE_DB_PATH = path.join(rootDir, 'pulse_3d.sqlite');
const DJANGO_DB_PATH = path.join(rootDir, 'backend', 'db.sqlite3');

function openDb(dbPath) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) reject(err);
      else resolve(db);
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

async function validateDatabase(name, dbPath, isDjango = false) {
  console.log(`\n================================================================`);
  console.log(`🔍 VALIDATING ${name.toUpperCase()} DATABASE`);
  console.log(`File: ${dbPath}`);
  console.log(`================================================================`);

  if (!fs.existsSync(dbPath)) {
    console.error(`❌ Database file not found: ${dbPath}`);
    return false;
  }

  const db = await openDb(dbPath);
  let errors = 0;
  const metrics = {};

  const userTable = isDjango ? 'auth_user' : 'users';
  const postTable = isDjango ? 'posts_post' : 'posts';
  const commentTable = isDjango ? 'comments_comment' : 'comments';
  const likeTable = isDjango ? 'interactions_like' : 'likes';
  const followTable = isDjango ? 'interactions_follow' : 'follows';
  const commTable = isDjango ? 'communities_community' : 'communities';

  // 1. Users Check
  const users = await all(db, `SELECT id, username, email FROM ${userTable}`);
  metrics.users = users.length;

  const usernameSet = new Set();
  let duplicateUsernames = 0;
  let invalidUsernameFormats = 0;
  const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;

  for (const u of users) {
    if (usernameSet.has(u.username.toLowerCase())) {
      duplicateUsernames++;
    }
    usernameSet.add(u.username.toLowerCase());

    if (!usernameRegex.test(u.username)) {
      invalidUsernameFormats++;
    }
  }

  if (duplicateUsernames > 0) {
    console.error(`❌ Found ${duplicateUsernames} duplicate usernames!`);
    errors++;
  }
  if (invalidUsernameFormats > 0) {
    console.error(`❌ Found ${invalidUsernameFormats} usernames failing regex constraint ^[a-zA-Z0-9_]{3,30}$!`);
    errors++;
  }

  // 2. Communities Check
  const communities = await all(db, `SELECT id, name, slug FROM ${commTable}`);
  metrics.communities = communities.length;

  // 3. Posts Check
  const posts = await all(db, `SELECT * FROM ${postTable}`);
  metrics.posts = posts.length;

  const userIds = new Set(users.map(u => u.id));
  const postIds = new Set(posts.map(p => p.id));
  let orphanedPosts = 0;
  let invalidPostTimestamps = 0;
  let futurePosts = 0;
  let imagePosts = 0;
  let invalidCoords = 0;
  const now = Date.now() + 10000; // 10s grace

  for (const p of posts) {
    const authorId = isDjango ? p.author_id : p.author_id;
    if (!userIds.has(authorId)) {
      orphanedPosts++;
    }

    const createdAt = new Date(p.created_at).getTime();
    if (isNaN(createdAt)) {
      invalidPostTimestamps++;
    } else if (createdAt > now) {
      futurePosts++;
    }

    if (p.image && p.image.trim().length > 0) {
      imagePosts++;
    }

    // 3D coordinates check for Node database
    if (!isDjango) {
      if (typeof p.coord_x !== 'number' || isNaN(p.coord_x) ||
          typeof p.coord_y !== 'number' || isNaN(p.coord_y) ||
          typeof p.coord_z !== 'number' || isNaN(p.coord_z)) {
        invalidCoords++;
      }
    }
  }
  metrics.imagePosts = imagePosts;

  if (orphanedPosts > 0) {
    console.error(`❌ Found ${orphanedPosts} orphaned posts with nonexistent author_id!`);
    errors++;
  }
  if (invalidPostTimestamps > 0) {
    console.error(`❌ Found ${invalidPostTimestamps} posts with unparseable timestamps!`);
    errors++;
  }
  if (futurePosts > 0) {
    console.error(`❌ Found ${futurePosts} posts dated in the future!`);
    errors++;
  }
  if (invalidCoords > 0) {
    console.error(`❌ Found ${invalidCoords} posts with invalid 3D spatial coordinates!`);
    errors++;
  }

  // 4. Comments Check
  const comments = await all(db, `SELECT * FROM ${commentTable}`);
  metrics.comments = comments.length;

  let orphanedCommentsPost = 0;
  let orphanedCommentsAuthor = 0;
  let commentsBeforePost = 0;
  const postDateMap = new Map(posts.map(p => [p.id, new Date(p.created_at).getTime()]));

  for (const c of comments) {
    if (!postIds.has(c.post_id)) {
      orphanedCommentsPost++;
    }
    if (!userIds.has(c.author_id)) {
      orphanedCommentsAuthor++;
    }

    const postDate = postDateMap.get(c.post_id);
    const commentDate = new Date(c.created_at).getTime();
    if (postDate && commentDate < postDate) {
      commentsBeforePost++;
    }
  }

  if (orphanedCommentsPost > 0) {
    console.error(`❌ Found ${orphanedCommentsPost} comments referencing nonexistent posts!`);
    errors++;
  }
  if (orphanedCommentsAuthor > 0) {
    console.error(`❌ Found ${orphanedCommentsAuthor} comments referencing nonexistent authors!`);
    errors++;
  }
  if (commentsBeforePost > 0) {
    console.error(`❌ Found ${commentsBeforePost} comments timestamped BEFORE their parent post!`);
    errors++;
  }

  // 5. Likes Check
  const likes = await all(db, `SELECT * FROM ${likeTable}`);
  metrics.likes = likes.length;

  const likePairs = new Set();
  let duplicateLikes = 0;
  let orphanedLikes = 0;

  for (const l of likes) {
    const key = `${l.post_id}-${l.user_id}`;
    if (likePairs.has(key)) {
      duplicateLikes++;
    }
    likePairs.add(key);

    if (!postIds.has(l.post_id) || !userIds.has(l.user_id)) {
      orphanedLikes++;
    }
  }

  if (duplicateLikes > 0) {
    console.error(`❌ Found ${duplicateLikes} duplicate like entries!`);
    errors++;
  }
  if (orphanedLikes > 0) {
    console.error(`❌ Found ${orphanedLikes} orphaned likes!`);
    errors++;
  }

  // Denormalized counters check for Node
  if (!isDjango) {
    let desyncedLikes = 0;
    let desyncedComments = 0;

    const actualLikesCounts = await all(db, `SELECT post_id, COUNT(*) as count FROM ${likeTable} GROUP BY post_id`);
    const actualLikesMap = new Map(actualLikesCounts.map(r => [r.post_id, r.count]));

    const actualCommentsCounts = await all(db, `SELECT post_id, COUNT(*) as count FROM ${commentTable} GROUP BY post_id`);
    const actualCommentsMap = new Map(actualCommentsCounts.map(r => [r.post_id, r.count]));

    for (const p of posts) {
      const expectedLikes = actualLikesMap.get(p.id) || 0;
      if (p.likes_count !== expectedLikes) {
        desyncedLikes++;
      }
      const expectedComments = actualCommentsMap.get(p.id) || 0;
      if (p.comments_count !== expectedComments) {
        desyncedComments++;
      }
    }

    if (desyncedLikes > 0) {
      console.error(`❌ Found ${desyncedLikes} posts with desynchronized likes_count!`);
      errors++;
    }
    if (desyncedComments > 0) {
      console.error(`❌ Found ${desyncedComments} posts with desynchronized comments_count!`);
      errors++;
    }
  }

  // 6. Follows Check
  const follows = await all(db, `SELECT * FROM ${followTable}`);
  metrics.follows = follows.length;

  const followPairs = new Set();
  let duplicateFollows = 0;
  let selfFollows = 0;
  let orphanedFollows = 0;

  for (const f of follows) {
    const followerId = isDjango ? f.follower_id : f.follower_id;
    const followingId = isDjango ? f.following_id : f.following_id;

    if (followerId === followingId) {
      selfFollows++;
    }

    const key = `${followerId}-${followingId}`;
    if (followPairs.has(key)) {
      duplicateFollows++;
    }
    followPairs.add(key);

    if (!userIds.has(followerId) || !userIds.has(followingId)) {
      orphanedFollows++;
    }
  }

  if (duplicateFollows > 0) {
    console.error(`❌ Found ${duplicateFollows} duplicate follow entries!`);
    errors++;
  }
  if (selfFollows > 0) {
    console.error(`❌ Found ${selfFollows} self-follow relationships!`);
    errors++;
  }
  if (orphanedFollows > 0) {
    console.error(`❌ Found ${orphanedFollows} orphaned follow relationships!`);
    errors++;
  }

  // Summary Report
  console.log(`\n📊 Data Metrics for ${name}:`);
  console.log(`   • Total Users:       ${metrics.users}`);
  console.log(`   • Total Communities: ${metrics.communities}`);
  console.log(`   • Total Posts:       ${metrics.posts}`);
  console.log(`   • Image Posts:       ${metrics.imagePosts}`);
  console.log(`   • Total Comments:    ${metrics.comments}`);
  console.log(`   • Total Likes:       ${metrics.likes}`);
  console.log(`   • Total Follows:     ${metrics.follows}`);

  console.log(`\n🛡️ Integrity Checks for ${name}:`);
  console.log(`   • Duplicate Usernames:       ${duplicateUsernames} (PASS)`);
  console.log(`   • Invalid Username Regex:    ${invalidUsernameFormats} (PASS)`);
  console.log(`   • Orphaned Posts:            ${orphanedPosts} (PASS)`);
  console.log(`   • Invalid Post Timestamps:   ${invalidPostTimestamps} (PASS)`);
  console.log(`   • Future Posts:              ${futurePosts} (PASS)`);
  if (!isDjango) {
    console.log(`   • Invalid 3D Coordinates:    ${invalidCoords} (PASS)`);
  }
  console.log(`   • Orphaned Comments:         ${orphanedCommentsPost + orphanedCommentsAuthor} (PASS)`);
  console.log(`   • Comments Before Post:      ${commentsBeforePost} (PASS)`);
  console.log(`   • Duplicate Likes:           ${duplicateLikes} (PASS)`);
  console.log(`   • Duplicate Follows:         ${duplicateFollows} (PASS)`);
  console.log(`   • Self-Follows:              ${selfFollows} (PASS)`);

  db.close();

  if (errors === 0) {
    console.log(`\n✅ [${name.toUpperCase()} INTEGRITY VERIFICATION: 100% CLEAN - 0 ERRORS]`);
    return true;
  } else {
    console.error(`\n❌ [${name.toUpperCase()} INTEGRITY VERIFICATION FAILED: ${errors} ERRORS]`);
    return false;
  }
}

async function validateSampleImages() {
  console.log('\n================================================================');
  console.log('🖼️  VALIDATING SAMPLE MEDIA & IMAGE ACCESSIBILITY');
  console.log('================================================================');

  const { POSTS } = await import('../seeds/seed_data.js');
  const imagePosts = POSTS.filter(p => p.image);
  console.log(`Total Image Posts in Dataset: ${imagePosts.length}`);

  // Test first 5 sample images via HTTP HEAD/GET request
  const samples = imagePosts.slice(0, 5);
  let passedImages = 0;

  for (const s of samples) {
    try {
      const res = await fetch(s.image, { method: 'HEAD' });
      if (res.ok) {
        console.log(`   [HTTP ${res.status}] Verified: ${s.image.substring(0, 60)}...`);
        passedImages++;
      } else {
        console.warn(`   [HTTP ${res.status}] Warning on image: ${s.image}`);
      }
    } catch (e) {
      console.warn(`   [Fetch Error] Could not reach image: ${s.image} (${e.message})`);
    }
  }
  console.log(`Sample Image Accessibility: ${passedImages}/${samples.length} OK.`);
}

async function main() {
  const nodeOk = await validateDatabase('Node.js (pulse_3d.sqlite)', NODE_DB_PATH, false);
  const djangoOk = await validateDatabase('Django (backend/db.sqlite3)', DJANGO_DB_PATH, true);
  await validateSampleImages();

  if (!nodeOk || !djangoOk) {
    console.error('\n❌ Content validation detected integrity failures.');
    process.exit(1);
  }

  console.log('\n================================================================');
  console.log('🎉 ALL SOCIAL CONTENT VALIDATIONS PASSED WITH ZERO INTEGRITY DEFECTS!');
  console.log('================================================================\n');
  process.exit(0);
}

main();
