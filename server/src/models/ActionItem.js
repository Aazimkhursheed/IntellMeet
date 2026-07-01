import mongoose from 'mongoose';

const actionItemSchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true,
  },
  meetingSummaryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MeetingSummary',
  },
  task: {
    type: String,
    required: true,
    maxlength: 500,
  },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  assignee: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: String,
  },
  dueDate: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: 1000,
    default: '',
  },
  completedAt: {
    type: Date,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
actionItemSchema.index({ meetingId: 1 });
actionItemSchema.index({ assignee: 'userId' });
actionItemSchema.index({ status: 1 });
actionItemSchema.index({ dueDate: 1 });
actionItemSchema.index({ createdAt: -1 });

export default mongoose.model('ActionItem', actionItemSchema);
