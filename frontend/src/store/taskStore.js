import { create } from 'zustand';
import { taskAPI } from '../services/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedTask: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 0,
  },
  isLoading: false,
  error: null,

  // Get all tasks in a project with pagination and filters
  fetchTasks: async (projectId, params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.getAll(projectId, params);
      const { tasks, pagination } = response.data?.data || response.data;
      set({
        tasks: tasks || [],
        pagination: pagination || get().pagination,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch tasks',
      });
    }
  },

  // Get task by ID
  fetchTaskById: async (projectId, taskId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.getById(projectId, taskId);
      const task = response.data?.data || response.data;
      
      // Update in tasks list if exists
      const tasks = get().tasks;
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = task;
      }

      set({
        selectedTask: task,
        tasks,
        isLoading: false,
      });
      return { success: true, task };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch task',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to fetch task' };
    }
  },

  // Create task
  createTask: async (projectId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.create(projectId, data);
      const newTask = response.data?.data || response.data;
      
      set((state) => ({
        tasks: [newTask, ...state.tasks],
        isLoading: false,
      }));
      
      return { success: true, task: newTask };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create task',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to create task' };
    }
  },

  // Update task
  updateTask: async (projectId, taskId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.update(projectId, taskId, data);
      const updatedTask = response.data?.data || response.data;
      
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
        isLoading: false,
      }));
      
      return { success: true, task: updatedTask };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update task',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to update task' };
    }
  },

  // Delete task
  deleteTask: async (projectId, taskId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.delete(projectId, taskId);
      const result = response.data?.data || response.data;
      
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask,
        isLoading: false,
      }));
      return { success: true, message: result.message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete task',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to delete task' };
    }
  },

  // Update task status (quick update)
  updateTaskStatus: async (projectId, taskId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.updateStatus(projectId, taskId, status);
      const updatedTask = response.data?.data || response.data;
      
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)),
        selectedTask: state.selectedTask?.id === taskId ? { ...state.selectedTask, status } : state.selectedTask,
        isLoading: false,
      }));
      
      return { success: true, task: updatedTask };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update task status',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to update task status' };
    }
  },

  // Set selected task
  setSelectedTask: (task) => set({ selectedTask: task }),

  // Clear tasks (useful when switching projects)
  clearTasks: () => set({ tasks: [], selectedTask: null, error: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTaskStore;
