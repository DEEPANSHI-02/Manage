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
    initializeAuth,
    checkTokenValidity
  } = useAuthStore();

  // Initialize authentication on mount - ENHANCED VERSION
  useEffect(() => {
    console.log('🔧 useAuth hook mounted');
    console.log('Current state:', { token: !!token, user: !!user, isAuthenticated, userRole });
    
    // Only initialize if we have a token but no user
    if (token && !user) {
      console.log('🔄 Initializing auth because token exists but no user');
      initializeAuth();
    } else if (token && user && !isAuthenticated) {
      console.log('⚠️ We have token and user but not authenticated - fixing state');
      // This shouldn't happen, but if it does, let's fix it
      initializeAuth();
    } else if (!token && !user && isAuthenticated) {
      console.log('⚠️ Authenticated but no token/user - clearing state');
      logout();
    } else {
      console.log('✅ Auth state is consistent');
    }
  }, [token, user, isAuthenticated, initializeAuth, logout]);

  // Debug logging for role detection - ENHANCED
  useEffect(() => {
    if (user && userRole) {
      console.log('=== useAuth Hook Debug ===');
      console.log('User:', user.email);
      console.log('UserRole:', userRole);
      console.log('isSystemAdmin():', isSystemAdmin());
      console.log('isTenantAdmin():', isTenantAdmin());
      console.log('isRegularUser():', isRegularUser());
      console.log('isAuthenticated:', isAuthenticated);
      console.log('================================');
    }
  }, [user, userRole, isSystemAdmin, isTenantAdmin, isRegularUser, isAuthenticated]);

  // Periodically check token validity and auto-logout if expired
  useEffect(() => {
    const check = () => checkTokenValidity();
    check(); // Check on mount
    const interval = setInterval(check, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [checkTokenValidity]);

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