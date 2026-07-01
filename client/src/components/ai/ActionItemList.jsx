import React from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * ActionItemList component - Display and manage action items
 */
const ActionItemList = ({ actionItems, isLoading, onUpdate, onDelete }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={14} className="text-red-400" />;
      case 'medium':
        return <Clock size={14} className="text-amber-400" />;
      case 'low':
        return <Circle size={14} className="text-emerald-400" />;
      default:
        return <Circle size={14} className="text-zinc-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'in_progress':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'pending':
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await onUpdate(itemId, { status: newStatus });
      toast.success('Action item updated');
    } catch {
      toast.error('Failed to update action item');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this action item?')) {
      return;
    }

    try {
      await onDelete(itemId);
      toast.success('Action item deleted');
    } catch {
      toast.error('Failed to delete action item');
    }
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-zinc-800 rounded w-1/2"></div>
          <div className="h-16 bg-zinc-800 rounded"></div>
          <div className="h-16 bg-zinc-800 rounded"></div>
          <div className="h-16 bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!actionItems || actionItems.length === 0) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6">
        <div className="text-center py-8">
          <CheckCircle2 size={48} className="text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">No action items yet</p>
          <p className="text-zinc-500 text-xs mt-1">Action items will appear here after meeting summary is generated</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">Action Items</h3>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
          {actionItems.length} {actionItems.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="space-y-3">
        {actionItems.map((item) => (
          <div
            key={item._id}
            className={`p-4 rounded-lg border ${
              item.status === 'completed'
                ? 'bg-zinc-800/30 border-zinc-700/50'
                : 'bg-zinc-800/50 border-zinc-700'
            }`}
          >
            <div className="flex items-start justify-between space-x-3">
              <div className="flex-grow space-y-2">
                {/* Task */}
                <div className="flex items-start space-x-2">
                  {item.status === 'completed' ? (
                    <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle size={18} className="text-zinc-500 mt-0.5 flex-shrink-0" />
                  )}
                  <p className={`text-sm ${item.status === 'completed' ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                    {item.task}
                  </p>
                </div>

                {/* Meta info */}
                <div className="flex items-center space-x-3 pl-6">
                  {/* Priority */}
                  <div className="flex items-center space-x-1">
                    {getPriorityIcon(item.priority)}
                    <span className="text-xs text-zinc-400 capitalize">{item.priority}</span>
                  </div>

                  {/* Assignee */}
                  {item.assignee?.userName && (
                    <span className="text-xs text-zinc-500">
                      {item.assignee.userName}
                    </span>
                  )}

                  {/* Due date */}
                  {item.dueDate && (
                    <span className="text-xs text-zinc-500 flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                    </span>
                  )}
                </div>

                {/* Status badge */}
                <div className="pl-6">
                  <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {item.status !== 'completed' && (
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleStatusChange(item._id, 'completed')}
                    className="p-1.5 hover:bg-zinc-700 rounded transition text-zinc-400 hover:text-emerald-400"
                    title="Mark as completed"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-1.5 hover:bg-zinc-700 rounded transition text-zinc-400 hover:text-red-400"
                    title="Delete action item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionItemList;