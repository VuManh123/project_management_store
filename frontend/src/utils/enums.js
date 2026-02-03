/**
 * Frontend Enums - Synced with Backend
 * =====================================
 * This file contains all enum values synchronized from backend
 * DO NOT modify these values unless backend enums are also updated
 */

// ============================================================================
// PROJECT ENUMS
// ============================================================================

export const ProjectStatus = {
  ACTIVE: 1,
  ARCHIVED: 2,
};

export const ProjectMemberRole = {
  PM: 1,
  LEADER: 2,
  MEMBER: 3,
};

// ============================================================================
// TASK ENUMS
// ============================================================================

export const TaskStatus = {
  TODO: 1,
  IN_PROGRESS: 2,
  REVIEW: 3,
  DONE: 4,
  REJECT: 5,
};

export const TaskPriority = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

export const TaskType = {
  TASK: 1,
  BUG: 2,
  STORY: 3,
  EPIC: 4,
};

export const TaskReportStatus = {
  PENDING: 1,
  APPROVED: 2,
  REJECTED: 3,
};

// ============================================================================
// USER ENUMS
// ============================================================================

export const UserStatus = {
  ACTIVE: 1,
  BLOCKED: 2,
};

// ============================================================================
// NOTIFICATION & MESSAGE ENUMS
// ============================================================================

export const NotificationType = {
  TASK_ASSIGNED: 1,
  COMMENT: 2,
  MESSAGE: 3,
};

export const MessageType = {
  TEXT: 1,
  FILE: 2,
  IMAGE: 3,
};

export const ConversationType = {
  PRIVATE: 1,
  GROUP: 2,
};

// ============================================================================
// ENUM TO NAME MAPPINGS
// ============================================================================

export const ProjectStatusNames = {
  [ProjectStatus.ACTIVE]: 'ACTIVE',
  [ProjectStatus.ARCHIVED]: 'ARCHIVED',
};

export const ProjectMemberRoleNames = {
  [ProjectMemberRole.PM]: 'PM',
  [ProjectMemberRole.LEADER]: 'LEADER',
  [ProjectMemberRole.MEMBER]: 'MEMBER',
};

export const TaskStatusNames = {
  [TaskStatus.TODO]: 'TODO',
  [TaskStatus.IN_PROGRESS]: 'IN_PROGRESS',
  [TaskStatus.REVIEW]: 'REVIEW',
  [TaskStatus.DONE]: 'DONE',
  [TaskStatus.REJECT]: 'REJECT',
};

export const TaskPriorityNames = {
  [TaskPriority.LOW]: 'LOW',
  [TaskPriority.MEDIUM]: 'MEDIUM',
  [TaskPriority.HIGH]: 'HIGH',
  [TaskPriority.CRITICAL]: 'CRITICAL',
};

export const TaskTypeNames = {
  [TaskType.TASK]: 'TASK',
  [TaskType.BUG]: 'BUG',
  [TaskType.STORY]: 'STORY',
  [TaskType.EPIC]: 'EPIC',
};

export const TaskReportStatusNames = {
  [TaskReportStatus.PENDING]: 'PENDING',
  [TaskReportStatus.APPROVED]: 'APPROVED',
  [TaskReportStatus.REJECTED]: 'REJECTED',
};

export const UserStatusNames = {
  [UserStatus.ACTIVE]: 'ACTIVE',
  [UserStatus.BLOCKED]: 'BLOCKED',
};

export const NotificationTypeNames = {
  [NotificationType.TASK_ASSIGNED]: 'TASK_ASSIGNED',
  [NotificationType.COMMENT]: 'COMMENT',
  [NotificationType.MESSAGE]: 'MESSAGE',
};

export const MessageTypeNames = {
  [MessageType.TEXT]: 'TEXT',
  [MessageType.FILE]: 'FILE',
  [MessageType.IMAGE]: 'IMAGE',
};

export const ConversationTypeNames = {
  [ConversationType.PRIVATE]: 'PRIVATE',
  [ConversationType.GROUP]: 'GROUP',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get display name from enum value
 */
export const getEnumName = (value, enumMap) => {
  return enumMap[value] || 'UNKNOWN';
};

/**
 * Get enum value from name
 */
export const getEnumValue = (name, enumObject) => {
  return enumObject[name] || null;
};

/**
 * Check if value is valid for enum
 */
export const isValidEnum = (value, enumObject) => {
  return Object.values(enumObject).includes(value);
};
