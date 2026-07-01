import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white shadow-md shadow-violet-500/20',
    secondary:
      'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 text-white border border-zinc-700',
    danger:
      'bg-red-600/15 hover:bg-red-600/20 active:bg-red-600/30 text-red-400 border border-red-500/25',
    ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-300 hover:text-white',
    outline:
      'bg-transparent border border-violet-500/30 text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/50',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
