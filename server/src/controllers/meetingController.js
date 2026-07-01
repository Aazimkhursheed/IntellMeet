import Meeting from '../models/Meeting.js';

// @desc    Create a new meeting
// @route   POST /api/v1/meetings
// @access  Private
export const createMeeting = async (req, res, next) => {
  try {
    const { title, description, scheduledFor, duration } = req.body;

    const meeting = new Meeting({
      title,
      description,
      host: req.user.id,
      scheduledFor: scheduledFor || Date.now(),
      duration: duration || 60,
    });

    await meeting.save();

    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meetings for the authenticated user
// @route   GET /api/v1/meetings
// @access  Private
export const getMyMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({
      $or: [{ host: req.user.id }, { participants: req.user.id }],
    })
      .populate('host', 'fullName email avatar')
      .populate('participants', 'fullName email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json(meetings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single meeting by ID
// @route   GET /api/v1/meetings/:id
// @access  Private
export const getMeetingById = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('host', 'fullName email avatar')
      .populate('participants', 'fullName email avatar');

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Check if user is host or participant
    const isHost = meeting.host._id.toString() === req.user.id;
    const isParticipant = meeting.participants.some(
      (p) => p._id.toString() === req.user.id
    );

    if (!isHost && !isParticipant) {
      return res.status(403).json({ message: 'Not authorized to access this meeting' });
    }

    res.status(200).json(meeting);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a meeting
// @route   PATCH /api/v1/meetings/:id
// @access  Private
export const updateMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Only host can update meeting
    if (meeting.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the host can update this meeting' });
    }

    const { title, description, scheduledFor, duration, status } = req.body;

    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (scheduledFor !== undefined) updateFields.scheduledFor = scheduledFor;
    if (duration !== undefined) updateFields.duration = duration;
    if (status !== undefined) updateFields.status = status;

    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate('host', 'fullName email avatar')
      .populate('participants', 'fullName email avatar');

    res.status(200).json(updatedMeeting);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a meeting
// @route   DELETE /api/v1/meetings/:id
// @access  Private
export const deleteMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    // Only host can delete meeting
    if (meeting.host.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the host can delete this meeting' });
    }

    await Meeting.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    next(error);
  }
};
