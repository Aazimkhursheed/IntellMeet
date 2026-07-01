import mongoose from 'mongoose';

const meetingSummarySchema = new mongoose.Schema({
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true,
    unique: true,
  },
  meetingTitle: {
    type: String,
    required: true,
    maxlength: 200,
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
      required: true,
    },
  }],
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  chatMessages: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: String,
    message: String,
    timestamp: Date,
  }],
  transcript: {
    type: String,
    default: '',
  },
  executiveSummary: {
    type: String,
    required: true,
  },
  keyDiscussionPoints: [{
    type: String,
  }],
  decisionsMade: [{
    type: String,
  }],
  nextSteps: [{
    task: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    assignee: String,
    dueDate: Date,
  }],
  aiProvider: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
meetingSummarySchema.index({ meetingId: 1 });
meetingSummarySchema.index({ createdAt: -1 });

export default mongoose.model('MeetingSummary', meetingSummarySchema);
