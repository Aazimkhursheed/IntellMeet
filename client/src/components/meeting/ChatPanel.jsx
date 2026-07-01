import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { socketService } from '../../services/socketService.js';
import { useMeetingStore } from '../../store/useMeetingStore.js';
import LoadingSpinner from '../ui/LoadingSpinner.jsx';

/**
 * ChatPanel component - In-meeting chat interface
 */
const ChatPanel = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const { meetingId, showChat, toggleChat } = useMeetingStore();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load chat history (placeholder - in production, fetch from API)
  useEffect(() => {
    if (showChat) {
      setIsLoading(true);
      // TODO: Fetch chat history from API
      // For now, start with empty messages
      setMessages([]);
      setIsLoading(false);
      
      // Focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [showChat]);

  // Listen for incoming chat messages
  useEffect(() => {
    if (!meetingId) return;

    const handleChatMessage = (messageData) => {
      setMessages(prev => {
        // Avoid duplicate messages
        const exists = prev.some(
          msg => msg.timestamp === messageData.timestamp && msg.userId === messageData.userId
        );
        if (exists) return prev;
        
        return [...prev, {
          id: `${messageData.userId}-${messageData.timestamp}`,
          userId: messageData.userId,
          userName: messageData.userName,
          message: messageData.message,
          timestamp: new Date(messageData.timestamp),
          isOwn: messageData.userId === socketService.socket?.auth?.userId,
        }];
      });
    };

    socketService.onChatMessage(handleChatMessage);

    return () => {
      socketService.removeListener('chat-message', handleChatMessage);
    };
  }, [meetingId]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setIsSending(true);

    try {
      socketService.sendChatMessage(meetingId, messageText);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!showChat) {
    return (
      <button
        onClick={toggleChat}
        className="fixed right-6 bottom-24 bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-full shadow-lg border border-zinc-700 transition z-40"
        title="Open chat"
      >
        <MessageSquare size={20} />
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-800 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <MessageSquare size={18} className="text-violet-400" />
          <h3 className="text-white font-semibold text-sm">Meeting Chat</h3>
        </div>
        <button
          onClick={toggleChat}
          className="text-zinc-400 hover:text-white transition p-1"
          title="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-zinc-500 text-sm py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col space-y-1 ${
                msg.isOwn ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-center space-x-2 px-1">
                <span className="text-xs font-medium text-zinc-300">
                  {msg.userName}
                </span>
                <span className="text-xs text-zinc-600">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  msg.isOwn
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white p-2 rounded-lg transition"
            title="Send message"
          >
            {isSending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;