import React from 'react';
import { Calendar, Clock, Users, Video, Plus } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

const Dashboard = () => {
  const stats = [
    { label: 'Total Meetings', value: '24', icon: Calendar, color: 'violet' },
    { label: 'Hours Spent', value: '48h', icon: Clock, color: 'emerald' },
    { label: 'Participants', value: '156', icon: Users, color: 'blue' },
    { label: 'Recordings', value: '12', icon: Video, color: 'amber' },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Product Strategy Review',
      time: '10:00 AM',
      date: 'Today',
      duration: '60 min',
      participants: 8,
    },
    {
      id: 2,
      title: 'Design Team Standup',
      time: '2:00 PM',
      date: 'Today',
      duration: '30 min',
      participants: 5,
    },
    {
      id: 3,
      title: 'Client Presentation',
      time: '11:00 AM',
      date: 'Tomorrow',
      duration: '90 min',
      participants: 12,
    },
  ];

  const recentMeetings = [
    {
      id: 1,
      title: 'Weekly Sync',
      date: 'Yesterday',
      status: 'completed',
      duration: '45 min',
    },
    {
      id: 2,
      title: 'Sprint Planning',
      date: '2 days ago',
      status: 'completed',
      duration: '90 min',
    },
    {
      id: 3,
      title: 'Architecture Review',
      date: '3 days ago',
      status: 'completed',
      duration: '60 min',
    },
  ];

  const colorClasses = {
    violet: 'bg-violet-600/10 border-violet-500/20 text-violet-400',
    emerald: 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400',
    blue: 'bg-blue-600/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-600/10 border-amber-500/20 text-amber-400',
  };

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
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl hover:border-zinc-700/50 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{meeting.title}</h3>
                    <span className="text-xs px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full">
                      {meeting.date}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-zinc-400">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span>{meeting.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users size={14} />
                      <span>{meeting.participants}</span>
                    </div>
                    <span>{meeting.duration}</span>
                  </div>
                </div>
              ))}
            </div>
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
            <div className="space-y-4">
              {recentMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="p-4 bg-zinc-950/60 border border-zinc-800/40 rounded-xl hover:border-zinc-700/50 transition cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white">{meeting.title}</h3>
                    <span className="text-xs px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                      {meeting.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-zinc-400">
                    <span>{meeting.date}</span>
                    <span>{meeting.duration}</span>
                  </div>
                </div>
              ))}
            </div>
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
