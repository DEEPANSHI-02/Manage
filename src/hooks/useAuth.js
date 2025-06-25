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
    userRole,
    permissions,
    login,
    logout,
    updateProfile,
    hasPermission,
    isSystemAdmin,
    isTenantAdmin,
    isRegularUser,
    getDashboardType,
    getRoleDisplayName,
    initializeAuth
  } = useAuthStore();

  // Initialize authentication on mount
  useEffect(() => {
    if (token && !user) {
      initializeAuth();
    }
  }, [token, user, initializeAuth]);

  // Debug logging for role detection
  useEffect(() => {
    if (user && userRole) {
      console.log('=== useAuth Hook Debug ===');
      console.log('User:', user.email);
      console.log('UserRole:', userRole);
      console.log('isSystemAdmin():', isSystemAdmin());
      console.log('isTenantAdmin():', isTenantAdmin());
      console.log('isRegularUser():', isRegularUser());
      console.log('================================');
    }
  }, [user, userRole, isSystemAdmin, isTenantAdmin, isRegularUser]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    userRole,
    permissions,
    
    // Actions
    login,
    logout,
    updateProfile,
    
    // Permission checks
    hasPermission,
    
    // Role checks
    isSystemAdmin,
    isTenantAdmin,
    isRegularUser,
    
    // Utility functions
    getDashboardType,
    getRoleDisplayName,
    
    // Backwards compatibility for any existing code
    hasPrivilege: hasPermission,
    hasRole: (roleName) => userRole === roleName
  };
};