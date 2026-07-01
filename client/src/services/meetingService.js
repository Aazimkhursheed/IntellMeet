import api from '../lib/api-client.js';

export const meetingService = {
  // Get all meetings for the authenticated user
  getMyMeetings: async () => {
    const response = await api.get('/v1/meetings');
    return response.data;
  },

  // Get a single meeting by ID
  getMeetingById: async (id) => {
    const response = await api.get(`/v1/meetings/${id}`);
    return response.data;
  },

  // Create a new meeting
  createMeeting: async (meetingData) => {
    const response = await api.post('/v1/meetings', meetingData);
    return response.data;
  },

  // Update an existing meeting
  updateMeeting: async (id, meetingData) => {
    const response = await api.patch(`/v1/meetings/${id}`, meetingData);
    return response.data;
  },

  // Delete a meeting
  deleteMeeting: async (id) => {
    const response = await api.delete(`/v1/meetings/${id}`);
    return response.data;
  },
};
