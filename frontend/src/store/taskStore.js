import { create } from 'zustand';
import { taskAPI } from '../services/api';

const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedTask: null,
  filters: {
    projectId: null,
    status: null,
    assigneeId: null,
    search: '',
  },
  kanbanColumns: {
    TODO: [],
    IN_PROGRESS: [],
    REVIEW: [],
    DONE: [],
  },
  isLoading: false,
  error: null,

  // Fetch tasks
  fetchTasks: async (projectId = null) => {
    set({ isLoading: true, error: null });
    try {
      const projectIdToFetch = projectId || get().filters.projectId;
      if (!projectIdToFetch) {
        set({ isLoading: false, tasks: [] });
        return;
      }

      const response = await taskAPI.getAll(projectIdToFetch);
      const tasks = response.data;
      
      // Organize tasks into kanban columns
      const columns = {
        TODO: tasks.filter((t) => t.status === 'TODO'),
        IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS'),
        REVIEW: tasks.filter((t) => t.status === 'REVIEW'),
        DONE: tasks.filter((t) => t.status === 'DONE'),
      };

      set({
        tasks,
        kanbanColumns: columns,
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
      const task = response.data;
      
      // Update in tasks list if exists
      set((state) => ({
        selectedTask: task,
        tasks: state.tasks.map((t) => (t.id === taskId ? task : t)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch task',
      });
    }
  },

  // Create task
  createTask: async (projectId, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.create(projectId, data);
      const newTask = response.data;
      
      set((state) => {
        const updatedTasks = [...state.tasks, newTask];
        const columns = {
          TODO: updatedTasks.filter((t) => t.status === 'TODO'),
          IN_PROGRESS: updatedTasks.filter((t) => t.status === 'IN_PROGRESS'),
          REVIEW: updatedTasks.filter((t) => t.status === 'REVIEW'),
          DONE: updatedTasks.filter((t) => t.status === 'DONE'),
        };
        
        return {
          tasks: updatedTasks,
          kanbanColumns: columns,
          isLoading: false,
        };
      });
      
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
      const updatedTask = response.data;
      
      set((state) => {
        const updatedTasks = state.tasks.map((t) => (t.id === taskId ? updatedTask : t));
        const columns = {
          TODO: updatedTasks.filter((t) => t.status === 'TODO'),
          IN_PROGRESS: updatedTasks.filter((t) => t.status === 'IN_PROGRESS'),
          REVIEW: updatedTasks.filter((t) => t.status === 'REVIEW'),
          DONE: updatedTasks.filter((t) => t.status === 'DONE'),
        };
        
        return {
          tasks: updatedTasks,
          kanbanColumns: columns,
          selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
          isLoading: false,
        };
      });
      
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
      await taskAPI.delete(projectId, taskId);
      
      set((state) => {
        const updatedTasks = state.tasks.filter((t) => t.id !== taskId);
        const columns = {
          TODO: updatedTasks.filter((t) => t.status === 'TODO'),
          IN_PROGRESS: updatedTasks.filter((t) => t.status === 'IN_PROGRESS'),
          REVIEW: updatedTasks.filter((t) => t.status === 'REVIEW'),
          DONE: updatedTasks.filter((t) => t.status === 'DONE'),
        };
        
        return {
          tasks: updatedTasks,
          kanbanColumns: columns,
          selectedTask: state.selectedTask?.id === taskId ? null : state.selectedTask,
          isLoading: false,
        };
      });
      
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete task',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to delete task' };
    }
  },

  // Update task status
  updateTaskStatus: async (projectId, taskId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await taskAPI.updateStatus(projectId, taskId, status);
      const updatedTask = response.data;
      
      set((state) => {
        const updatedTasks = state.tasks.map((t) => (t.id === taskId ? updatedTask : t));
        const columns = {
          TODO: updatedTasks.filter((t) => t.status === 'TODO'),
          IN_PROGRESS: updatedTasks.filter((t) => t.status === 'IN_PROGRESS'),
          REVIEW: updatedTasks.filter((t) => t.status === 'REVIEW'),
          DONE: updatedTasks.filter((t) => t.status === 'DONE'),
        };
        
        return {
          tasks: updatedTasks,
          kanbanColumns: columns,
          selectedTask: state.selectedTask?.id === taskId ? updatedTask : state.selectedTask,
          isLoading: false,
        };
      });
      
      return { success: true, task: updatedTask };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update task status',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to update task status' };
    }
  },

  // Assign task
  assignTask: async (projectId, taskId, assigneeId) => {
    return get().updateTask(projectId, taskId, { assigneeId });
  },

  // Set filters
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  // Clear filters
  clearFilters: () => {
    set({
      filters: {
        projectId: null,
        status: null,
        assigneeId: null,
        search: '',
      },
    });
  },

  // Set selected task
  setSelectedTask: (task) => set({ selectedTask: task }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTaskStore;
