import { useEffect } from 'react';
import useAuthStore from '../store/authStore';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and methods
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
    hasPrivilege,
    hasRole,
    initializeAuth
  } = useAuthStore();

  // Initialize authentication on mount
  useEffect(() => {
    if (token && !user) {
      initializeAuth();
    }
  }, [token, user, initializeAuth]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateProfile,
    hasPrivilege,
    hasRole
  };
};