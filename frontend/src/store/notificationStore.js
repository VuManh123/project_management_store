import { create } from 'zustand';
import { notificationAPI } from '../services/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Fetch all notifications
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationAPI.getAll();
      const notifications = response.data;
      const unreadCount = notifications.filter((n) => !n.read).length;
      
      set({
        notifications,
        unreadCount,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch notifications',
      });
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      set({ unreadCount: response.data.count });
    } catch (error) {
      console.error('Failed to get unread count:', error);
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      set((state) => {
        const updatedNotifications = state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        );
        const unreadCount = updatedNotifications.filter((n) => !n.read).length;
        
        return {
          notifications: updatedNotifications,
          unreadCount,
        };
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  // Add notification (for real-time updates)
  addNotification: (notification) => {
    set((state) => {
      const exists = state.notifications.some((n) => n.id === notification.id);
      if (exists) {
        return state;
      }
      
      const updatedNotifications = [notification, ...state.notifications];
      const unreadCount = updatedNotifications.filter((n) => !n.read).length;
      
      return {
        notifications: updatedNotifications.slice(0, 100), // Keep last 100
        unreadCount,
      };
    });
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useNotificationStore;
