import React from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Copy, Users, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMeetingStore } from '../../store/useMeetingStore.js';

/**
 * MeetingControls component - Bottom control bar for meeting actions
 */
const MeetingControls = ({ onLeaveMeeting }) => {
  const {
    isVideoEnabled,
    isAudioEnabled,
    isScreenSharing,
    toggleVideo,
    toggleAudio,
    toggleScreenShare,
    meetingCode,
    participantCount,
  } = useMeetingStore();

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

  const ControlButton = ({ onClick, icon: Icon, isActive, title, variant = 'default' }) => {
    const baseClasses = 'p-4 rounded-full transition-all duration-200 flex items-center justify-center';
    const variantClasses = {
      default: isActive 
        ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700' 
        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]}`}
        title={title}
      >
        <Icon size={20} />
      </button>
    );
  };

  return (
    <div className="bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Left: Participant count */}
        <div className="flex items-center space-x-2 text-zinc-400">
          <Users size={18} />
          <span className="text-sm font-medium">{participantCount}</span>
        </div>

        {/* Center: Main controls */}
        <div className="flex items-center space-x-3">
          <ControlButton
            onClick={toggleAudio}
            icon={isAudioEnabled ? Mic : MicOff}
            isActive={isAudioEnabled}
            title={isAudioEnabled ? 'Mute microphone' : 'Unmute microphone'}
          />

          <ControlButton
            onClick={toggleVideo}
            icon={isVideoEnabled ? Video : VideoOff}
            isActive={isVideoEnabled}
            title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
          />

          <ControlButton
            onClick={handleCopyMeetingCode}
            icon={Copy}
            isActive={true}
            title="Copy meeting code"
          />

          <ControlButton
            onClick={handleCopyMeetingLink}
            icon={Copy}
            isActive={true}
            title="Copy meeting link"
          />

          <ControlButton
            onClick={toggleScreenShare}
            icon={Monitor}
            isActive={!isScreenSharing}
            title={isScreenSharing ? 'Stop screen sharing' : 'Share screen'}
          />

          <ControlButton
            onClick={onLeaveMeeting}
            icon={PhoneOff}
            isActive={true}
            title="Leave meeting"
            variant="danger"
          />
        </div>

        {/* Right: Spacer for balance */}
        <div className="w-20" />
      </div>
    </div>
  );
};

export default MeetingControls;