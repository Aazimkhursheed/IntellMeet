import React from 'react';
import { User } from 'lucide-react';

/**
 * VideoGrid component - Responsive grid layout for participant videos
 */
const VideoGrid = ({ participants, localStream, currentUserId }) => {
  const allParticipants = [
    {
      userId: currentUserId,
      userName: 'You',
      stream: localStream,
      isLocal: true,
    },
    ...participants.map(p => ({
      ...p,
      isLocal: false,
    })),
  ];

  // Calculate grid layout based on participant count
  const getGridClass = (count) => {
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 9) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  return (
    <div className={`grid ${getGridClass(allParticipants.length)} gap-4 p-4 h-full`}>
      {allParticipants.map((participant) => (
        <ParticipantTile
          key={participant.userId}
          participant={participant}
          stream={participant.stream}
          isLocal={participant.isLocal}
        />
      ))}
    </div>
  );
};

/**
 * ParticipantTile component - Individual video/audio tile
 */
const ParticipantTile = ({ participant, stream, isLocal }) => {
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg aspect-video">
      {/* Video element */}
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Mute local video to prevent echo
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-zinc-900">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center mx-auto">
              <User size={40} className="text-zinc-500" />
            </div>
            <p className="text-zinc-400 text-sm font-medium">
              {participant.userName}
            </p>
            {!stream && (
              <p className="text-zinc-600 text-xs">Camera off</p>
            )}
          </div>
        </div>
      )}

      {/* Participant name overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white text-sm font-medium">
              {participant.userName}
            </span>
            {isLocal && (
              <span className="text-xs bg-violet-600 text-white px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Audio indicator (could be enhanced with actual audio level detection) */}
      <div className="absolute top-3 right-3">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
      </div>
    </div>
  );
};

export default VideoGrid;