import React from 'react';
import { FileText, Users, Clock, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';

/**
 * SummaryCard component - Display meeting summary in a card format
 */
const SummaryCard = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-zinc-800 rounded w-3/4"></div>
          <div className="h-4 bg-zinc-800 rounded w-full"></div>
          <div className="h-4 bg-zinc-800 rounded w-5/6"></div>
          <div className="h-4 bg-zinc-800 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'low':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20';
    }
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-violet-600/20 rounded-lg">
            <FileText className="text-violet-400" size={24} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Meeting Summary</h3>
            <p className="text-zinc-400 text-sm">{summary.meetingTitle}</p>
          </div>
        </div>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1 rounded-full">
          {summary.aiProvider}
        </span>
      </div>

      {/* Executive Summary */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-violet-400">
          <Lightbulb size={16} />
          <h4 className="font-medium text-sm">Executive Summary</h4>
        </div>
        <p className="text-zinc-300 text-sm leading-relaxed pl-6">
          {summary.executiveSummary}
        </p>
      </div>

      {/* Key Discussion Points */}
      {summary.keyDiscussionPoints && summary.keyDiscussionPoints.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-zinc-300 font-medium text-sm flex items-center space-x-2">
            <Users size={16} className="text-blue-400" />
            <span>Key Discussion Points</span>
          </h4>
          <ul className="space-y-1.5 pl-6">
            {summary.keyDiscussionPoints.map((point, index) => (
              <li key={index} className="text-zinc-400 text-sm flex items-start space-x-2">
                <span className="text-violet-400 mt-1">•</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Decisions Made */}
      {summary.decisionsMade && summary.decisionsMade.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-zinc-300 font-medium text-sm flex items-center space-x-2">
            <CheckCircle size={16} className="text-emerald-400" />
            <span>Decisions Made</span>
          </h4>
          <ul className="space-y-1.5 pl-6">
            {summary.decisionsMade.map((decision, index) => (
              <li key={index} className="text-zinc-400 text-sm flex items-start space-x-2">
                <span className="text-emerald-400 mt-1">•</span>
                <span>{decision}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next Steps */}
      {summary.nextSteps && summary.nextSteps.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-zinc-300 font-medium text-sm flex items-center space-x-2">
            <AlertCircle size={16} className="text-amber-400" />
            <span>Next Steps</span>
          </h4>
          <div className="space-y-2 pl-6">
            {summary.nextSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
              >
                <div className="flex-grow">
                  <p className="text-zinc-200 text-sm">{step.task}</p>
                  {step.assignee && (
                    <p className="text-zinc-500 text-xs mt-1">
                      Assignee: {step.assignee}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {step.dueDate && (
                    <span className="text-xs text-zinc-400 flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{new Date(step.dueDate).toLocaleDateString()}</span>
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(step.priority)}`}>
                    {step.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
        <span>Generated: {new Date(summary.generatedAt || summary.createdAt).toLocaleString()}</span>
        {summary.metadata?.confidence && (
          <span>Confidence: {(summary.metadata.confidence * 100).toFixed(0)}%</span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;