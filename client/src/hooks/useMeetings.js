import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { meetingService } from '../services/meetingService.js';
import toast from 'react-hot-toast';

export const useMeetings = () => {
  const queryClient = useQueryClient();

  // Get all meetings
  const {
    data: meetings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meetings'],
    queryFn: meetingService.getMyMeetings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create meeting mutation
  const createMeetingMutation = useMutation({
    mutationFn: meetingService.createMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Meeting created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create meeting');
    },
  });

  // Update meeting mutation
  const updateMeetingMutation = useMutation({
    mutationFn: ({ id, data }) => meetingService.updateMeeting(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Meeting updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update meeting');
    },
  });

  // Delete meeting mutation
  const deleteMeetingMutation = useMutation({
    mutationFn: meetingService.deleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      toast.success('Meeting deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete meeting');
    },
  });

  return {
    meetings,
    isLoading,
    error,
    createMeeting: createMeetingMutation.mutate,
    updateMeeting: updateMeetingMutation.mutate,
    deleteMeeting: deleteMeetingMutation.mutate,
    isCreating: createMeetingMutation.isPending,
    isUpdating: updateMeetingMutation.isPending,
    isDeleting: deleteMeetingMutation.isPending,
  };
};

export const useMeeting = (id) => {
  const {
    data: meeting,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['meeting', id],
    queryFn: () => meetingService.getMeetingById(id),
    enabled: !!id,
  });

  return { meeting, isLoading, error };
};
