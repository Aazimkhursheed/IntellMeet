import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Video, Mic, AlertCircle, Loader2, ArrowRight, VideoOff, MicOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDevices } from '../hooks/useDevices.js';
import { useMeetingStore } from '../store/useMeetingStore.js';
import { socketService } from '../services/socketService.js';
import DeviceSelector from '../components/meeting/DeviceSelector.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

/**
 * MeetingLobby page - Pre-meeting preview and device selection
 */
const MeetingLobby = () => {
  const { meetingCode } = useParams();
  const navigate = useNavigate();
  
  const {
    devices,
    selectedCamera,
    selectedMicrophone,
    setSelectedCamera,
    setSelectedMicrophone,
    permissions,
    error: deviceError,
    getMediaStream,
    stopStream,
  } = useDevices();

  const {
    setLocalStream,
    isVideoEnabled,
    isAudioEnabled,
    setMeetingInfo,
    resetMeeting,
  } = useMeetingStore();

  const [previewStream, setPreviewStream] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetingInfo, setMeetingInfoState] = useState(null);
  const [isValidating, setIsValidating] = useState(true);
  const previewStreamRef = useRef(null);

  // Validate meeting code and fetch meeting details
  useEffect(() => {
    const validateMeeting = async () => {
      try {
        setIsValidating(true);
        setError(null);

        // In a real app, you would fetch meeting details from the API
        // For now, we'll simulate validation
        // const response = await apiClient.get(`/meetings/validate/${meetingCode}`);
        
        // Simulated validation - accept any code format XXX-XXX-XXX
        const codePattern = /^\d{3}-\d{3}-\d{3}$/;
        if (!codePattern.test(meetingCode)) {
          throw new Error('Invalid meeting code format');
        }

        // Simulate meeting info
        setMeetingInfoState({
          id: meetingCode,
          code: meetingCode,
          title: 'Team Meeting',
          host: { fullName: 'Meeting Host' },
        });
      } catch (err) {
        console.error('Error validating meeting:', err);
        setError(err.message || 'Invalid meeting code');
        toast.error('Invalid meeting code');
      } finally {
        setIsValidating(false);
      }
    };

    if (meetingCode) {
      validateMeeting();
    }
  }, [meetingCode]);

  // Initialize camera and microphone preview
  useEffect(() => {
    const initializePreview = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get media stream for preview
        const stream = await getMediaStream(true, true);
        
        if (stream) {
          setPreviewStream(stream);
          previewStreamRef.current = stream;
        } else {
          setError(deviceError || 'Failed to access camera and microphone');
        }
      } catch (err) {
        console.error('Error initializing preview:', err);
        setError('Failed to initialize media devices');
      } finally {
        setIsLoading(false);
      }
    };

    initializePreview();

    // Cleanup on unmount
    return () => {
      if (previewStreamRef.current) {
        stopStream(previewStreamRef.current);
      }
    };
  }, [getMediaStream, stopStream, deviceError]);

  // Update preview when devices change
  useEffect(() => {
    const updatePreview = async () => {
      if (previewStreamRef.current) {
        stopStream(previewStreamRef.current);
      }

      const stream = await getMediaStream(true, true);
      if (stream) {
        setPreviewStream(stream);
        previewStreamRef.current = stream;
      }
    };

    if (!isLoading && selectedCamera && selectedMicrophone) {
      updatePreview();
    }
  }, [selectedCamera, selectedMicrophone, isLoading, getMediaStream, stopStream]);

  const handleJoinMeeting = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Connect to socket if not already connected
      if (!socketService.socket?.connected) {
        socketService.connect();
      }

      // Set the preview stream as the local stream
      if (previewStream) {
        setLocalStream(previewStream);
      }

      // Set meeting info
      setMeetingInfo(meetingCode, meetingCode, meetingInfo?.title || 'Meeting', false);

      // Join the meeting room via socket
      socketService.joinMeeting(meetingCode);

      // Navigate to meeting room
      navigate(`/meeting/${meetingCode}`);
      
      toast.success('Joined meeting successfully');
    } catch (err) {
      console.error('Error joining meeting:', err);
      setError('Failed to join meeting');
      toast.error('Failed to join meeting');
      setIsLoading(false);
    }
  }, [meetingCode, meetingInfo, previewStream, setLocalStream, setMeetingInfo, navigate]);

  const handleBack = () => {
    if (previewStream) {
      stopStream(previewStream);
    }
    resetMeeting();
    navigate(-1);
  };

  // Loading state
  if (isValidating) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-zinc-400 text-sm">Validating meeting code...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !meetingInfo) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center space-y-4">
          <AlertCircle size={48} className="text-red-400 mx-auto" />
          <h2 className="text-xl font-bold text-white">Invalid Meeting Code</h2>
          <p className="text-zinc-400 text-sm">{error}</p>
          <button
            onClick={handleBack}
            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="text-zinc-400 hover:text-white transition text-sm font-medium"
          >
            ← Back
          </button>
          <h1 className="text-lg font-bold text-white">Meeting Lobby</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Video preview */}
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden aspect-video relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <LoadingSpinner />
                </div>
              ) : previewStream ? (
                <video
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  ref={(video) => {
                    if (video) {
                      video.srcObject = previewStream;
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                  <div className="text-center space-y-3">
                    <AlertCircle size={48} className="text-zinc-600 mx-auto" />
                    <p className="text-zinc-400 text-sm">Camera not available</p>
                  </div>
                </div>
              )}

              {/* Status indicators */}
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                {!isVideoEnabled && (
                  <div className="bg-red-500/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-white flex items-center space-x-1">
                    <VideoOff size={12} />
                    <span>Camera Off</span>
                  </div>
                )}
                {!isAudioEnabled && (
                  <div className="bg-red-500/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-white flex items-center space-x-1">
                    <MicOff size={12} />
                    <span>Mic Off</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => useMeetingStore.getState().toggleVideo()}
                className={`p-3 rounded-full transition ${
                  isVideoEnabled
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
              <button
                onClick={() => useMeetingStore.getState().toggleAudio()}
                className={`p-3 rounded-full transition ${
                  isAudioEnabled
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
            </div>
          </div>

          {/* Right: Meeting info and device selection */}
          <div className="space-y-6">
            {/* Meeting info */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {meetingInfo?.title || 'Meeting'}
                </h2>
                <p className="text-zinc-400 text-sm">
                  Host: {meetingInfo?.host?.fullName || 'Unknown'}
                </p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs text-zinc-500 mb-1">Meeting Code</p>
                <p className="text-lg font-mono font-bold text-violet-400">
                  {meetingCode}
                </p>
              </div>
            </div>

            {/* Device selection */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Devices</h3>
              <DeviceSelector
                devices={devices}
                selectedCamera={selectedCamera}
                selectedMicrophone={selectedMicrophone}
                onCameraChange={setSelectedCamera}
                onMicrophoneChange={setSelectedMicrophone}
                permissions={permissions}
                errors={{ camera: deviceError, microphone: deviceError }}
              />
            </div>

            {/* Join button */}
            <button
              onClick={handleJoinMeeting}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-violet-600/20"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join Meeting</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingLobby;