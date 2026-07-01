import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div
        className={`border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin ${sizes[size]}`}
      />
      <p className="text-zinc-400 text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
