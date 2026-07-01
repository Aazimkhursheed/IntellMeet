import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Meeting title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Host is required'],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    meetingCode: {
      type: String,
      required: [true, 'Meeting code is required'],
      unique: true,
      trim: true,
    },
    scheduledFor: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: Number,
      default: 60,
      min: [15, 'Duration must be at least 15 minutes'],
      max: [480, 'Duration cannot exceed 480 minutes (8 hours)'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique meeting code before saving
meetingSchema.pre('save', async function (next) {
  if (this.isNew) {
    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 9; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      // Format: XXX-XXX-XXX
      return `${code.slice(0, 3)}-${code.slice(3, 6)}-${code.slice(6, 9)}`;
    };

    let code;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      code = generateCode();
      const existingMeeting = await this.constructor.findOne({ meetingCode: code });
      if (!existingMeeting) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return next(new Error('Failed to generate unique meeting code'));
    }

    this.meetingCode = code;
  }
  next();
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
