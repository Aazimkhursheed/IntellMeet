import { io } from 'socket.io-client';
import useAuthStore from '../store/useAuthStore.js';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  /**
   * Initialize socket connection
   */
  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    const user = useAuthStore.getState().user;
    
    this.socket = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      auth: {
        userId: user?.id,
        userName: user?.fullName,
        userRole: user?.role,
      },
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
    });

    return this.socket;
  }

  /**
   * Disconnect socket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  /**
   * Join a meeting room
   */
  joinMeeting(meetingId) {
    if (!this.socket) {
      this.connect();
    }

    const user = useAuthStore.getState().user;
    
    this.socket.emit('join-meeting', {
      meetingId,
      userId: user?.id,
      userName: user?.fullName,
      userRole: user?.role,
    });
  }

  /**
   * Leave a meeting room
   */
  leaveMeeting(meetingId) {
    if (!this.socket) return;

    const user = useAuthStore.getState().user;
    
    this.socket.emit('leave-meeting', {
      meetingId,
      userId: user?.id,
    });
  }

  /**
   * Send WebRTC offer
   */
  sendOffer(targetSocketId, offer, senderId) {
    if (!this.socket) return;
    this.socket.emit('offer', {
      targetSocketId,
      offer,
      senderId,
    });
  }

  /**
   * Send WebRTC answer
   */
  sendAnswer(targetSocketId, answer, senderId) {
    if (!this.socket) return;
    this.socket.emit('answer', {
      targetSocketId,
      answer,
      senderId,
    });
  }

  /**
   * Send ICE candidate
   */
  sendIceCandidate(targetSocketId, candidate, senderId) {
    if (!this.socket) return;
    this.socket.emit('ice-candidate', {
      targetSocketId,
      candidate,
      senderId,
    });
  }

  /**
   * Listen for participants list
   */
  onParticipantsList(callback) {
    if (!this.socket) return;
    this.socket.on('participants-list', callback);
  }

  /**
   * Listen for user joined event
   */
  onUserJoined(callback) {
    if (!this.socket) return;
    this.socket.on('user-joined', callback);
  }

  /**
   * Listen for user left event
   */
  onUserLeft(callback) {
    if (!this.socket) return;
    this.socket.on('user-left', callback);
  }

  /**
   * Listen for participant count updates
   */
  onParticipantCount(callback) {
    if (!this.socket) return;
    this.socket.on('participant-count', callback);
  }

  /**
   * Listen for WebRTC offer
   */
  onOffer(callback) {
    if (!this.socket) return;
    this.socket.on('offer', callback);
  }

  /**
   * Listen for WebRTC answer
   */
  onAnswer(callback) {
    if (!this.socket) return;
    this.socket.on('answer', callback);
  }

  /**
   * Listen for ICE candidate
   */
  onIceCandidate(callback) {
    if (!this.socket) return;
    this.socket.on('ice-candidate', callback);
  }

  /**
   * Send chat message
   */
  sendChatMessage(meetingId, message) {
    if (!this.socket) return;
    
    const user = useAuthStore.getState().user;
    
    this.socket.emit('chat-message', {
      meetingId,
      userId: user?.id,
      userName: user?.fullName,
      message,
      timestamp: new Date(),
    });
  }

  /**
   * Listen for chat messages
   */
  onChatMessage(callback) {
    if (!this.socket) return;
    this.socket.on('chat-message', callback);
  }

  /**
   * Listen for errors
   */
  onError(callback) {
    if (!this.socket) return;
    this.socket.on('error', callback);
  }

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    if (!this.socket) return;
    this.socket.removeAllListeners();
  }

  /**
   * Remove specific listener
   */
  removeListener(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
}

// Singleton instance
export const socketService = new SocketService();
export default socketService;