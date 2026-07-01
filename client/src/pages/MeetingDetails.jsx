import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, Users, Calendar, Clock, Copy, ExternalLink, UserPlus, MoreVertical, CheckCircle2, XCircle, PlayCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody, CardHeader } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useMeetings } from '../hooks/useMeetings.js';
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';

const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { meetings, isLoading, error, updateMeeting, deleteMeeting } = useMeetings();

  const meeting = meetings?.find((m) => m._id === id);

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && !meeting) {
      toast.error('Meeting not found');
      navigate('/meetings');
    }
  }, [meeting, isLoading, navigate]);

  const isHost = meeting?.host?._id === user?.id;

  const handleStatusUpdate = async (newStatus) => {
    if (!isHost) {
      toast.error('Only the host can update meeting status');
      return;
    }

    setIsUpdating(true);
    try {
      await updateMeeting(meeting._id, { status: newStatus });
      toast.success(`Meeting marked as ${newStatus}`);
      setShowStatusMenu(false);
    } catch (error) {
      toast.error('Failed to update meeting status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteMeeting = async () => {
    if (!isHost) {
      toast.error('Only the host can delete the meeting');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${meeting.title}"?`)) {
      try {
        await deleteMeeting(meeting._id);
        toast.success('Meeting deleted successfully');
        navigate('/meetings');
      } catch (error) {
        toast.error('Failed to delete meeting');
      }
    }
  };

  const copyMeetingCode = () => {
    if (meeting?.meetingCode) {
      navigator.clipboard.writeText(meeting.meetingCode);
      toast.success('Meeting code copied to clipboard');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meeting Details"
          subtitle="View and manage meeting information"
          action={
            <Button variant="ghost" onClick={() => navigate('/meetings')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Meetings
            </Button>
          }
        />
        <LoadingSpinner size="lg" text="Loading meeting details..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meeting Details"
          subtitle="View and manage meeting information"
          action={
            <Button variant="ghost" onClick={() => navigate('/meetings')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Meetings
            </Button>
          }
        />
        <Card glass>
          <CardBody>
            <EmptyState
              type="default"
              title="Failed to load meeting"
              description={error.response?.data?.message || error.message || 'Unable to fetch meeting details. Please try again later.'}
              action={
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              }
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  // Meeting not found
  if (!meeting) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meeting Details"
          subtitle="View and manage meeting information"
          action={
            <Button variant="ghost" onClick={() => navigate('/meetings')}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Meetings
            </Button>
          }
        />
        <Card glass>
          <CardBody>
            <EmptyState
              type="meetings"
              title="Meeting not found"
              description="The meeting you're looking for doesn't exist or you don't have access to it."
              action={
                <Button variant="primary" onClick={() => navigate('/meetings')}>
                  View All Meetings
                </Button>
              }
            />
          </CardBody>
        </Card>
      </div>
    );
  }

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
    <div className="space-y-6">
      <PageHeader
        title="Meeting Details"
        subtitle="View and manage meeting information"
        action={
          <Button variant="ghost" onClick={() => navigate('/meetings')}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Meetings
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Meeting Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <CardBody className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">{meeting.title}</h2>
                  <p className="text-zinc-400">{meeting.description || 'No description provided'}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium capitalize"
                    disabled={!isHost}
                  >
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                  </button>
                  {isHost && showStatusMenu && (
                    <div className="absolute right-0 top-12 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-10 min-w-[180px]">
                      <button
                        onClick={() => handleStatusUpdate('scheduled')}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 flex items-center space-x-2"
                      >
                        <CheckCircle2 size={14} className="text-violet-400" />
                        <span>Scheduled</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('ongoing')}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 flex items-center space-x-2"
                      >
                        <PlayCircle size={14} className="text-blue-400" />
                        <span>Ongoing</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('completed')}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 flex items-center space-x-2"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>Completed</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate('cancelled')}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 flex items-center space-x-2"
                      >
                        <XCircle size={14} className="text-red-400" />
                        <span>Cancelled</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                  <Calendar size={20} className="text-violet-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Date</p>
                    <p className="text-sm text-white font-medium">{formatDate(meeting.scheduledFor)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                  <Clock size={20} className="text-violet-400" />
                  <div>
                    <p className="text-xs text-zinc-500">Time & Duration</p>
                    <p className="text-sm text-white font-medium">
                      {formatTime(meeting.scheduledFor)} • {meeting.duration} min
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                <Users size={20} className="text-violet-400" />
                <div className="flex-1">
                  <p className="text-xs text-zinc-500">Participants</p>
                  <p className="text-sm text-white font-medium">
                    {meeting.participants?.length || 0} participant{(meeting.participants?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl">
                <div className="flex-1">
                  <p className="text-xs text-zinc-500 mb-1">Meeting Code</p>
                  <p className="text-sm text-white font-mono font-medium">{meeting.meetingCode}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={copyMeetingCode}>
                  <Copy size={14} className="mr-2" />
                  Copy
                </Button>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-zinc-800/50">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  onClick={() => navigate(`/meeting/${meeting.meetingCode}`)}
                >
                  <Video size={16} className="mr-2" />
                  Join Meeting
                </Button>
                {isHost && (
                  <Button variant="danger" size="sm" onClick={handleDeleteMeeting}>
                    Delete Meeting
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - Host & Participants */}
        <div className="space-y-6">
          {/* Host Info */}
          <Card glass>
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">Host</h3>
            </CardHeader>
            <CardBody>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-violet-600/10 border-2 border-violet-500/20 rounded-full flex items-center justify-center">
                  <Users size={24} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{meeting.host?.fullName || 'Unknown'}</p>
                  <p className="text-xs text-zinc-500">{meeting.host?.email || ''}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Participants */}
          <Card glass>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Participants</h3>
                {isHost && (
                  <Button variant="ghost" size="sm">
                    <UserPlus size={14} className="mr-1" />
                    Add
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody>
              {meeting.participants && meeting.participants.length > 0 ? (
                <div className="space-y-3">
                  {meeting.participants.map((participant) => (
                    <div
                      key={participant._id}
                      className="flex items-center space-x-3 p-3 bg-zinc-950/60 border border-zinc-800/40 rounded-xl"
                    >
                      <div className="w-10 h-10 bg-violet-600/10 border-2 border-violet-500/20 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-violet-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{participant.fullName}</p>
                        <p className="text-xs text-zinc-500">{participant.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  type="users"
                  title="No participants yet"
                  description="Participants will appear here once they join the meeting."
                />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;