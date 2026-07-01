import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';
import { initializeMeetingSocket } from './socket/meetingSocket.js';

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

// Initialize Socket.io meeting handlers
initializeMeetingSocket(io);

// Start HTTP and WebSocket server
server.listen(PORT, () => {
  console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
