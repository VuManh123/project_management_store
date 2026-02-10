import { create } from 'zustand';
import { authAPI } from '../services/api';

const useAuthStore = create((set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.login(credentials);
          // Backend returns { success, data: { user, token, refreshToken } }
          const data = response.data?.data || response.data;
          const { user, token, refreshToken } = data;
          
          if (token) {
            localStorage.setItem('token', token);
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || error.response?.data?.data?.message || error.message || 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.register(userData);
          // Backend returns { success, data: { user, token, refreshToken } }
          const data = response.data?.data || response.data;
          const { user, token, refreshToken } = data;
          
          if (token) {
            localStorage.setItem('token', token);
            if (refreshToken) {
              localStorage.setItem('refreshToken', refreshToken);
            }

            set({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
            return { success: true };
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          // Handle validation errors (422)
          let errorMessage = 'Registration failed';
          if (error.response?.status === 422) {
            // Validation errors
            const errors = error.response?.data?.data;
            if (errors?.errors && Array.isArray(errors.errors)) {
              errorMessage = errors.errors.map(e => e.message || e.msg).join(', ');
            } else if (errors?.email) {
              errorMessage = errors.email;
            } else {
              errorMessage = error.response?.data?.message || 'Validation failed';
            }
          } else {
            errorMessage = error.response?.data?.message || error.message || 'Registration failed';
          }
          
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Get profile
      getProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getProfile();
          // Backend returns { success, data: { user } }
          const user = response.data?.data || response.data;
          set({
            user,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to get profile',
          });
        }
      },

      // Update profile (data: { name?, email? } or FormData with optional avatar file)
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authAPI.updateProfile(data);
          const user = response.data?.data || response.data;
          set({
            user,
            isLoading: false,
            error: null,
          });
          return { success: true, user };
        } catch (error) {
          let errorMessage = error.response?.data?.message || 'Failed to update profile';
          if (error.response?.status === 422) {
            const errors = error.response?.data?.data;
            if (errors?.errors && Array.isArray(errors.errors)) {
              errorMessage = errors.errors.map((e) => e.message || e.msg).join(', ');
            } else if (errors?.message) {
              errorMessage = errors.message;
            }
          }
          set({
            isLoading: false,
            error: errorMessage,
          });
          return { success: false, error: errorMessage };
        }
      },

      // Refresh token
      refreshToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }
          
          const response = await authAPI.refreshToken(refreshToken);
          // Backend returns { success, data: { token } }
          const data = response.data?.data || response.data;
          const { token } = data;
          
          if (token) {
            localStorage.setItem('token', token);
            set({ token });
            return { success: true, token };
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          // Refresh failed, clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
          return { success: false, error: error.response?.data?.message || 'Token refresh failed' };
        }
      },

      // Initialize auth from token
      initAuth: () => {
        const token = localStorage.getItem('token');
        if (token) {
          set({
            token,
            isAuthenticated: true,
            isInitialized: true,
          });
          // Optionally fetch user profile
          get().getProfile();
        } else {
          set({
            isInitialized: true,
          });
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    })
);

export default useAuthStore;
