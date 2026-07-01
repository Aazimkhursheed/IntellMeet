import React from 'react';
import { Video, Mic, AlertCircle } from 'lucide-react';

/**
 * DeviceSelector component - Camera and microphone selection
 */
const DeviceSelector = ({ 
  devices, 
  selectedCamera, 
  selectedMicrophone, 
  onCameraChange, 
  onMicrophoneChange,
  permissions,
  errors 
}) => {
  return (
    <div className="space-y-4">
      {/* Camera Selection */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-zinc-300">
          <Video size={16} />
          <span>Camera</span>
        </label>
        
        {permissions.camera === 'denied' ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-300">
              Camera access denied. Please enable camera permissions in your browser settings.
            </div>
          </div>
        ) : devices.cameras.length > 0 ? (
          <select
            value={selectedCamera}
            onChange={(e) => onCameraChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            {devices.cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-xs text-zinc-500 italic">No cameras detected</div>
        )}
      </div>

      {/* Microphone Selection */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-zinc-300">
          <Mic size={16} />
          <span>Microphone</span>
        </label>
        
        {permissions.microphone === 'denied' ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-red-300">
              Microphone access denied. Please enable microphone permissions in your browser settings.
            </div>
          </div>
        ) : devices.microphones.length > 0 ? (
          <select
            value={selectedMicrophone}
            onChange={(e) => onMicrophoneChange(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            {devices.microphones.map((mic) => (
              <option key={mic.deviceId} value={mic.deviceId}>
                {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
              </option>
            ))}
          </select>
        ) : (
          <div className="text-xs text-zinc-500 italic">No microphones detected</div>
        )}
      </div>

      {/* Error messages */}
      {(errors.camera || errors.microphone) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start space-x-2">
          <AlertCircle size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-amber-300">
            {errors.camera || errors.microphone}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceSelector;