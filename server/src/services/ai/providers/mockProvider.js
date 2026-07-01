/**
 * Mock AI Provider - Generates realistic summaries for development
 * Used when no AI API key is configured or as fallback
 */

export const mockProvider = {
  name: 'Mock Provider',
  
  /**
   * Generate meeting summary
   */
  async generateSummary(meetingData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { title, participants, duration, chatMessages, transcript } = meetingData;
    
    // Generate realistic mock summary based on meeting data
    const participantCount = participants?.length || 0;
    const messageCount = chatMessages?.length || 0;
    
    return {
      executiveSummary: `This ${duration}-minute meeting "${title}" involved ${participantCount} participant${participantCount !== 1 ? 's' : ''} and generated ${messageCount} chat message${messageCount !== 1 ? 's' : ''}. The discussion focused on key project updates and action items.`,
      
      keyDiscussionPoints: [
        'Reviewed current project status and milestones',
        'Discussed upcoming deadlines and resource allocation',
        'Addressed technical challenges and proposed solutions',
        'Aligned on priorities for the next sprint',
        'Reviewed feedback from recent user testing',
      ],
      
      decisionsMade: [
        'Approved the proposed timeline for Phase 2 deliverables',
        'Agreed to allocate additional resources to the critical path',
        'Decided to proceed with the recommended technical approach',
        'Scheduled follow-up meeting for next week',
      ],
      
      nextSteps: [
        {
          task: 'Complete implementation of core features',
          priority: 'high',
          assignee: participants?.[0] || 'Team',
          dueDate: getNextWeekDate(),
        },
        {
          task: 'Review and provide feedback on design mockups',
          priority: 'medium',
          assignee: participants?.[1] || 'Team',
          dueDate: getNextWeekDate(3),
        },
        {
          task: 'Schedule stakeholder review meeting',
          priority: 'low',
          assignee: participants?.[0] || 'Team',
          dueDate: getNextWeekDate(7),
        },
      ],
      
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'mock-v1',
        confidence: 0.85,
      },
    };
  },
  
  /**
   * Generate action items
   */
  async generateActionItems(meetingData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const { participants, chatMessages } = meetingData;
    
    // Extract potential action items from chat messages
    const actionItems = [];
    
    // Add mock action items based on participants
    if (participants && participants.length > 0) {
      actionItems.push({
        task: 'Follow up on discussed action items',
        priority: 'high',
        status: 'pending',
        assignee: participants[0],
        dueDate: getNextWeekDate(),
      });
    }
    
    if (participants && participants.length > 1) {
      actionItems.push({
        task: 'Share meeting notes with team',
        priority: 'medium',
        status: 'pending',
        assignee: participants[1],
        dueDate: getNextWeekDate(1),
      });
    }
    
    actionItems.push({
      task: 'Review action items and update status',
      priority: 'medium',
      status: 'pending',
      assignee: 'All participants',
      dueDate: getNextWeekDate(2),
    });
    
    return {
      actionItems,
      totalCount: actionItems.length,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'mock-v1',
      },
    };
  },
};

/**
 * Helper function to get next week date
 */
function getNextWeekDate(daysToAdd = 7) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
}