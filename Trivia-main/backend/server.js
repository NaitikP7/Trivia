import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/auth.js';
import scoreRoutes from './routes/score.js';
import { initSocket } from './socket/matchHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true, // Reflect request origin
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', scoreRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: true,
    credentials: true,
  }
});

// Initialize Socket.IO match logic
initSocket(io);

httpServer.listen(PORT, () => {
  console.log(`🔒 Trivia Tournament Backend running on port ${PORT}`);
});
