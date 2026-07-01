import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, Trash2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useMeetings } from '../hooks/useMeetings.js';
import useAuthStore from '../store/useAuthStore.js';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

/**
 * MeetingDetails page - View and manage individual meeting
 */
const MeetingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const { meeting, isLoading, updateMeeting, deleteMeeting } = useMeetings();

  // Fetch meeting details
  useEffect(() => {
    // The useMeetings hook should handle fetching the specific meeting
    // For now, we'll rely on the hook's internal logic
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateMeeting(id, { status: newStatus });
      toast.success(`Meeting status updated to ${newStatus}`);
      setStatusMenuOpen(false);
    } catch {
      toast.error('Failed to update meeting status');
    }
  };

  // Handle delete meeting
  const handleDeleteMeeting = async () => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteMeeting(id);
        toast.success('Meeting deleted successfully');
        navigate('/meetings');
      } catch {
        toast.error('Failed to delete meeting');
      }
    }
  };

  // Handle join meeting
  const handleJoinMeeting = () => {
    navigate(`/meeting/${meeting?.meetingCode}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meeting Details"
          subtitle="Loading meeting information..."
          backButton
          onBack={() => navigate('/meetings')}
        />
        <LoadingSpinner size="lg" text="Loading meeting details..." />
      </div>
    );
  }

  // Error state
  if (!meeting) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meeting Details"
          subtitle="Meeting not found"
          backButton
          onBack={() => navigate('/meetings')}
        />
        <Card glass>
          <CardBody>
            <EmptyState
              type="default"
              title="Meeting not found"
              description="The meeting you're looking for doesn't exist or you don't have access to it."
              action={
                <Button variant="primary" onClick={() => navigate('/meetings')}>
                  Back to Meetings
                </Button>
              }
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  const isHost = meeting.host?._id === user?.id;

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
        title={meeting.title}
        subtitle={`Hosted by ${meeting.host?.fullName || 'Unknown'}`}
        backButton
        onBack={() => navigate('/meetings')}
        action={
          isHost && (
            <div className="flex items-center space-x-2">
              <Button variant="primary" onClick={handleJoinMeeting}>
                <Video size={16} className="mr-2" />
                Join Meeting
              </Button>
              <Button variant="danger" onClick={handleDeleteMeeting}>
                <Trash2 size={16} />
              </Button>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card glass>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                <p className="text-zinc-400">
                  {meeting.description || 'No description provided'}
                </p>
              </div>

              <div className="flex items-center space-x-4 text-sm text-zinc-400 pt-4 border-t border-zinc-800">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{new Date(meeting.scheduledFor).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{new Date(meeting.scheduledFor).toLocaleTimeString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock size={16} />
                  <span>{meeting.duration} minutes</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card glass>
            <CardBody>
              <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
              {isHost ? (
                <div className="relative">
                  <button
                    onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                    className="w-full flex items-center justify-between p-3 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white hover:bg-zinc-800 transition"
                  >
                    <span className={`text-sm px-3 py-1 rounded-full capitalize ${getStatusColor(meeting.status)}`}>
                      {meeting.status}
                    </span>
                    <ChevronDown size={16} className="text-zinc-400" />
                  </button>
                  {statusMenuOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-10 overflow-hidden">
                      {['scheduled', 'ongoing', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(status)}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 capitalize"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <span className={`text-sm px-3 py-1 rounded-full capitalize ${getStatusColor(meeting.status)}`}>
                  {meeting.status}
                </span>
              )}
            </CardBody>
          </Card>

          {/* Meeting Code Card */}
          <Card glass>
            <CardBody>
              <h3 className="text-lg font-semibold text-white mb-2">Meeting Code</h3>
              <p className="text-2xl font-mono font-bold text-violet-400">
                {meeting.meetingCode}
              </p>
            </CardBody>
          </Card>

          {/* Participants Card */}
          <Card glass>
            <CardBody>
              <h3 className="text-lg font-semibold text-white mb-4">Participants</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-semibold">
                    {meeting.host?.fullName?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <p className="text-white text-sm">{meeting.host?.fullName || 'Unknown'}</p>
                    <p className="text-zinc-500 text-xs">Host</p>
                  </div>
                </div>
                {meeting.participants?.map((participant) => (
                  <div key={participant._id} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-white text-sm font-semibold">
                      {participant.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-white text-sm">{participant.fullName}</p>
                      <p className="text-zinc-500 text-xs">Participant</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;