import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api-client.js';
import toast from 'react-hot-toast';

/**
 * Hook for AI meeting insights
 */
export const useAI = (meetingId) => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Get meeting summary
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['meeting-summary', meetingId],
    queryKeyHash: 'meeting-summary',
    queryFn: async () => {
      const response = await api.get(`/api/v1/ai/summary/${meetingId}`);
      return response.data.data;
    },
    enabled: !!meetingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Get action items
  const { data: actionItemsData, isLoading: actionItemsLoading } = useQuery({
    queryKey: ['action-items', meetingId],
    queryKeyHash: 'action-items',
    queryFn: async () => {
      const response = await api.get(`/api/v1/ai/action-items/${meetingId}`);
      return response.data.data;
    },
    enabled: !!meetingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Generate meeting insights
  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      const response = await api.post(`/api/v1/ai/generate/${meetingId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Meeting insights generated successfully!');
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['meeting-summary', meetingId] });
      queryClient.invalidateQueries({ queryKey: ['action-items', meetingId] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to generate insights';
      toast.error(message);
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  // Update action item
  const updateActionItemMutation = useMutation({
    mutationFn: async ({ actionItemId, updates }) => {
      const response = await api.patch(`/api/v1/ai/action-items/${actionItemId}`, updates);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items', meetingId] });
      toast.success('Action item updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update action item');
    },
  });

  // Delete action item
  const deleteActionItemMutation = useMutation({
    mutationFn: async (actionItemId) => {
      const response = await api.delete(`/api/v1/ai/action-items/${actionItemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['action-items', meetingId] });
      toast.success('Action item deleted');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete action item');
    },
  });

  const generateInsights = useCallback(() => {
    return generateInsightsMutation.mutateAsync();
  }, [generateInsightsMutation]);

  const updateActionItem = useCallback((actionItemId, updates) => {
    return updateActionItemMutation.mutateAsync({ actionItemId, updates });
  }, [updateActionItemMutation]);

  const deleteActionItem = useCallback((actionItemId) => {
    return deleteActionItemMutation.mutateAsync(actionItemId);
  }, [deleteActionItemMutation]);

  return {
    summary: summaryData,
    actionItems: actionItemsData || [],
    isLoading: summaryLoading || actionItemsLoading,
    isGenerating,
    generateInsights,
    updateActionItem,
    deleteActionItem,
    hasSummary: !!summaryData,
  };
};

export default useAI;