import React, { useState } from 'react';
import { Search, Plus, Filter, Calendar, Clock, Users, Video } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import { Card, CardBody } from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const Meetings = () => {
  const [searchQuery, setSearchQuery] = useState('');

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
        <Button variant="secondary">
          <Filter size={16} className="mr-2" />
          Filters
        </Button>
      </div>

      {/* Meeting Cards Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} glass>
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Meeting Title Placeholder</h3>
                  <p className="text-sm text-zinc-400">Meeting description placeholder</p>
                </div>
                <span className="text-xs px-2 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full">
                  Scheduled
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-zinc-400 pt-2 border-t border-zinc-800/50">
                <div className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>Today</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={14} />
                  <span>10:00 AM</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>8</span>
                </div>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button variant="primary" size="sm" className="flex-1">
                  <Video size={14} className="mr-1" />
                  Join
                </Button>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Empty State Placeholder */}
      {searchQuery && (
        <Card glass>
          <CardBody>
            <EmptyState
              type="meetings"
              title="No meetings found"
              description="Try adjusting your search or filters to find what you're looking for."
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default Meetings;
