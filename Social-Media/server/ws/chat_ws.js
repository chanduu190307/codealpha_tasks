import { WebSocketServer, WebSocket } from 'ws';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middleware/auth.js';
import { dbGet, dbRun } from '../db.js';

export function setupWebSockets(server) {
  const wss = new WebSocketServer({ noServer: true });

  // Map: conversationId -> Set of WebSockets
  const chatRooms = new Map();
  // Map: userId -> Set of WebSockets
  const userNotificationSockets = new Map();
  // Map: active user spatial positions { userId, username, avatar, x, y, z, lastPing }
  const spatialPresence = new Map();

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const pathname = url.pathname;

    // Route /ws/chat/:convId/ or /ws/notifications/ or /ws/spatial/
    if (pathname.startsWith('/ws/chat/') || pathname === '/ws/notifications/' || pathname === '/ws/spatial/') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', async (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Parse user from Authorization header, query param, or cookies
    let user = null;
    let token = url.searchParams.get('token');

    if (!token && req.headers['authorization']) {
      const authHeader = req.headers['authorization'];
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';');
      for (const c of cookies) {
        const [key, val] = c.trim().split('=');
        if (key === 'pulse_token' || key === 'sessionid') {
          token = decodeURIComponent(val || '');
          break;
        }
      }
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        user = await dbGet(
          'SELECT id, username, display_name, avatar FROM users WHERE id = ? AND is_active = 1',
          [decoded.userId]
        );
      } catch (e) {
        user = null;
      }
    }

    // Rate-limiting message flooding per socket: max 30 messages per 10 seconds
    let messageCount = 0;
    const msgRateInterval = setInterval(() => { messageCount = 0; }, 10000);

    const closeSocket = (code, reason) => {
      clearInterval(msgRateInterval);
      if (ws.readyState === WebSocket.OPEN) {
        try { ws.close(code, reason); } catch (e) {}
      } else {
        ws.once('open', () => {
          try { ws.close(code, reason); } catch (e) {}
        });
        setTimeout(() => {
          try {
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
              ws.close(code, reason);
            }
          } catch (e) {}
        }, 50);
      }
    };

    // 1. Handle Chat Socket: /ws/chat/:conversation_id/
    if (pathname.startsWith('/ws/chat/')) {
      // REQUIRE AUTHENTICATION (Phase 2 Requirement)
      if (!user) {
        closeSocket(4001, 'Authentication required');
        return;
      }

      const match = pathname.match(/\/ws\/chat\/(\d+)\/?/);
      const convId = match ? parseInt(match[1], 10) : null;

      if (!convId || isNaN(convId)) {
        closeSocket(4000, 'Invalid conversation ID');
        return;
      }

      // ENFORCE CONVERSATION MEMBERSHIP (BOLA / IDOR Guard)
      try {
        const membership = await dbGet(
          'SELECT id FROM conversation_members WHERE conversation_id = ? AND user_id = ?',
          [convId, user.id]
        );
        if (!membership) {
          closeSocket(4003, 'Unauthorized conversation access');
          return;
        }
      } catch (dbErr) {
        closeSocket(4003, 'Authorization verification failed');
        return;
      }

      // Add client to conversation room
      if (!chatRooms.has(convId)) {
        chatRooms.set(convId, new Set());
      }
      chatRooms.get(convId).add(ws);

      ws.on('message', async (data) => {
        messageCount++;
        if (messageCount > 30) {
          ws.send(JSON.stringify({ type: 'error', message: 'Message rate limit exceeded' }));
          return;
        }

        try {
          const rawString = typeof data === 'string' ? data : data.toString();
          if (rawString.length > 5000) {
            ws.send(JSON.stringify({ type: 'error', message: 'Payload too large' }));
            return;
          }

          const payload = JSON.parse(rawString);
          const type = payload.type || 'chat_message';

          if (type === 'chat_message') {
            const content = typeof payload.content === 'string' ? payload.content.trim() : '';
            if (!content || content.length > 2000) {
              ws.send(JSON.stringify({ type: 'error', message: 'Invalid message content' }));
              return;
            }

            // Re-verify membership before insert
            const isMember = await dbGet(
              'SELECT id FROM conversation_members WHERE conversation_id = ? AND user_id = ?',
              [convId, user.id]
            );
            if (!isMember) {
              ws.close(4003, 'Unauthorized');
              return;
            }

            const resMsg = await dbRun(
              'INSERT INTO messages (conversation_id, sender_id, content, reply_to_id) VALUES (?, ?, ?, ?)',
              [convId, user.id, content, payload.reply_to_id || null]
            );

            await dbRun('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [convId]);

            const broadcastData = JSON.stringify({
              type: 'message',
              message: {
                id: resMsg.lastID,
                conversation_id: convId,
                sender: {
                  id: user.id,
                  username: user.username,
                  display_name: user.display_name || user.username,
                  avatar: user.avatar || ''
                },
                content: content,
                reply_to_id: payload.reply_to_id || null,
                created_at: new Date().toISOString()
              }
            });

            const room = chatRooms.get(convId);
            if (room) {
              room.forEach(client => {
                if (client.readyState === WebSocket.OPEN) client.send(broadcastData);
              });
            }
          } else if (type === 'typing') {
            const broadcastData = JSON.stringify({
              type: 'typing',
              user_id: user.id,
              username: user.username,
              is_typing: !!payload.is_typing
            });

            const room = chatRooms.get(convId);
            if (room) {
              room.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) client.send(broadcastData);
              });
            }
          } else if (type === 'read_receipt') {
            const broadcastData = JSON.stringify({
              type: 'read_receipt',
              user_id: user.id,
              read_at: new Date().toISOString()
            });

            const room = chatRooms.get(convId);
            if (room) {
              room.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) client.send(broadcastData);
              });
            }
          }
        } catch (err) {
          // Do not leak internal stack traces
          ws.send(JSON.stringify({ type: 'error', message: 'Malformed WebSocket frame' }));
        }
      });

      ws.on('close', () => {
        clearInterval(msgRateInterval);
        const room = chatRooms.get(convId);
        if (room) {
          room.delete(ws);
          if (room.size === 0) chatRooms.delete(convId);
        }
      });
    }

    // 2. Handle Notifications Socket: /ws/notifications/
    else if (pathname === '/ws/notifications/') {
      if (!user) {
        clearInterval(msgRateInterval);
        ws.close(4001, 'Authentication required');
        return;
      }

      if (!userNotificationSockets.has(user.id)) {
        userNotificationSockets.set(user.id, new Set());
      }
      userNotificationSockets.get(user.id).add(ws);

      ws.on('close', () => {
        clearInterval(msgRateInterval);
        const userSet = userNotificationSockets.get(user.id);
        if (userSet) {
          userSet.delete(ws);
          if (userSet.size === 0) userNotificationSockets.delete(user.id);
        }
      });
    }

    // 3. Handle 3D Spatial Presence Universe: /ws/spatial/
    else if (pathname === '/ws/spatial/') {
      if (!user) {
        clearInterval(msgRateInterval);
        ws.close(4001, 'Authentication required');
        return;
      }

      spatialPresence.set(user.id, {
        userId: user.id,
        username: user.username,
        displayName: user.display_name,
        avatar: user.avatar,
        x: 0,
        y: 0,
        z: 0,
        lastPing: Date.now()
      });

      ws.on('message', (msg) => {
        try {
          const data = JSON.parse(msg.toString());
          if (data.type === 'spatial_move') {
            const current = spatialPresence.get(user.id);
            if (current) {
              current.x = typeof data.x === 'number' ? data.x : current.x;
              current.y = typeof data.y === 'number' ? data.y : current.y;
              current.z = typeof data.z === 'number' ? data.z : current.z;
              current.lastPing = Date.now();
            }
          }
        } catch (e) {}
      });

      ws.on('close', () => {
        clearInterval(msgRateInterval);
        spatialPresence.delete(user.id);
      });
    }
  });

  return {
    sendNotification(recipientId, notificationData) {
      const userSet = userNotificationSockets.get(recipientId);
      if (userSet) {
        const payload = JSON.stringify({
          type: 'notification',
          notification: notificationData
        });
        userSet.forEach(client => {
          if (client.readyState === WebSocket.OPEN) client.send(payload);
        });
      }
    }
  };
}
