import React from 'react';
import { ChevronLeft } from 'lucide-react';

const PageHeader = ({ title, subtitle, backTo, onBack, action, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      {backTo || onBack ? (
        <button
          onClick={onBack}
          className="flex items-center text-zinc-400 hover:text-white transition mb-4 text-sm font-medium"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </button>
      ) : null}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-zinc-400 mt-2 text-sm md:text-base">{subtitle}</p>}
        </div>
        {action && <div className="mt-4 md:mt-0">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
