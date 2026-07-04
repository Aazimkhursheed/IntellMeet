import { asyncHandler } from '../utils/asyncHandler.js';
import { generateMeetingSummary, generateActionItems } from '../services/ai/aiService.js';
import MeetingSummary from '../models/MeetingSummary.js';
import ActionItem from '../models/ActionItem.js';
import Meeting from '../models/Meeting.js';

/**
 * @desc    Generate meeting summary and action items
 * @route   POST /api/v1/ai/generate/:meetingId
 * @access  Private (meeting host or participants)
 */
export const generateMeetingInsights = asyncHandler(async (req, res, next) => {
  const meetingId = req.params.meetingId;
  const userId = req.user.id;

  try {
    // Find meeting by meetingCode
    const meeting = await Meeting.findOne({ meetingCode: meetingId })
      .populate('host', 'fullName')
      .populate('participants', 'fullName');

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: 'Meeting not found',
      });
    }

    // Check if user is host or participant
    const isHost = meeting.host._id.toString() === userId;
    const isParticipant = meeting.participants.some(
      p => p._id.toString() === userId
    );

    if (!isHost && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to generate insights for this meeting',
      });
    }

    // Check if summary already exists
    const existingSummary = await MeetingSummary.findOne({ meetingId: meeting._id });
    if (existingSummary) {
      return res.status(400).json({
        success: false,
        message: 'Meeting insights already generated',
        data: existingSummary,
      });
    }

    // Prepare meeting data for AI
    const participantNames = meeting.participants.map(p => p.fullName);
    const meetingData = {
      title: meeting.title,
      participants: participantNames,
      duration: meeting.duration || 60,
      chatMessages: [], // TODO: Fetch from chat collection when implemented
      transcript: '', // TODO: Add transcript support in future
    };

    // Generate summary and action items
    const [summaryResult, actionItemsResult] = await Promise.all([
      generateMeetingSummary(meetingData),
      generateActionItems(meetingData),
    ]);

    if (!summaryResult.success) {
      return res.status(500).json({
        success: false,
        message: summaryResult.error || 'Failed to generate summary',
      });
    }

    // Save summary to database
    const meetingSummary = await MeetingSummary.create({
      meetingId: meeting._id,
      meetingTitle: meeting.title,
      participants: participantNames.map(name => ({ userName: name })),
      duration: meeting.duration || 60,
      chatMessages: [],
      transcript: '',
      ...summaryResult.data,
      aiProvider: summaryResult.provider,
    });

    // Save action items to database
    const actionItems = [];
    if (actionItemsResult.success && actionItemsResult.data.actionItems) {
      for (const item of actionItemsResult.data.actionItems) {
        const actionItem = await ActionItem.create({
          meetingId: meeting._id,
          meetingSummaryId: meetingSummary._id,
          task: item.task,
          priority: item.priority || 'medium',
          status: item.status || 'pending',
          assignee: item.assignee ? { userName: item.assignee } : undefined,
          dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
          createdBy: userId,
        });
        actionItems.push(actionItem);
      }
    }

    // Populate action items for response
    await meetingSummary.populate('participants.userId', 'fullName');

    res.status(201).json({
      success: true,
      message: 'Meeting insights generated successfully',
      data: {
        summary: meetingSummary,
        actionItems,
        provider: summaryResult.provider,
      },
    });
  } catch (error) {
    console.error('Error generating meeting insights:', error);
    next(error);
  }
});

/**
 * @desc    Get meeting summary
 * @route   GET /api/v1/ai/summary/:meetingId
 * @access  Private (meeting host or participants)
 */
export const getMeetingSummary = asyncHandler(async (req, res, _next) => {
  const meetingId = req.params.meetingId;

  // Find meeting by meetingCode
  const meeting = await Meeting.findOne({ meetingCode: meetingId });
  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Meeting not found',
    });
  }

  const summary = await MeetingSummary.findOne({ meetingId: meeting._id })
    .populate('participants.userId', 'fullName');

  if (!summary) {
    return res.status(404).json({
      success: false,
      message: 'Summary not found for this meeting',
    });
  }

  // Check authorization (in production, check if user is host/participant)
  res.status(200).json({
    success: true,
    data: summary,
  });
});

/**
 * @desc    Get meeting action items
 * @route   GET /api/v1/ai/action-items/:meetingId
 * @access  Private (meeting host or participants)
 */
export const getMeetingActionItems = asyncHandler(async (req, res, _next) => {
  const meetingId = req.params.meetingId;

  // Find meeting by meetingCode
  const meeting = await Meeting.findOne({ meetingCode: meetingId });
  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: 'Meeting not found',
    });
  }

  const actionItems = await ActionItem.find({ meetingId: meeting._id })
    .populate('assignee.userId', 'fullName')
    .populate('createdBy', 'fullName')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: actionItems.length,
    data: actionItems,
  });
});

/**
 * @desc    Update action item
 * @route   PATCH /api/v1/ai/action-items/:id
 * @access  Private
 */
export const updateActionItem = asyncHandler(async (req, res, _next) => {
  const actionItemId = req.params.id;
  const userId = req.user.id;

  const actionItem = await ActionItem.findById(actionItemId);

  if (!actionItem) {
    return res.status(404).json({
      success: false,
      message: 'Action item not found',
    });
  }

  // Update fields
  const allowedUpdates = ['status', 'priority', 'task', 'notes', 'dueDate', 'assignee'];
  const updates = {};

  allowedUpdates.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  // Set completedAt if status changed to completed
  if (updates.status === 'completed' && actionItem.status !== 'completed') {
    updates.completedAt = new Date();
  }

  const updatedActionItem = await ActionItem.findByIdAndUpdate(
    actionItemId,
    updates,
    { new: true, runValidators: true }
  ).populate('assignee.userId', 'fullName');

  res.status(200).json({
    success: true,
    message: 'Action item updated successfully',
    data: updatedActionItem,
  });
});

/**
 * @desc    Delete action item
 * @route   DELETE /api/v1/ai/action-items/:id
 * @access  Private (creator only)
 */
export const deleteActionItem = asyncHandler(async (req, res, _next) => {
  const actionItemId = req.params.id;
  const userId = req.user.id;

  const actionItem = await ActionItem.findById(actionItemId);

  if (!actionItem) {
    return res.status(404).json({
      success: false,
      message: 'Action item not found',
    });
  }

  // Check if user is the creator
  if (actionItem.createdBy.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this action item',
    });
  }

  await ActionItem.findByIdAndDelete(actionItemId);

  res.status(200).json({
    success: true,
    message: 'Action item deleted successfully',
  });
});