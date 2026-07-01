import React from 'react';
import { X } from 'lucide-react';
import { CardBody } from './Card.jsx';

/**
 * Modal component - Overlay dialog
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className={`relative w-full ${sizeClasses[size]} bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl`}>
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Body */}
        <CardBody className="max-h-[70vh] overflow-y-auto">
          {children}
        </CardBody>
      </div>
    </div>
  );
};

export default Modal;