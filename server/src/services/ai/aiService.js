import { mockProvider } from './providers/mockProvider.js';
import { openaiProvider } from './providers/openaiProvider.js';
import { geminiProvider } from './providers/geminiProvider.js';
import { ollamaProvider } from './providers/ollamaProvider.js';

/**
 * AI Service - Provider-independent abstraction layer
 * Controllers should ONLY use this service, never call providers directly
 */

// Get AI provider from environment configuration
const getAIProvider = () => {
  const provider = process.env.AI_PROVIDER?.toLowerCase() || 'mock';
  
  switch (provider) {
    case 'openai':
      return openaiProvider;
    case 'gemini':
      return geminiProvider;
    case 'ollama':
      return ollamaProvider;
    case 'mock':
    default:
      return mockProvider;
  }
};

/**
 * Generate meeting summary
 * @param {Object} meetingData - Meeting information
 * @param {string} meetingData.title - Meeting title
 * @param {Array} meetingData.participants - Array of participant names
 * @param {number} meetingData.duration - Meeting duration in minutes
 * @param {Array} meetingData.chatMessages - Array of chat messages
 * @param {string} meetingData.transcript - Meeting transcript (optional)
 * @returns {Promise<Object>} Generated summary
 */
export const generateMeetingSummary = async (meetingData) => {
  try {
    const provider = getAIProvider();
    
    console.log(`[AI Service] Generating summary using ${provider.name} provider`);
    
    const summary = await provider.generateSummary(meetingData);
    
    console.log('[AI Service] Summary generated successfully');
    return {
      success: true,
      data: summary,
      provider: provider.name,
    };
  } catch (error) {
    console.error('[AI Service] Error generating summary:', error);
    
    // Fallback to mock provider on error
    console.log('[AI Service] Falling back to mock provider');
    try {
      const fallbackSummary = await mockProvider.generateSummary(meetingData);
      return {
        success: true,
        data: fallbackSummary,
        provider: 'mock (fallback)',
      };
    } catch (fallbackError) {
      console.error('[AI Service] Fallback also failed:', fallbackError);
      return {
        success: false,
        error: 'Failed to generate summary',
        details: error.message,
      };
    }
  }
};

/**
 * Generate action items from meeting data
 * @param {Object} meetingData - Meeting information
 * @param {string} meetingData.title - Meeting title
 * @param {Array} meetingData.participants - Array of participant names
 * @param {Array} meetingData.chatMessages - Array of chat messages
 * @param {string} meetingData.transcript - Meeting transcript (optional)
 * @returns {Promise<Object>} Generated action items
 */
export const generateActionItems = async (meetingData) => {
  try {
    const provider = getAIProvider();
    
    console.log(`[AI Service] Generating action items using ${provider.name} provider`);
    
    const actionItems = await provider.generateActionItems(meetingData);
    
    console.log('[AI Service] Action items generated successfully');
    return {
      success: true,
      data: actionItems,
      provider: provider.name,
    };
  } catch (error) {
    console.error('[AI Service] Error generating action items:', error);
    
    // Fallback to mock provider on error
    console.log('[AI Service] Falling back to mock provider for action items');
    try {
      const fallbackActionItems = await mockProvider.generateActionItems(meetingData);
      return {
        success: true,
        data: fallbackActionItems,
        provider: 'mock (fallback)',
      };
    } catch (fallbackError) {
      console.error('[AI Service] Fallback also failed:', fallbackError);
      return {
        success: false,
        error: 'Failed to generate action items',
        details: error.message,
      };
    }
  }
};

/**
 * Get current AI provider name
 * @returns {string} Provider name
 */
export const getCurrentProvider = () => {
  return getAIProvider().name;
};