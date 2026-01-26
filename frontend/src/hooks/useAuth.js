import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const { isAuthenticated, initAuth, user } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  return {
    isAuthenticated,
    user,
    hasRole,
    hasAnyRole,
  };
};
