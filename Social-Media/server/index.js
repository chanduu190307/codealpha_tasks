import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';
import { authMiddleware } from './middleware/auth.js';
import { setupWebSockets } from './ws/chat_ws.js';
import {
  helmetMiddleware,
  corsMiddleware,
  globalLimiter,
  authLimiter,
  contentLimiter
} from './middleware/security.js';
import { csrfMiddleware } from './middleware/csrf.js';

// Route imports
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import commentsRoutes from './routes/comments.js';
import chatRoutes from './routes/chat.js';
import storiesRoutes from './routes/stories.js';
import communitiesRoutes from './routes/communities.js';
import discoveryRoutes from './routes/discovery.js';
import creatorRoutes from './routes/creator.js';
import aiRoutes from './routes/ai.js';
import translationRoutes from './routes/translation.js';
import privacyRoutes from './routes/privacy.js';
import notificationsRoutes from './routes/notifications.js';
import verificationRoutes from './routes/verification.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const app = express();
const server = http.createServer(app);

// Initialize WebSockets
export const wsService = setupWebSockets(server);

// Security Headers & CORS
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Rate Limiting
app.use('/api/', globalLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/posts/', contentLimiter);

// Body Parsing (with 5MB ceiling)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Auth & CSRF Middlewares
app.use(authMiddleware);
app.use(csrfMiddleware);

// Serve static frontend assets
app.use('/static', express.static(path.join(rootDir, 'frontend')));
app.use('/media', express.static(path.join(rootDir, 'backend', 'media')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', authRoutes); // for /api/profiles/me/, /api/users/
app.use('/api', postsRoutes); // /api/posts/, /api/feed/
app.use('/api', commentsRoutes); // /api/posts/:id/comments/
app.use('/api', chatRoutes); // /api/conversations/
app.use('/api', storiesRoutes); // /api/stories/
app.use('/api', communitiesRoutes); // /api/communities/
app.use('/api', discoveryRoutes); // /api/search/, /api/trending/, /api/discovery/
app.use('/api/creator', creatorRoutes); // /api/creator/analytics/overview/, /api/creator/drafts/
app.use('/api/ai', aiRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api', notificationsRoutes); // /api/notifications/
app.use('/api/verification', verificationRoutes); // /api/verification/request/

// Serve Frontend SPA Pages
app.get('/', (req, res) => {
  res.sendFile(path.join(rootDir, 'frontend', 'index.html'));
});

app.get('/login/', (req, res) => {
  res.sendFile(path.join(rootDir, 'frontend', 'login.html'));
});

app.get('/register/', (req, res) => {
  res.sendFile(path.join(rootDir, 'frontend', 'register.html'));
});

app.get('/feed/', (req, res) => {
  res.sendFile(path.join(rootDir, 'frontend', 'index.html'));
});

app.get('/profile/', (req, res) => {
  res.sendFile(path.join(rootDir, 'frontend', 'index.html'));
});

// Fallback for any other page routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/media/') || req.path.startsWith('/static/')) {
    return next();
  }
  res.sendFile(path.join(rootDir, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 8000;

async function startServer() {
  await initDatabase();
  if (!server.listening) {
    server.listen(PORT, () => {
      console.log(`⚡ [Pulse 3D Node.js Server] Live & Running at http://localhost:${PORT}`);
      console.log(`🌌 3D Universe WebGL Engine Active & WebSockets Connected on ws://localhost:${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚡ [Pulse 3D Node.js Server] Port ${PORT} already active; continuing.`);
      } else {
        console.error('Failed to start server:', err);
      }
    });
  }
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});

export { app, server };
