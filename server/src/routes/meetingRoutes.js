import express from 'express';
import {
  createMeeting,
  getMyMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All meeting routes require authentication
router.use(protect);

router.route('/').post(createMeeting).get(getMyMeetings);

router
  .route('/:id')
  .get(getMeetingById)
  .patch(updateMeeting)
  .delete(deleteMeeting);

export default router;
