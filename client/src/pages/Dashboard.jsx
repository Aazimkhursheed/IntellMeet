import React from 'react';
import { Calendar, Clock, Users, Video, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useMeetings } from '../hooks/useMeetings.js';

const Dashboard = () => {
  const { meetings, isLoading, error } = useMeetings();

  // Calculate statistics from meetings data
  const totalMeetings = meetings?.length || 0;

  const upcomingMeetings = meetings?.filter((meeting) => {
    const meetingDate = new Date(meeting.scheduledFor);
    const now = new Date();
    return meeting.status === 'scheduled' && meetingDate >= now;
  }).sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor)) || [];

  const recentMeetings = meetings?.filter((meeting) => {
    return meeting.status === 'completed';
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];

  // Calculate hours spent from completed meetings
  const totalMinutes = meetings
    ?.filter((meeting) => meeting.status === 'completed')
    .reduce((sum, meeting) => sum + (meeting.duration || 0), 0) || 0;
  const hoursSpent = Math.round(totalMinutes / 60);

  // Calculate unique participants across all meetings
  const uniqueParticipantIds = new Set(
    meetings?.flatMap((meeting) => [
      meeting.host?._id,
      ...(meeting.participants?.map((p) => p._id) || []),
    ]) || []
  );
  const totalParticipants = uniqueParticipantIds.size;

  const stats = [
    { label: 'Total Meetings', value: totalMeetings.toString(), icon: Calendar, color: 'violet' },
    { label: 'Hours Spent', value: `${hoursSpent}h`, icon: Clock, color: 'emerald' },
    { label: 'Participants', value: totalParticipants.toString(), icon: Users, color: 'blue' },
    { label: 'Recordings', value: '0', icon: Video, color: 'amber' },
  ];

  const colorClasses = {
    violet: 'bg-violet-600/10 border-violet-500/20 text-violet-400',
    emerald: 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-600/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-600/10 border-amber-500/20 text-amber-400',
  };

  // Format time from Date object
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format upcoming meeting date
  const formatUpcomingDate = (date) => {
    const meetingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (meetingDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (meetingDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return meetingDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  // Format recent meeting date
  const formatRecentDate = (date) => {
    const meetingDate = new Date(date);
    const now = new Date();
    const diffTime = now - meetingDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return meetingDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Welcome back!"
          subtitle="Here's what's happening with your meetings today."
          action={
            <Button variant="primary">
              <Plus size={16} className="mr-2" />
              New Meeting
            </Button>
          }
        />
        <LoadingSpinner size="lg" text="Loading your meetings..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Welcome back!"
          subtitle="Here's what's happening with your meetings today."
          action={
            <Button variant="primary">
              <Plus size={16} className="mr-2" />
              New Meeting
            </Button>
          }
        />
        <Card glass>
          <CardBody>
            <EmptyState
              type="default"
              title="Failed to load dashboard"
              description={`Error: ${error.response?.data?.message || error.message || 'Unable to fetch meetings. Please try again later.'}`}
              action={
                <Button
                  variant="primary"
                  onClick={() => window.location.reload()}
                >
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
    <div className="space-y-8">
      <PageHeader
        title="Welcome back!"
        subtitle="Here's what's happening with your meetings today."
        action={
          <Button variant="primary">
            <Plus size={16} className="mr-2" />
            New Meeting
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} glass>
              <CardBody className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center ${colorClasses[stat.color]}`}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-400">{stat.label}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <Card glass>
          <CardBody>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Upcoming Meetings</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            {upcomingMeetings.length === 0 ? (
              <EmptyState
                type="meetings"
                title="No upcoming meetings"
                description="You don't have any upcoming meetings scheduled. Create a new meeting to get started."
              />
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl hover:border-zinc-700/50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{meeting.title}</h3>
                      <span className="text-xs px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full">
                        {formatUpcomingDate(meeting.scheduledFor)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-zinc-400">
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
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Meetings */}
        <Card glass>
          <CardBody>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Meetings</h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            {recentMeetings.length === 0 ? (
              <EmptyState
                type="meetings"
                title="No recent meetings"
                description="You haven't completed any meetings yet. Your completed meetings will appear here."
              />
            ) : (
              <div className="space-y-4">
                {recentMeetings.map((meeting) => (
                  <div
                    key={meeting._id}
                    className="p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl hover:border-zinc-700/50 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-white">{meeting.title}</h3>
                      <span className="text-xs px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full capitalize">
                        {meeting.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-zinc-400">
                      <span>{formatRecentDate(meeting.createdAt)}</span>
                      <span>{meeting.duration} min</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card glass>
        <CardBody>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button variant="secondary" className="justify-start">
              <Plus size={18} className="mr-2" />
              Create Meeting
            </Button>
            <Button variant="secondary" className="justify-start">
              <Calendar size={18} className="mr-2" />
              Schedule Meeting
            </Button>
            <Button variant="secondary" className="justify-start">
              <Users size={18} className="mr-2" />
              Invite Participants
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Dashboard;