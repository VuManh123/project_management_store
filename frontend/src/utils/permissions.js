import { ROLES } from './constants';

// Check if user has specific role
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role;
};

// Check if user is PM
export const isPM = (user) => {
  return hasRole(user, ROLES.PM);
};

// Check if user is Leader
export const isLeader = (user) => {
  return hasRole(user, ROLES.LEADER);
};

// Check if user is Member
export const isMember = (user) => {
  return hasRole(user, ROLES.MEMBER);
};

// Check if user is PM or Leader
export const isPMOrLeader = (user) => {
  return isPM(user) || isLeader(user);
};

// Check if user can manage project
export const canManageProject = (user, project) => {
  if (!user || !project) return false;
  if (isPM(user)) return true;
  if (isLeader(user)) {
    // Check if user is project leader
    const member = project.members?.find((m) => m.userId === user.id);
    return member?.role === ROLES.LEADER;
  }
  return false;
};

// Check if user can edit task
export const canEditTask = (user, task) => {
  if (!user || !task) return false;
  if (isPM(user)) return true;
  if (isLeader(user)) return true;
  // Member can edit if assigned to them
  return task.assigneeId === user.id;
};

// Check if user can delete task
export const canDeleteTask = (user, task) => {
  if (!user || !task) return false;
  if (isPM(user)) return true;
  if (isLeader(user)) return true;
  return false;
};

// Check if user can assign task
export const canAssignTask = (user) => {
  return isPMOrLeader(user);
};

// Check if user can review task
export const canReviewTask = (user) => {
  return isPMOrLeader(user);
};

// Check if user can add members to project
export const canAddMembers = (user, project) => {
  return canManageProject(user, project);
};

// Check if user can remove members from project
export const canRemoveMembers = (user, project) => {
  return canManageProject(user, project);
};

// Check if user can change member role
export const canChangeMemberRole = (user, project) => {
  return canManageProject(user, project);
};
