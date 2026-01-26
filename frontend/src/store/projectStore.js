import { create } from 'zustand';
import { projectAPI } from '../services/api';

const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  // Get all projects
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.getAll();
      set({
        projects: response.data,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch projects',
      });
    }
  },

  // Get project by ID
  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.getById(id);
      const project = response.data;
      
      // Update in projects list if exists
      const projects = get().projects;
      const projectIndex = projects.findIndex((p) => p.id === id);
      if (projectIndex !== -1) {
        projects[projectIndex] = project;
      }

      set({
        selectedProject: project,
        projects,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch project',
      });
    }
  },

  // Create project
  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.create(data);
      const newProject = response.data;
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
      return { success: true, project: newProject };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create project',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to create project' };
    }
  },

  // Update project
  updateProject: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.update(id, data);
      const updatedProject = response.data;
      
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        selectedProject: state.selectedProject?.id === id ? updatedProject : state.selectedProject,
        isLoading: false,
      }));
      return { success: true, project: updatedProject };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update project',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to update project' };
    }
  },

  // Delete project
  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await projectAPI.delete(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete project',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to delete project' };
    }
  },

  // Set selected project
  setSelectedProject: (project) => set({ selectedProject: project }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useProjectStore;
