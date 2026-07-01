import React from 'react';
import { Inbox, Calendar, Users, Settings } from 'lucide-react';

const EmptyState = ({ type = 'default', title, description, action }) => {
  const icons = {
    default: Inbox,
    meetings: Calendar,
    users: Users,
    settings: Settings,
  };

  const Icon = icons[type] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4">
        <Icon size={32} className="text-zinc-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm max-w-md mb-6">{description}</p>
      {action && action}
    </div>
  );
};

export default EmptyState;
