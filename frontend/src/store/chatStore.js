import { create } from 'zustand';
import { chatAPI } from '../services/api';

const useChatStore = create((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: {},
  users: [],
  isLoading: false,
  error: null,

  // Fetch conversations list
  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.getConversations();
      set({
        conversations: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch conversations',
      });
    }
  },

  // Fetch conversation details
  fetchConversation: async (conversationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.getConversation(conversationId);
      const conversation = response.data;
      
      set((state) => ({
        selectedConversation: conversation,
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? conversation : c
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch conversation',
      });
    }
  },

  // Fetch messages for a conversation
  fetchMessages: async (conversationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.getMessages(conversationId);
      const messages = response.data;
      
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: messages,
        },
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch messages',
      });
    }
  },

  // Send message
  sendMessage: async (conversationId, content) => {
    try {
      const response = await chatAPI.sendMessage(conversationId, { content });
      const newMessage = response.data;
      
      set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [
            ...(state.messages[conversationId] || []),
            newMessage,
          ],
        },
      }));
      
      return { success: true, message: newMessage };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to send message',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to send message' };
    }
  },

  // Create new conversation
  createConversation: async (participantIds) => {
    set({ isLoading: true, error: null });
    try {
      const response = await chatAPI.createConversation({ participantIds });
      const conversation = response.data;
      
      set((state) => ({
        conversations: [conversation, ...state.conversations],
        selectedConversation: conversation,
        isLoading: false,
      }));
      
      return { success: true, conversation };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create conversation',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to create conversation' };
    }
  },

  // Get users list
  fetchUsers: async (search = '') => {
    try {
      const response = await chatAPI.getUsers({ search });
      set({ users: response.data });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  // Add message (for real-time updates)
  addMessage: (conversationId, message) => {
    set((state) => {
      const existingMessages = state.messages[conversationId] || [];
      const exists = existingMessages.some((m) => m.id === message.id);
      
      if (exists) {
        return state;
      }
      
      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message],
        },
      };
    });
  },

  // Set selected conversation
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useChatStore;
