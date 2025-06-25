import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * Clean Dashboard Component
 * Redirects users to their appropriate portal/dashboard
 * This eliminates duplication with UserPortal
 */
const Dashboard = () => {
  const { isSystemAdmin, isTenantAdmin, isRegularUser } = useAuth();

  // Redirect to appropriate dashboard based on role
  if (isSystemAdmin()) {
    // System admins get their specialized dashboard
    return <Navigate to="/system/dashboard" replace />;
  } else if (isTenantAdmin()) {
    // Tenant admins get their specialized dashboard
    return <Navigate to="/tenant/dashboard" replace />;
  } else if (isRegularUser()) {
    // Regular users get redirected to the comprehensive UserPortal
    // This prevents duplication and ensures consistency
    return <Navigate to="/my-profile" replace />;
  }

  // Fallback - should not reach here
  return <Navigate to="/dashboard" replace />;
};

export default Dashboard;