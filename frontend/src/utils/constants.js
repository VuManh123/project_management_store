import {
  ProjectStatus,
  ProjectStatusNames,
  ProjectMemberRole,
  ProjectMemberRoleNames,
  TaskStatus,
  TaskStatusNames,
  TaskPriority,
  TaskPriorityNames,
  TaskType,
  TaskTypeNames,
  getEnumName,
} from './enums';

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Routes
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAIL: '/projects/:id',
  TASKS: '/tasks',
  CHAT: '/chat',
  NOT_FOUND: '/404',
};

// Re-export enums for backward compatibility
export { ProjectStatus, TaskStatus, TaskPriority, TaskType };

// User Roles (keep for backward compatibility)
export const ROLES = {
  PM: 'PM',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
};

// ============================================================================
// COLOR MAPPINGS FOR UI
// ============================================================================

// Task Status Colors
export const getTaskStatusColor = (status) => {
  const colorMap = {
    [TaskStatus.TODO]: 'default',
    [TaskStatus.IN_PROGRESS]: 'processing',
    [TaskStatus.REVIEW]: 'warning',
    [TaskStatus.DONE]: 'success',
    [TaskStatus.REJECT]: 'error',
  };
  return colorMap[status] || 'default';
};

// Task Status Name
export const getTaskStatusName = (status) => {
  return getEnumName(status, TaskStatusNames);
};

// Project Status Colors
export const getProjectStatusColor = (status) => {
  const colorMap = {
    [ProjectStatus.ACTIVE]: 'success',
    [ProjectStatus.ARCHIVED]: 'default',
  };
  return colorMap[status] || 'default';
};

// Project Status Name
export const getProjectStatusName = (status) => {
  return getEnumName(status, ProjectStatusNames);
};

// Task Priority Colors
export const getTaskPriorityColor = (priority) => {
  const colorMap = {
    [TaskPriority.LOW]: 'default',
    [TaskPriority.MEDIUM]: 'processing',
    [TaskPriority.HIGH]: 'warning',
    [TaskPriority.CRITICAL]: 'error',
  };
  return colorMap[priority] || 'default';
};

// Task Priority Name
export const getTaskPriorityName = (priority) => {
  return getEnumName(priority, TaskPriorityNames);
};

// Task Type Colors
export const getTaskTypeColor = (type) => {
  const colorMap = {
    [TaskType.TASK]: 'blue',
    [TaskType.BUG]: 'red',
    [TaskType.STORY]: 'green',
    [TaskType.EPIC]: 'purple',
  };
  return colorMap[type] || 'default';
};

// Task Type Name
export const getTaskTypeName = (type) => {
  return getEnumName(type, TaskTypeNames);
};

// Project Member Role Colors
export const getProjectMemberRoleColor = (role) => {
  const colorMap = {
    [ProjectMemberRole.PM]: 'gold',
    [ProjectMemberRole.LEADER]: 'blue',
    [ProjectMemberRole.MEMBER]: 'default',
  };
  return colorMap[role] || 'default';
};

// Project Member Role Name
export const getProjectMemberRoleName = (role) => {
  return getEnumName(role, ProjectMemberRoleNames);
};

// Backward compatibility
export const getPriorityColor = getTaskPriorityColor;

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
};

// Transition Presets
export const TRANSITIONS = {
  smooth: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  quick: {
    duration: 0.2,
    ease: 'easeOut',
  },
};
