import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

// Configuration: Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'NODE_ENV',
  'CLIENT_URL',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error(
    '❌ Server startup failed: Missing required environment variables:',
    missingEnvVars.join(', ')
  );
  process.exit(1);
}

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.io with appropriate CORS permissions
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.io event orchestration
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  // Join a meeting room
  socket.on('join-room', ({ meetingId, userId }) => {
    socket.join(meetingId);
    console.log(`User ${userId} joined room ${meetingId}`);
    // Notify others in the room
    socket.to(meetingId).emit('user-joined', { userId, socketId: socket.id });
  });

  // Leave a meeting room
  socket.on('leave-room', ({ meetingId, userId }) => {
    socket.leave(meetingId);
    console.log(`User ${userId} left room ${meetingId}`);
    // Notify others in the room
    socket.to(meetingId).emit('user-left', { userId, socketId: socket.id });
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Start HTTP and WebSocket server
server.listen(PORT, () => {
  console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
