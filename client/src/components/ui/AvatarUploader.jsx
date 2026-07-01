import React, { useRef } from 'react';
import { Camera } from 'lucide-react';
import { useProfile } from '../../hooks/useProfile.js';

const AvatarUploader = ({ onUploadSuccess }) => {
  const { uploadAvatar, isUploading } = useProfile();
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      await uploadAvatar(file);
      onUploadSuccess?.();
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={handleClick}
        disabled={isUploading}
        className="absolute bottom-0 right-0 p-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 rounded-xl text-white transition shadow-lg"
      >
        {isUploading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Camera size={16} />
        )}
      </button>
    </div>
  );
};

export default AvatarUploader;