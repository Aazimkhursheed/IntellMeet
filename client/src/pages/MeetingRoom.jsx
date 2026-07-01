import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PhoneOff, Users, Clock, Copy, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMeetingStore } from '../store/useMeetingStore.js';
import { socketService } from '../services/socketService.js';
import { useWebRTC } from '../hooks/useWebRTC.js';
import VideoGrid from '../components/meeting/VideoGrid.jsx';
import MeetingControls from '../components/meeting/MeetingControls.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

/**
 * MeetingRoom page - Main meeting interface
 */
const MeetingRoom = () => {
  const { meetingCode } = useParams();
  const navigate = useNavigate();
  
  const {
    meetingId,
    meetingTitle,
    isHost,
    localStream,
    participants,
    participantCount,
    isInMeeting,
    isLoading,
    setLoading,
    setError,
    addParticipant,
    removeParticipant,
    setParticipants,
    updateDuration,
    resetMeeting,
  } = useMeetingStore();

  const [duration, setDurationState] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const durationIntervalRef = useRef(null);

  // Initialize WebRTC
  const {
    initializePeerConnections,
    closeAllConnections,
    getRemoteStream,
  } = useWebRTC(meetingId, localStream);

  // Update duration timer
  useEffect(() => {
    if (isInMeeting) {
      durationIntervalRef.current = setInterval(() => {
        updateDuration();
        const currentDuration = useMeetingStore.getState().duration;
        setDurationState(currentDuration);
      }, 1000);

      return () => {
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current);
        }
      };
    }
  }, [isInMeeting, updateDuration]);

  // Format duration as HH:MM:SS
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Set up socket event listeners
  useEffect(() => {
    if (!meetingId) return;

    // Listen for participants list
    socketService.onParticipantsList((participantsList) => {
      console.log('Received participants list:', participantsList);
      setParticipants(participantsList);
      
      // Initialize peer connections with existing participants
      setTimeout(() => {
        initializePeerConnections(participantsList);
      }, 1000);
    });

    // Listen for user joined
    socketService.onUserJoined((user) => {
      console.log('User joined:', user);
      addParticipant(user);
      
      // Create peer connection with new participant
      setTimeout(() => {
        initializePeerConnections([user]);
      }, 500);
    });

    // Listen for user left
    socketService.onUserLeft((user) => {
      console.log('User left:', user);
      removeParticipant(user.userId);
    });

    // Listen for participant count updates
    socketService.onParticipantCount((data) => {
      console.log('Participant count:', data.count);
    });

    // Simulate connection established
    setTimeout(() => {
      setIsConnecting(false);
    }, 1500);

    return () => {
      socketService.removeListener('participants-list');
      socketService.removeListener('user-joined');
      socketService.removeListener('user-left');
      socketService.removeListener('participant-count');
    };
  }, [meetingId, addParticipant, removeParticipant, setParticipants, initializePeerConnections]);

  const handleLeaveMeeting = useCallback(() => {
    try {
      // Leave socket room
      socketService.leaveMeeting(meetingId);

      // Close all peer connections
      closeAllConnections();

      // Reset meeting state
      resetMeeting();

      // Navigate back to dashboard
      navigate('/dashboard');
      
      toast.success('Left meeting successfully');
    } catch (err) {
      console.error('Error leaving meeting:', err);
      toast.error('Error leaving meeting');
    }
  }, [meetingId, closeAllConnections, resetMeeting, navigate]);

  const handleCopyMeetingCode = () => {
    if (meetingCode) {
      navigator.clipboard.writeText(meetingCode);
      toast.success('Meeting code copied to clipboard');
    }
  };

  const handleCopyMeetingLink = () => {
    const meetingUrl = `${window.location.origin}/meeting/${meetingCode}`;
    navigator.clipboard.writeText(meetingUrl);
    toast.success('Meeting link copied to clipboard');
  };

  // Loading state
  if (isConnecting || !isInMeeting) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-zinc-400 text-sm">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Meeting info */}
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-white font-semibold text-sm md:text-base">
                {meetingTitle || 'Meeting'}
              </h1>
              <div className="flex items-center space-x-3 text-xs text-zinc-400 mt-0.5">
                <span className="font-mono">{meetingCode}</span>
                {isHost && (
                  <span className="flex items-center space-x-1 text-amber-400">
                    <Crown size={12} />
                    <span>Host</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Center: Timer */}
          <div className="hidden md:flex items-center space-x-2 bg-zinc-800/50 px-4 py-2 rounded-full">
            <Clock size={16} className="text-zinc-400" />
            <span className="text-white font-mono text-sm">
              {formatDuration(duration)}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyMeetingCode}
              className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-white"
              title="Copy meeting code"
            >
              <Copy size={18} />
            </button>
            <div className="flex items-center space-x-1 text-zinc-400 text-sm">
              <Users size={16} />
              <span>{participantCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content: Video grid */}
      <div className="flex-grow overflow-hidden">
        <VideoGrid
          participants={participants}
          localStream={localStream}
          currentUserId={useMeetingStore.getState().user?.id}
        />
      </div>

      {/* Meeting controls */}
      <MeetingControls onLeaveMeeting={handleLeaveMeeting} />
    </div>
  );
};

export default MeetingRoom;