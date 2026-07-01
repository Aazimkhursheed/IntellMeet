import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Calendar, Clock, Users, Video, X, ChevronRight, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useMeetings } from '../hooks/useMeetings.js';
import { useAuthStore } from '../store/useAuthStore.js';
import toast from 'react-hot-toast';

const Meetings = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const {
    meetings,
    isLoading,
    error,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    isCreating,
  } = useMeetings();

  // Filter meetings based on search and status
  const filteredMeetings = meetings?.filter((meeting) => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  // Format time for display
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Handle create meeting
  const handleCreateMeeting = () => {
    // For now, show a toast - in future this will open a modal
    toast.info('Create meeting modal coming soon!');
  };

  // Handle delete meeting
  const handleDeleteMeeting = async (meetingId, meetingTitle) => {
    if (window.confirm(`Are you sure you want to delete "${meetingTitle}"?`)) {
      try {
        await deleteMeeting(meetingId);
        toast.success('Meeting deleted successfully');
      } catch (error) {
        toast.error('Failed to delete meeting');
      }
    }
    setMenuOpenId(null);
  };

  // Handle join meeting
  const handleJoinMeeting = (meetingId) => {
    navigate(`/meetings/${meetingId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meetings"
          subtitle="Manage and view all your meetings"
          action={
            <Button variant="primary">
              <Plus size={16} className="mr-2" />
              Create Meeting
            </Button>
          }
        />
        <LoadingSpinner size="lg" text="Loading meetings..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Meetings"
          subtitle="Manage and view all your meetings"
          action={
            <Button variant="primary">
              <Plus size={16} className="mr-2" />
              Create Meeting
            </Button>
          }
        />
        <Card glass>
          <CardBody>
            <EmptyState
              type="default"
              title="Failed to load meetings"
              description={error.response?.data?.message || error.message || 'Unable to fetch meetings. Please try again later.'}
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings"
        subtitle="Manage and view all your meetings"
        action={
          <Button variant="primary" onClick={handleCreateMeeting}>
            <Plus size={16} className="mr-2" />
            Create Meeting
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition"
          />
        </div>
        <Button
          variant="secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card glass>
          <CardBody>
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-zinc-400">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="all">All Meetings</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Meeting Cards */}
      {filteredMeetings.length === 0 ? (
        <Card glass>
          <CardBody>
            <EmptyState
              type="meetings"
              title={searchQuery ? "No meetings found" : "No meetings yet"}
              description={
                searchQuery
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "You haven't created or joined any meetings yet. Create your first meeting to get started."
              }
              action={
                !searchQuery && (
                  <Button variant="primary" onClick={handleCreateMeeting}>
                    <Plus size={16} className="mr-2" />
                    Create Meeting
                  </Button>
                )
              }
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMeetings.map((meeting) => {
            const isHost = meeting.host?._id === user?.id;
            const isMenuOpen = menuOpenId === meeting._id;

            return (
              <Card key={meeting._id} glass className="relative">
                <CardBody className="space-y-4">
                  {/* Meeting Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{meeting.title}</h3>
                      <p className="text-sm text-zinc-400 line-clamp-2">
                        {meeting.description || 'No description'}
                      </p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenId(isMenuOpen ? null : meeting._id)}
                        className="p-1 hover:bg-zinc-800 rounded-lg transition"
                      >
                        <MoreVertical size={16} className="text-zinc-400" />
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 top-8 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl z-10 min-w-[160px]">
                          <button
                            onClick={() => handleJoinMeeting(meeting._id)}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 flex items-center space-x-2"
                          >
                            <ChevronRight size={14} />
                            <span>View Details</span>
                          </button>
                          {isHost && (
                            <>
                              <button
                                onClick={() => {
                                  setMenuOpenId(null);
                                  toast.info('Edit meeting coming soon!');
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-white hover:bg-zinc-800 flex items-center space-x-2"
                              >
                                <Edit2 size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteMeeting(meeting._id, meeting.title)}
                                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 flex items-center space-x-2"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full capitalize ${
                        meeting.status === 'scheduled'
                          ? 'bg-violet-500/10 border border-violet-500/20 text-violet-400'
                          : meeting.status === 'ongoing'
                          ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
                          : meeting.status === 'completed'
                          ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/10 border border-red-500/20 text-red-400'
                      }`}
                    >
                      {meeting.status}
                    </span>
                  </div>

                  {/* Meeting Details */}
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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleJoinMeeting(meeting._id)}
                    >
                      <Video size={14} className="mr-1" />
                      Join
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleJoinMeeting(meeting._id)}
                    >
                      Details
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Meetings;