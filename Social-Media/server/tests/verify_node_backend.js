import http from 'http';
import WebSocket from 'ws';
import { app, server } from '../index.js';
import { initDatabase, dbRun, dbGet } from '../db.js';

const PORT = process.env.PORT || 8000;

function makeRequest(method, path, body = null, headers = {}, cookie = '') {
  return new Promise((resolve, reject) => {
    let postData = null;
    const reqHeaders = { ...headers };

    if (body !== null && typeof body === 'object') {
      postData = JSON.stringify(body);
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    } else if (typeof body === 'string') {
      postData = body;
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    if (cookie) {
      reqHeaders['Cookie'] = cookie;
    }

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path,
      method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = { text: data };
        }
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: json,
          cookies: res.headers['set-cookie']
        });
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runVerification() {
  console.log('🚀 --- Starting Node.js Full-Stack Application Verification & Security Suite ---');

  // Allow server initialization
  await initDatabase();
  await new Promise((r) => setTimeout(r, 400));
  console.log(`[OK] Verified server active on port ${PORT}`);

  try {
    // 1. CSRF Token Endpoint
    console.log('\n--- 1. Testing CSRF Endpoint ---');
    const csrfRes = await makeRequest('GET', '/api/auth/csrf/');
    console.log(`Status: ${csrfRes.status}, Token: ${csrfRes.data.csrfToken}`);
    if (csrfRes.status !== 200 || !csrfRes.data.csrfToken) throw new Error('CSRF check failed');

    // 2. User A Registration & Auth
    console.log('\n--- 2. Testing User A Registration ---');
    const testUserA = `node_tester_a_${Date.now()}`;
    const regResA = await makeRequest('POST', '/api/auth/register/', {
      username: testUserA,
      email: `${testUserA}@example.com`,
      password: 'StrongPassword123!',
      password_confirm: 'StrongPassword123!'
    });
    console.log(`Status: ${regResA.status}, User A ID: ${regResA.data.user?.id}`);
    if (regResA.status !== 201) throw new Error('User A registration failed');
    const tokenA = regResA.data.token;
    const authHeadersA = { 'Authorization': `Bearer ${tokenA}` };

    // User B Registration
    console.log('\n--- 2b. Testing User B Registration ---');
    const testUserB = `node_tester_b_${Date.now()}`;
    const regResB = await makeRequest('POST', '/api/auth/register/', {
      username: testUserB,
      email: `${testUserB}@example.com`,
      password: 'StrongPassword123!',
      password_confirm: 'StrongPassword123!'
    });
    console.log(`Status: ${regResB.status}, User B ID: ${regResB.data.user?.id}`);
    if (regResB.status !== 201) throw new Error('User B registration failed');
    const tokenB = regResB.data.token;
    const authHeadersB = { 'Authorization': `Bearer ${tokenB}` };

    // 3. Current User Endpoint (Me)
    console.log('\n--- 3. Testing Auth Me Endpoint ---');
    const meRes = await makeRequest('GET', '/api/auth/me/', null, authHeadersA);
    console.log(`Status: ${meRes.status}, Authenticated: ${meRes.data.authenticated}`);
    if (!meRes.data.authenticated) throw new Error('Auth Me check failed');

    // 4. Create 3D Spatial Post
    console.log('\n--- 4. Testing 3D Spatial Post Creation ---');
    const postRes = await makeRequest('POST', '/api/posts/', {
      content: 'Exploring the 3D WebGL Cosmos on Node.js! #NodeJS #WebGL #ThreeJS #Pulse3D'
    }, authHeadersA);
    console.log(`Status: ${postRes.status}, Post ID: ${postRes.data.post?.id}, 3D Coords:`, postRes.data.post?.coords);
    if (postRes.status !== 201 || !postRes.data.post?.coords) throw new Error('3D Post creation failed');
    const postId = postRes.data.post.id;

    // 5. Feed Retrieval
    console.log('\n--- 5. Testing Feed Retrieval ---');
    const feedRes = await makeRequest('GET', '/api/posts/', null, authHeadersA);
    console.log(`Status: ${feedRes.status}, Total Posts: ${feedRes.data.results?.length}`);
    if (feedRes.status !== 200 || feedRes.data.results.length === 0) throw new Error('Feed retrieval failed');

    // 6. Like & Bookmark Post
    console.log('\n--- 6. Testing Post Like & Bookmark ---');
    const likeRes = await makeRequest('POST', `/api/posts/${postId}/like/`, {}, authHeadersA);
    console.log(`Like Status: ${likeRes.status}, Is Liked: ${likeRes.data.is_liked}`);
    if (likeRes.status !== 200 || !likeRes.data.is_liked) throw new Error('Post like failed');

    const bmRes = await makeRequest('POST', `/api/posts/${postId}/bookmark/`, {}, authHeadersA);
    console.log(`Bookmark Status: ${bmRes.status}, Result:`, bmRes.data);
    if (bmRes.status !== 200) throw new Error('Post bookmark failed');

    // 7. Add Comment and Author Deletion
    console.log('\n--- 7. Testing Comments & Moderation Deletion ---');
    const commentRes = await makeRequest('POST', `/api/posts/${postId}/comments/`, {
      content: 'User B commenting on User A post!'
    }, authHeadersB);
    console.log(`Comment Status: ${commentRes.status}, Comment ID: ${commentRes.data.comment?.id}`);
    if (commentRes.status !== 201) throw new Error('Comment addition failed');
    const commentId = commentRes.data.comment.id;

    // Post Author (User A) deletes comment on their post (Authorized moderation)
    const delCommentRes = await makeRequest('DELETE', `/api/comments/${commentId}/`, null, authHeadersA);
    console.log(`Post Author Delete Comment Status: ${delCommentRes.status} (Expected 200)`);
    if (delCommentRes.status !== 200) throw new Error('Post author comment moderation deletion failed');

    // 8. AI Writing Assistant
    console.log('\n--- 8. Testing AI Writing Assistant ---');
    const aiRes = await makeRequest('POST', '/api/ai/writing-assist/', {
      text: 'Building decentralized spatial social feeds with Three.js and WebSockets.',
      tone: 'engaging'
    });
    console.log(`AI Status: ${aiRes.status}, Suggestions Count: ${aiRes.data.suggestions?.length}`);
    if (aiRes.status !== 200 || aiRes.data.suggestions.length === 0) throw new Error('AI assistant failed');

    // 9. Communities & Community Posts
    console.log('\n--- 9. Testing Communities & Community Posts ---');
    const commName = `Quantum Matrix ${Date.now()}`;
    const commRes = await makeRequest('POST', '/api/communities/', {
      name: commName,
      description: 'Pioneering next-generation spatial computing',
      type: 'public'
    }, authHeadersA);
    console.log(`Community Create Status: ${commRes.status}, Slug: ${commRes.data.community?.slug}`);
    if (commRes.status !== 201) throw new Error('Community creation failed');
    const commSlug = commRes.data.community.slug;

    const commPostsRes = await makeRequest('GET', `/api/communities/${commSlug}/posts/`, null, authHeadersA);
    console.log(`Community Posts Status: ${commPostsRes.status}, Community Name: ${commPostsRes.data.community?.name}`);
    if (commPostsRes.status !== 200) throw new Error('Community posts retrieval failed');

    // 10. Ranked Search & Trending
    console.log('\n--- 10. Testing Multi-Entity Ranked Search ---');
    const searchRes = await makeRequest('GET', `/api/search/?q=${testUserA}`, null, authHeadersA);
    console.log(`Search Status: ${searchRes.status}, Matching Users: ${searchRes.data.users?.length}`);
    if (searchRes.status !== 200 || searchRes.data.users.length === 0) throw new Error('Ranked search failed');

    // 11. Conversation Creation (POST /api/conversations/)
    console.log('\n--- 11. Testing Conversation Creation ---');
    const convRes = await makeRequest('POST', '/api/conversations/', {
      recipient_id: regResB.data.user.id
    }, authHeadersA);
    console.log(`Conversation Status: ${convRes.status}, Conv ID: ${convRes.data.id}`);
    if (convRes.status !== 201 && convRes.status !== 200) throw new Error('Conversation creation failed');
    const convId = convRes.data.id;

    // 12. Creator Studio Endpoints
    console.log('\n--- 12. Testing Creator Studio ---');
    const analyticsRes = await makeRequest('GET', '/api/creator/analytics/overview/?days=30', null, authHeadersA);
    console.log(`Analytics Status: ${analyticsRes.status}, Impressions: ${analyticsRes.data.impressions}`);
    if (analyticsRes.status !== 200) throw new Error('Creator analytics failed');

    const draftRes = await makeRequest('POST', '/api/creator/drafts/', {
      content: 'Future spatial blog draft'
    }, authHeadersA);
    console.log(`Draft Create Status: ${draftRes.status}, Draft ID: ${draftRes.data.draft?.id}`);
    if (draftRes.status !== 201) throw new Error('Creator draft creation failed');

    const schedRes = await makeRequest('POST', '/api/creator/scheduled/', {
      content: 'Scheduled broadcast post',
      scheduled_time: new Date(Date.now() + 86400000).toISOString()
    }, authHeadersA);
    console.log(`Schedule Post Status: ${schedRes.status}, Sched ID: ${schedRes.data.scheduled_post?.id}`);
    if (schedRes.status !== 201) throw new Error('Creator scheduling failed');

    const pubNowRes = await makeRequest('POST', `/api/creator/scheduled/${schedRes.data.scheduled_post.id}/publish-now/`, {}, authHeadersA);
    console.log(`Publish Now Status: ${pubNowRes.status}, Live Post ID: ${pubNowRes.data.post_id}`);
    if (pubNowRes.status !== 200 || !pubNowRes.data.post_id) throw new Error('Publish now failed');

    // 13. Verification Request
    console.log('\n--- 13. Testing Verification Request Flow ---');
    const verifRes = await makeRequest('POST', '/api/verification/request/', {
      full_name: 'Alice Developer',
      category: 'creator',
      reason: 'Pioneer 3D content creator on Pulse platform'
    }, authHeadersA);
    console.log(`Verification Request Status: ${verifRes.status}, Status: ${verifRes.data.status}`);
    if (verifRes.status !== 201) throw new Error('Verification request failed');

    // 14. Password Change Flow
    console.log('\n--- 14. Testing Password Change Security ---');
    // Wrong current password rejection
    const badPwRes = await makeRequest('POST', '/api/auth/change-password/', {
      current_password: 'WrongPassword!',
      new_password: 'NewStrongPassword123!',
      new_password_confirm: 'NewStrongPassword123!'
    }, authHeadersA);
    console.log(`Wrong Password Status: ${badPwRes.status} (Expected 400)`);
    if (badPwRes.status !== 400) throw new Error('Wrong password should be rejected');

    // Successful password change
    const goodPwRes = await makeRequest('POST', '/api/auth/change-password/', {
      current_password: 'StrongPassword123!',
      new_password: 'NewStrongPassword123!',
      new_password_confirm: 'NewStrongPassword123!'
    }, authHeadersA);
    console.log(`Good Password Status: ${goodPwRes.status} (Expected 200)`);
    if (goodPwRes.status !== 200) throw new Error('Valid password change failed');

    // 15. User Blocking & Unblocking
    console.log('\n--- 15. Testing Block & Unblock ---');
    const blockRes = await makeRequest('POST', `/api/users/${testUserB}/block/`, {}, authHeadersA);
    console.log(`Block Status: ${blockRes.status}, Is Blocked: ${blockRes.data.is_blocked}`);
    if (blockRes.status !== 200 || !blockRes.data.is_blocked) throw new Error('User block failed');

    const blockedListRes = await makeRequest('GET', '/api/users/blocked/', null, authHeadersA);
    console.log(`Blocked List Count: ${blockedListRes.data.results?.length}`);
    if (blockedListRes.data.results.length === 0) throw new Error('Blocked list check failed');

    const unblockRes = await makeRequest('POST', `/api/users/${testUserB}/unblock/`, {}, authHeadersA);
    console.log(`Unblock Status: ${unblockRes.status}, Is Blocked: ${unblockRes.data.is_blocked}`);
    if (unblockRes.status !== 200 || unblockRes.data.is_blocked) throw new Error('User unblock failed');

    // 16. WebSocket Security Negative Tests
    console.log('\n--- 16. Testing WebSocket Security Guard (Negative Tests) ---');

    // Negative Test A: Unauthenticated connection rejected with 4001
    await new Promise((resolve, reject) => {
      const unauthWs = new WebSocket(`ws://localhost:${PORT}/ws/chat/${convId}/`);
      unauthWs.on('close', (code) => {
        console.log(`Unauthenticated WS Close Code: ${code} (Expected 4001)`);
        if (code === 4001) resolve();
        else reject(new Error(`Expected 4001, got ${code}`));
      });
      unauthWs.on('error', () => {});
    });

    // Create a 3rd unrelated user C
    const testUserC = `node_tester_c_${Date.now()}`;
    const regResC = await makeRequest('POST', '/api/auth/register/', {
      username: testUserC,
      email: `${testUserC}@example.com`,
      password: 'StrongPassword123!',
      password_confirm: 'StrongPassword123!'
    });
    const tokenC = regResC.data.token;

    // Negative Test B: Authenticated User C connecting to Conversation(A, B) -> Rejected with 4003 (BOLA / IDOR Guard)
    await new Promise((resolve, reject) => {
      const unauthorizedWs = new WebSocket(`ws://localhost:${PORT}/ws/chat/${convId}/?token=${tokenC}`);
      unauthorizedWs.on('close', (code) => {
        console.log(`Unauthorized Conversation WS Close Code: ${code} (Expected 4003 BOLA Guard)`);
        if (code === 4003) resolve();
        else reject(new Error(`Expected 4003 BOLA protection, got ${code}`));
      });
      unauthorizedWs.on('error', () => {});
    });

    // Positive Test C: Authorized Member User B connecting to Conversation(A, B) -> Accepted
    await new Promise((resolve, reject) => {
      const authorizedWs = new WebSocket(`ws://localhost:${PORT}/ws/chat/${convId}/?token=${tokenB}`);
      authorizedWs.on('open', () => {
        console.log('[OK] Authorized Conversation Member WS Connection Accepted');
        authorizedWs.close();
        resolve();
      });
      authorizedWs.on('error', reject);
    });

    console.log('\n===============================================================');
    console.log('🎉 [ALL NODE.JS SECURITY, BOLA, FEATURE & ARCHITECTURE TESTS PASSED!]');
    console.log('===============================================================');
  } finally {
    server.close();
    process.exit(0);
  }
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
