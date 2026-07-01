import { useRef, useCallback, useEffect } from 'react';
import { socketService } from '../services/socketService.js';

/**
 * Configuration for STUN/TURN servers
 * Using public Google STUN servers for NAT traversal
 */
const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

/**
 * Hook to manage WebRTC peer connections
 */
export const useWebRTC = (meetingId, localStream) => {
  const peerConnections = useRef(new Map()); // socketId -> RTCPeerConnection
  const remoteStreams = useRef(new Map()); // socketId -> MediaStream
  const isInitiator = useRef(false);

  /**
   * Create a new peer connection
   */
  const createPeerConnection = useCallback((targetSocketId, isOffer = false) => {
    if (!localStream) {
      console.error('Cannot create peer connection: no local stream');
      return null;
    }

    // Close existing connection if any
    if (peerConnections.current.has(targetSocketId)) {
      const existingPc = peerConnections.current.get(targetSocketId);
      existingPc.close();
    }

    const pc = new RTCPeerConnection(rtcConfig);

    // Add local stream tracks to the connection
    localStream.getTracks().forEach(track => {
      pc.addTrack(track, localStream);
    });

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log(`Received remote track from ${targetSocketId}`);
      const [remoteStream] = event.streams;
      
      if (remoteStream) {
        remoteStreams.current.set(targetSocketId, remoteStream);
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketService.sendIceCandidate(
          targetSocketId,
          event.candidate,
          socketService.socket?.id
        );
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${targetSocketId}: ${pc.connectionState}`);
      
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        console.warn(`Connection with ${targetSocketId} failed, attempting to restart...`);
        // Could implement ICE restart here
      }

      if (pc.connectionState === 'closed') {
        peerConnections.current.delete(targetSocketId);
        remoteStreams.current.delete(targetSocketId);
      }
    };

    // Handle ICE connection state changes
    pc.oniceconnectionstatechange = () => {
      console.log(`ICE state with ${targetSocketId}: ${pc.iceConnectionState}`);
    };

    peerConnections.current.set(targetSocketId, pc);

    // If we're the initiator, create and send an offer
    if (isOffer) {
      isInitiator.current = true;
      pc.createOffer()
        .then(offer => pc.setLocalDescription(offer))
        .then(() => {
          socketService.sendOffer(
            targetSocketId,
            pc.localDescription,
            socketService.socket?.id
          );
        })
        .catch(err => {
          console.error('Error creating offer:', err);
        });
    }

    return pc;
  }, [localStream]);

  /**
   * Handle incoming offer
   */
  const handleOffer = useCallback(async (data) => {
    const { offer, senderId, senderSocketId } = data;
    
    console.log(`Received offer from ${senderId}`);

    const pc = createPeerConnection(senderSocketId, false);
    if (!pc) return;

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socketService.sendAnswer(
        senderSocketId,
        pc.localDescription,
        socketService.socket?.id
      );

      console.log(`Sent answer to ${senderId}`);
    } catch (err) {
      console.error('Error handling offer:', err);
    }
  }, [createPeerConnection]);

  /**
   * Handle incoming answer
   */
  const handleAnswer = useCallback((data) => {
    const { answer, senderId, senderSocketId } = data;
    
    console.log(`Received answer from ${senderId}`);

    const pc = peerConnections.current.get(senderSocketId);
    if (!pc) {
      console.error(`No peer connection found for ${senderId}`);
      return;
    }

    try {
      pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log(`Set remote description from ${senderId}`);
    } catch (err) {
      console.error('Error handling answer:', err);
    }
  }, []);

  /**
   * Handle incoming ICE candidate
   */
  const handleIceCandidate = useCallback((data) => {
    const { candidate, senderId, senderSocketId } = data;
    
    const pc = peerConnections.current.get(senderSocketId);
    if (!pc) {
      console.error(`No peer connection found for ${senderId}`);
      return;
    }

    try {
      pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log(`Added ICE candidate from ${senderId}`);
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  }, []);

  /**
   * Initialize peer connections with all existing participants
   */
  const initializePeerConnections = useCallback((participants) => {
    if (!localStream) {
      console.error('Cannot initialize peer connections: no local stream');
      return;
    }

    participants.forEach(participant => {
      // Don't create connection with ourselves
      if (participant.socketId !== socketService.socket?.id) {
        createPeerConnection(participant.socketId, true);
      }
    });
  }, [localStream, createPeerConnection]);

  /**
   * Close all peer connections
   */
  const closeAllConnections = useCallback(() => {
    peerConnections.current.forEach((pc, socketId) => {
      console.log(`Closing connection with ${socketId}`);
      pc.close();
    });
    
    peerConnections.current.clear();
    remoteStreams.current.clear();
    isInitiator.current = false;
  }, []);

  /**
   * Get remote stream for a participant
   */
  const getRemoteStream = useCallback((socketId) => {
    return remoteStreams.current.get(socketId) || null;
  }, []);

  /**
   * Get all remote streams
   */
  const getAllRemoteStreams = useCallback(() => {
    return Array.from(remoteStreams.current.entries()).map(([socketId, stream]) => ({
      socketId,
      stream,
    }));
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!meetingId) return;

    socketService.onOffer(handleOffer);
    socketService.onAnswer(handleAnswer);
    socketService.onIceCandidate(handleIceCandidate);

    return () => {
      socketService.removeListener('offer', handleOffer);
      socketService.removeListener('answer', handleAnswer);
      socketService.removeListener('ice-candidate', handleIceCandidate);
    };
  }, [meetingId, handleOffer, handleAnswer, handleIceCandidate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeAllConnections();
    };
  }, [closeAllConnections]);

  return {
    createPeerConnection,
    initializePeerConnections,
    closeAllConnections,
    getRemoteStream,
    getAllRemoteStreams,
    peerConnections: peerConnections.current,
  };
};

export default useWebRTC;