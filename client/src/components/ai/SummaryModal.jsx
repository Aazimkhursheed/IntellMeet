import React from 'react';
import { X, Loader2, AlertCircle, FileText } from 'lucide-react';
import SummaryCard from './SummaryCard.jsx';
import ActionItemList from './ActionItemList.jsx';

/**
 * SummaryModal component - Full-screen modal for meeting summary and action items
 */
const SummaryModal = ({ isOpen, onClose, summary, actionItems, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-white font-semibold text-xl">Meeting Insights</h2>
            <p className="text-zinc-400 text-sm mt-1">AI-generated summary and action items</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-lg transition text-zinc-400 hover:text-white"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 flex items-start space-x-3">
              <div className="text-red-400 mt-0.5">
                <AlertCircle size={20} />
              </div>
              <div>
                <h3 className="text-red-400 font-medium text-sm">Error Generating Insights</h3>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 size={48} className="text-violet-400 animate-spin" />
              <div className="text-center">
                <p className="text-white font-medium">Generating meeting insights...</p>
                <p className="text-zinc-400 text-sm mt-1">This may take a moment</p>
              </div>
            </div>
          ) : (
            <>
              {/* Summary Section */}
              {summary && (
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">Summary</h3>
                  <SummaryCard summary={summary} isLoading={false} />
                </div>
              )}

              {/* Action Items Section */}
              {actionItems && (
                <div>
                  <h3 className="text-white font-semibold text-lg mb-4">Action Items</h3>
                  <ActionItemList 
                    actionItems={actionItems} 
                    isLoading={false}
                    onUpdate={() => {}}
                    onDelete={() => {}}
                  />
                </div>
              )}

              {/* Empty state */}
              {!summary && !actionItems && !isLoading && (
                <div className="text-center py-12">
                  <FileText size={48} className="text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-400 text-sm">No insights generated yet</p>
                  <p className="text-zinc-500 text-xs mt-1">Click the button below to generate meeting insights</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-zinc-900 border-t border-zinc-800 px-6 py-4 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
