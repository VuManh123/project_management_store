import { useMemo } from 'react';
import useAuthStore from '../store/authStore';
import * as permissions from '../utils/permissions';

export const usePermission = () => {
  const user = useAuthStore((state) => state.user);

  const checkPermission = useMemo(() => {
    return {
      hasRole: (role) => permissions.hasRole(user, role),
      isPM: () => permissions.isPM(user),
      isLeader: () => permissions.isLeader(user),
      isMember: () => permissions.isMember(user),
      isPMOrLeader: () => permissions.isPMOrLeader(user),
      canManageProject: (project) => permissions.canManageProject(user, project),
      canEditTask: (task) => permissions.canEditTask(user, task),
      canDeleteTask: (task) => permissions.canDeleteTask(user, task),
      canAssignTask: () => permissions.canAssignTask(user),
      canReviewTask: () => permissions.canReviewTask(user),
      canAddMembers: (project) => permissions.canAddMembers(user, project),
      canRemoveMembers: (project) => permissions.canRemoveMembers(user, project),
      canChangeMemberRole: (project) => permissions.canChangeMemberRole(user, project),
    };
  }, [user]);

  return checkPermission;
};
