import express from 'express';
import {
  generateMeetingInsights,
  getMeetingSummary,
  getMeetingActionItems,
  updateActionItem,
  deleteActionItem,
} from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/v1/ai/generate/:meetingId
 * @desc    Generate meeting summary and action items
 * @access  Private
 */
router.post('/generate/:meetingId', protect, generateMeetingInsights);

/**
 * @route   GET /api/v1/ai/summary/:meetingId
 * @desc    Get meeting summary
 * @access  Private
 */
router.get('/summary/:meetingId', protect, getMeetingSummary);

/**
 * @route   GET /api/v1/ai/action-items/:meetingId
 * @desc    Get meeting action items
 * @access  Private
 */
router.get('/action-items/:meetingId', protect, getMeetingActionItems);

/**
 * @route   PATCH /api/v1/ai/action-items/:id
 * @desc    Update action item
 * @access  Private
 */
router.patch('/action-items/:id', protect, updateActionItem);

/**
 * @route   DELETE /api/v1/ai/action-items/:id
 * @desc    Delete action item
 * @access  Private
 */
router.delete('/action-items/:id', protect, deleteActionItem);

export default router;