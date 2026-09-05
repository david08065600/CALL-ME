import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { initializeDatabase } from './db/init.js';
import { authenticateToken } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import callsRoutes from './routes/calls.js';
import effectsRoutes from './routes/effects.js';
import creditsRoutes from './routes/credits.js';
import settingsRoutes from './routes/settings.js';
import aiRoutes from './routes/ai.js';
import adminRoutes from './routes/admin.js';
import { setupWebSocket } from './websocket/handlers.js';

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, usersRoutes);
app.use('/api/calls', authenticateToken, callsRoutes);
app.use('/api/effects', authenticateToken, effectsRoutes);
app.use('/api/credits', authenticateToken, creditsRoutes);
app.use('/api/settings', authenticateToken, settingsRoutes);
app.use('/api/ai', authenticateToken, aiRoutes);
app.use('/api/admin', authenticateToken, adminRoutes);

// Serve static files if client is built
app.use(express.static('public'));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: NODE_ENV === 'production' ? 'Internal server error' : err.message 
  });
});

// WebSocket Setup
const wss = new WebSocketServer({ server });
setupWebSocket(wss);

// Initialize and start
async function start() {
  try {
    console.log('Initializing database...');
    await initializeDatabase();
    console.log('Database initialized');

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 CALL ME Server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

export default app;
