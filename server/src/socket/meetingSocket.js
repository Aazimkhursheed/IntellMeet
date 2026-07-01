// Track active meetings and participants
const activeMeetings = new Map();

/**
 * Initialize meeting socket handlers
 * @param {Object} io - Socket.io server instance
 */
export const initializeMeetingSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket client connected: ${socket.id}`);

    // Join a meeting room
    socket.on('join-meeting', async (data) => {
      try {
        const { meetingId, userId, userName, userRole } = data;
        
        // Join the socket room
        socket.join(meetingId);
        
        // Track participant
        if (!activeMeetings.has(meetingId)) {
          activeMeetings.set(meetingId, new Map());
        }
        
        const meetingRoom = activeMeetings.get(meetingId);
        meetingRoom.set(socket.id, {
          userId,
          userName,
          userRole,
          socketId: socket.id,
          joinedAt: new Date(),
        });

        // Get list of existing participants
        const existingParticipants = Array.from(meetingRoom.values()).map(p => ({
          userId: p.userId,
          userName: p.userName,
          userRole: p.userRole,
          socketId: p.socketId,
        }));

        // Notify the joining user about existing participants
        socket.emit('participants-list', existingParticipants);

        // Notify others in the room about the new participant
        socket.to(meetingId).emit('user-joined', {
          userId,
          userName,
          userRole,
          socketId: socket.id,
        });

        // Update participant count
        io.to(meetingId).emit('participant-count', {
          count: meetingRoom.size,
        });

        console.log(`User ${userName} (${userId}) joined meeting ${meetingId}`);
      } catch (error) {
        console.error('Error joining meeting:', error);
        socket.emit('error', { message: 'Failed to join meeting' });
      }
    });

    // Leave a meeting room
    socket.on('leave-meeting', (data) => {
      const { meetingId, userId } = data;
      
      handleLeaveRoom(io, socket, meetingId, userId);
    });

    // WebRTC Signaling: Offer
    socket.on('offer', (data) => {
      const { targetSocketId, offer, senderId } = data;
      io.to(targetSocketId).emit('offer', {
        offer,
        senderId,
        senderSocketId: socket.id,
      });
    });

    // WebRTC Signaling: Answer
    socket.on('answer', (data) => {
      const { targetSocketId, answer, senderId } = data;
      io.to(targetSocketId).emit('answer', {
        answer,
        senderId,
        senderSocketId: socket.id,
      });
    });

    // WebRTC Signaling: ICE Candidate
    socket.on('ice-candidate', (data) => {
      const { targetSocketId, candidate, senderId } = data;
      io.to(targetSocketId).emit('ice-candidate', {
        candidate,
        senderId,
        senderSocketId: socket.id,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Find and clean up all meetings this socket was in
      activeMeetings.forEach((participants, meetingId) => {
        const participant = participants.get(socket.id);
        if (participant) {
          handleLeaveRoom(io, socket, meetingId, participant.userId);
        }
      });
      
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });
};

/**
 * Handle user leaving a room
 */
const handleLeaveRoom = (io, socket, meetingId, userId) => {
  const meetingRoom = activeMeetings.get(meetingId);
  
  if (meetingRoom) {
    const participant = meetingRoom.get(socket.id);
    
    if (participant) {
      meetingRoom.delete(socket.id);
      
      // Notify others in the room
      socket.to(meetingId).emit('user-left', {
        userId,
        socketId: socket.id,
      });

      // Update participant count
      io.to(meetingId).emit('participant-count', {
        count: meetingRoom.size,
      });

      // Clean up empty meetings
      if (meetingRoom.size === 0) {
        activeMeetings.delete(meetingId);
      }
    }
  }
  
  socket.leave(meetingId);
};

/**
 * Get active meetings (for debugging/admin)
 */
export const getActiveMeetings = () => {
  const meetings = [];
  activeMeetings.forEach((participants, meetingId) => {
    meetings.push({
      meetingId,
      participantCount: participants.size,
      participants: Array.from(participants.values()),
    });
  });
  return meetings;
};