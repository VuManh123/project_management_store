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

// User Roles
export const ROLES = {
  PM: 'PM',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
};

// Task Status
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
};

// Task Status Colors (Design System)
export const getTaskStatusColor = (status) => {
  const colors = {
    TODO: 'default', // #CBD5E1
    IN_PROGRESS: 'processing', // #3B82F6
    REVIEW: 'warning', // #F59E0B
    DONE: 'success', // #22C55E
    REJECT: 'error', // #EF4444
  };
  return colors[status] || 'default';
};

// Project Status Colors
export const getProjectStatusColor = (status) => {
  const colors = {
    active: 'success', // #22C55E
    completed: 'processing', // #3B82F6
    on_hold: 'warning', // #F59E0B
    cancelled: 'error', // #EF4444
  };
  return colors[status] || 'default';
};

// Priority Colors
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'default',
    medium: 'processing', // Blue
    high: 'warning', // Orange
    urgent: 'error', // Red
  };
  return colors[priority] || 'default';
};

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
