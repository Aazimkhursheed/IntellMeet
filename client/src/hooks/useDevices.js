import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to manage media devices (camera, microphone)
 */
export const useDevices = () => {
  const [devices, setDevices] = useState({
    cameras: [],
    microphones: [],
    speakers: [],
  });
  const [selectedCamera, setSelectedCamera] = useState('');
  const [selectedMicrophone, setSelectedMicrophone] = useState('');
  const [permissions, setPermissions] = useState({
    camera: 'prompt', // 'prompt', 'granted', 'denied'
    microphone: 'prompt',
  });
  const [error, setError] = useState(null);

  /**
   * Enumerate available devices
   */
  const enumerateDevices = useCallback(async () => {
    try {
      // Request permissions first to get device labels
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          // Immediately stop the stream - we just needed permissions
          stream.getTracks().forEach(track => track.stop());
        })
        .catch(err => {
          console.error('Permission request error:', err);
        });

      const deviceList = await navigator.mediaDevices.enumerateDevices();
      
      const cameras = deviceList.filter(device => device.kind === 'videoinput');
      const microphones = deviceList.filter(device => device.kind === 'audioinput');
      const speakers = deviceList.filter(device => device.kind === 'audiooutput');

      setDevices({ cameras, microphones, speakers });

      // Set default devices if not already set
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId);
      }
      if (microphones.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(microphones[0].deviceId);
      }

      return { cameras, microphones, speakers };
    } catch (err) {
      console.error('Error enumerating devices:', err);
      setError('Failed to enumerate devices');
      return { cameras: [], microphones: [], speakers: [] };
    }
  }, [selectedCamera, selectedMicrophone]);

  /**
   * Check device permissions
   */
  const checkPermissions = useCallback(async () => {
    try {
      // Check camera permission
      if (navigator.permissions) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' });

        setPermissions({
          camera: cameraPermission.state,
          microphone: microphonePermission.state,
        });

        // Listen for permission changes
        cameraPermission.onchange = () => {
          setPermissions(prev => ({ ...prev, camera: cameraPermission.state }));
        };
        microphonePermission.onchange = () => {
          setPermissions(prev => ({ ...prev, microphone: microphonePermission.state }));
        };
      }
    } catch (err) {
      console.error('Error checking permissions:', err);
    }
  }, []);

  /**
   * Get media stream with selected devices
   */
  const getMediaStream = useCallback(async (video = true, audio = true) => {
    setError(null);
    
    try {
      const constraints = {
        video: video ? {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        } : false,
        audio: audio ? {
          deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Update permissions
      if (video) {
        setPermissions(prev => ({ ...prev, camera: 'granted' }));
      }
      if (audio) {
        setPermissions(prev => ({ ...prev, microphone: 'granted' }));
      }

      return stream;
    } catch (err) {
      console.error('Error getting media stream:', err);
      
      // Handle specific errors
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        if (err.constraint === 'video' || (!audio && video)) {
          setPermissions(prev => ({ ...prev, camera: 'denied' }));
          setError('Camera permission denied. Please enable camera access in your browser settings.');
        } else if (err.constraint === 'audio' || (!video && audio)) {
          setPermissions(prev => ({ ...prev, microphone: 'denied' }));
          setError('Microphone permission denied. Please enable microphone access in your browser settings.');
        } else {
          setError('Media permission denied. Please enable camera and microphone access.');
        }
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        if (err.constraint === 'video' || (!audio && video)) {
          setError('No camera found. Please connect a camera and try again.');
        } else if (err.constraint === 'audio' || (!video && audio)) {
          setError('No microphone found. Please connect a microphone and try again.');
        } else {
          setError('No media devices found. Please connect a camera and microphone.');
        }
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Cannot access media device. It may be in use by another application.');
      } else {
        setError(`Failed to access media devices: ${err.message}`);
      }

      return null;
    }
  }, [selectedCamera, selectedMicrophone]);

  /**
   * Stop a media stream
   */
  const stopStream = useCallback((stream) => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }, []);

  // Initialize devices on mount
  useEffect(() => {
    enumerateDevices();
    checkPermissions();

    // Listen for device changes
    const handleDeviceChange = () => {
      enumerateDevices();
    };

    navigator.mediaDevices?.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices?.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [enumerateDevices, checkPermissions]);

  return {
    devices,
    selectedCamera,
    selectedMicrophone,
    setSelectedCamera,
    setSelectedMicrophone,
    permissions,
    error,
    enumerateDevices,
    getMediaStream,
    stopStream,
    checkPermissions,
  };
};

export default useDevices;