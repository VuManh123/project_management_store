import { create } from 'zustand';
import { projectAPI } from '../services/api';

const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  isLoading: false,
  error: null,

  // Get all projects with pagination and filters
  fetchProjects: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.getAll(params);
      const { projects, pagination } = response.data?.data || response.data;
      set({
        projects: projects || [],
        pagination: pagination || get().pagination,
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
      const project = response.data?.data || response.data;
      
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
      return { success: true, project };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch project',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to fetch project' };
    }
  },

  // Create project
  createProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.create(data);
      const newProject = response.data?.data || response.data;
      
      set((state) => ({
        projects: [newProject, ...state.projects],
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
      const updatedProject = response.data?.data || response.data;
      
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
      const response = await projectAPI.delete(id);
      const result = response.data?.data || response.data;
      
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
        isLoading: false,
      }));
      return { success: true, message: result.message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete project',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to delete project' };
    }
  },

  // Add member to project
  addMember: async (projectId, memberData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.addMember(projectId, memberData);
      const newMember = response.data?.data || response.data;
      
      // Update selected project members list
      set((state) => {
        if (state.selectedProject?.id === projectId) {
          return {
            selectedProject: {
              ...state.selectedProject,
              members: [...(state.selectedProject.members || []), newMember],
            },
            isLoading: false,
          };
        }
        return { isLoading: false };
      });
      
      return { success: true, member: newMember };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to add member',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to add member' };
    }
  },

  // Remove member from project
  removeMember: async (projectId, memberId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.removeMember(projectId, memberId);
      const result = response.data?.data || response.data;
      
      set({ isLoading: false });
      
      // Refetch project to get updated members list
      await get().fetchProjectById(projectId);
      
      return { success: true, message: result.message };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to remove member',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to remove member' };
    }
  },

  // Update member role
  updateMemberRole: async (projectId, memberId, role) => {
    set({ isLoading: true, error: null });
    try {
      const response = await projectAPI.updateMemberRole(projectId, memberId, { role });
      const updatedMember = response.data?.data || response.data;
      
      // Update selected project members list
      set((state) => {
        if (state.selectedProject?.id === projectId) {
          return {
            selectedProject: {
              ...state.selectedProject,
              members: state.selectedProject.members.map((m) =>
                m.user_id === memberId ? updatedMember : m
              ),
            },
            isLoading: false,
          };
        }
        return { isLoading: false };
      });
      
      return { success: true, member: updatedMember };
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update member role',
      });
      return { success: false, error: error.response?.data?.message || 'Failed to update member role' };
    }
  },

  // Set selected project
  setSelectedProject: (project) => set({ selectedProject: project }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useProjectStore;
