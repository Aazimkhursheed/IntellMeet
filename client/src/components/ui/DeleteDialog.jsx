import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';

const DeleteDialog = ({ isOpen, onClose, onConfirm, title = 'Delete Item', message = 'Are you sure you want to delete this item? This action cannot be undone.' }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-red-600/10 border border-red-500/20 rounded-xl">
            <AlertTriangle size={24} className="text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-zinc-300">{message}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteDialog;
