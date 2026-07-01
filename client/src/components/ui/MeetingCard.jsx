import React from 'react';
import { Calendar, Clock, Users, Video } from 'lucide-react';
import { Card, CardBody } from './Card.jsx';
import Button from './Button.jsx';

/**
 * MeetingCard component - Display meeting information in a card
 */
const MeetingCard = ({ meeting, onJoin, onViewDetails }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-violet-500/10 border border-violet-500/20 text-violet-400';
      case 'ongoing':
        return 'bg-blue-500/10 border border-blue-500/20 text-blue-400';
      case 'completed':
        return 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400';
      case 'cancelled':
        return 'bg-red-500/10 border border-red-500/20 text-red-400';
      default:
        return 'bg-zinc-500/10 border border-zinc-500/20 text-zinc-400';
    }
  };

  return (
    <Card glass className="hover:border-zinc-700 transition cursor-pointer">
      <CardBody className="space-y-4">
        {/* Meeting Header */}
        <div>
          <h3 className="font-semibold text-white mb-1 line-clamp-1">{meeting.title}</h3>
          <p className="text-sm text-zinc-400 line-clamp-2">
            {meeting.description || 'No description'}
          </p>
        </div>

        {/* Status Badge */}
        <div>
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(meeting.status)}`}>
            {meeting.status}
          </span>
        </div>

        {/* Meeting Details */}
        <div className="flex items-center space-x-4 text-sm text-zinc-400">
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
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => onJoin?.(meeting)}
          >
            <Video size={14} className="mr-1" />
            Join
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails?.(meeting)}
          >
            Details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default MeetingCard;