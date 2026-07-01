import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

// Configuration: Load environment variables
dotenv.config();

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

// Socket.io event orchestration (Placeholder)
io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

// Start HTTP and WebSocket server
server.listen(PORT, () => {
  console.log(`Server listening in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
