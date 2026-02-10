import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  return {
    isAuthenticated,
    isInitialized,
    user,
    hasRole,
    hasAnyRole,
  };
};
