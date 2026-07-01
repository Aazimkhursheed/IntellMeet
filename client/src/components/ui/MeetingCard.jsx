import React from 'react';
import { Calendar, Clock, Users, Video, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Card, CardBody } from './Card.jsx';
import Button from './Button.jsx';

const MeetingCard = ({ meeting, onEdit, onDelete, onJoin }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const statusColors = {
    scheduled: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    ongoing: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    completed: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-400',
    cancelled: 'bg-red-500/10 border-red-500/20 text-red-400',
  };

  const isHost = meeting.host?._id === meeting.currentUser?._id;

  return (
    <Card glass>
      <CardBody className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">{meeting.title}</h3>
            {meeting.description && (
              <p className="text-sm text-zinc-400 line-clamp-2">{meeting.description}</p>
            )}
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full border ${statusColors[meeting.status] || statusColors.scheduled}`}
          >
            {meeting.status}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-sm text-zinc-400 pt-2 border-t border-zinc-800/50">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{formatDate(meeting.scheduledFor)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{formatTime(meeting.scheduledFor)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users size={14} />
            <span>{meeting.participants?.length || 0}</span>
          </div>
          <span>{meeting.duration} min</span>
        </div>

        <div className="flex space-x-2 pt-2">
          {meeting.status === 'scheduled' && (
            <Button variant="primary" size="sm" className="flex-1" onClick={() => onJoin?.(meeting)}>
              <Video size={14} className="mr-1" />
              Join
            </Button>
          )}
          {isHost && (
            <>
              <Button variant="outline" size="sm" onClick={() => onEdit?.(meeting)}>
                <Edit size={14} />
              </Button>
              <Button variant="danger" size="sm" onClick={() => onDelete?.(meeting)}>
                <Trash2 size={14} />
              </Button>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MeetingCard;
