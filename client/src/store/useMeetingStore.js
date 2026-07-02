import { create } from 'zustand';

export const useMeetingStore = create((set, get) => ({
  // Meeting info
  meetingId: null,
  meetingCode: null,
  meetingTitle: null,
  isHost: false,
  meetingStartTime: null,
  duration: 0,

  // Local media
  localStream: null,
  isVideoEnabled: true,
  isAudioEnabled: true,
  isScreenSharing: false,
  screenStream: null,

  // Participants
  participants: [],
  participantCount: 0,

  // UI state
  isInMeeting: false,
  isLoading: false,
  error: null,
  showChat: false,

  // Device settings
  selectedCamera: null,
  selectedMicrophone: null,

  // Actions
  setMeetingInfo: (meetingId, meetingCode, meetingTitle, isHost = false) => {
    set({
      meetingId,
      meetingCode,
      meetingTitle,
      isHost,
      meetingStartTime: new Date(),
      isInMeeting: true,
      duration: 0,
    });
  },

  setLocalStream: (stream) => set({ localStream: stream }),

  setScreenStream: (stream) => set({ screenStream: stream }),

  toggleVideo: () => {
    const { localStream, isVideoEnabled } = get();
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        set({ isVideoEnabled: !isVideoEnabled });
      }
    }
  },

  toggleAudio: () => {
    const { localStream, isAudioEnabled } = get();
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        set({ isAudioEnabled: !isAudioEnabled });
      }
    }
  },

  toggleScreenShare: async () => {
    const { isScreenSharing, screenStream } = get();

    if (!isScreenSharing) {
      try {
        const newScreenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // Handle user clicking "Stop sharing" in browser UI
        newScreenStream.getVideoTracks()[0].onended = () => {
          if (newScreenStream) {
            newScreenStream.getTracks().forEach(track => track.stop());
          }
          set({
            isScreenSharing: false,
            screenStream: null
          });
        };

        set({
          isScreenSharing: true,
          screenStream: newScreenStream
        });

        return newScreenStream;
      } catch (error) {
        console.error('Error starting screen share:', error);
        set({ error: 'Failed to start screen sharing' });
        return null;
      }
    } else {
      // Stop screen sharing
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      set({
        isScreenSharing: false,
        screenStream: null
      });
      return null;
    }
  },

  addParticipant: (participant) => {
    const { participants } = get();
    set({
      participants: [...participants, participant],
      participantCount: participants.length + 1,
    });
  },

  removeParticipant: (userId) => {
    const { participants } = get();
    set({
      participants: participants.filter(p => p.userId !== userId),
      participantCount: Math.max(0, participants.length - 1),
    });
  },

  setParticipants: (participants) => {
    set({
      participants,
      participantCount: participants.length,
    });
  },

  updateParticipantStream: (userId, stream) => {
    const { participants } = get();
    set({
      participants: participants.map(p =>
        p.userId === userId ? { ...p, stream } : p
      ),
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  toggleChat: () => set((state) => ({ showChat: !state.showChat })),

  setSelectedCamera: (cameraId) => set({ selectedCamera: cameraId }),

  setSelectedMicrophone: (micId) => set({ selectedMicrophone: micId }),

  updateDuration: () => {
    const { meetingStartTime } = get();
    if (meetingStartTime) {
      const now = new Date();
      const duration = Math.floor((now - meetingStartTime) / 1000);
      set({ duration });
    }
  },

  resetMeeting: () => {
    const { localStream, screenStream } = get();

    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
    }

    set({
      meetingId: null,
      meetingCode: null,
      meetingTitle: null,
      isHost: false,
      meetingStartTime: null,
      duration: 0,
      localStream: null,
      isVideoEnabled: true,
      isAudioEnabled: true,
      isScreenSharing: false,
      screenStream: null,
      participants: [],
      participantCount: 0,
      isInMeeting: false,
      isLoading: false,
      error: null,
      showChat: false,
      selectedCamera: null,
      selectedMicrophone: null,
    });
  },
}));