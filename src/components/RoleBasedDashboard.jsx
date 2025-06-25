import React from 'react';
import { useAuth } from '../hooks/useAuth';
import SystemAdminDashboard from '../pages/dashboards/SystemAdminDashboards';
import TenantAdminDashboard from '../pages/dashboards/TenantAdminDashboard';
import LoadingSpinner from '../components/common/LoadingSpinner';

// Import the regular user dashboard (the current Dashboard.jsx)
import UserDashboard from '../pages/Dashboard';

/**
 * Role-Based Dashboard Router Component
 * Renders the appropriate dashboard based on user role
 */
const RoleBasedDashboard = () => {
  const { user, userRole, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!user) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  // Route to appropriate dashboard based on user role
  switch (userRole) {
    case 'system_admin':
      return <SystemAdminDashboard />;
    
    case 'tenant_admin':
      return <TenantAdminDashboard />;
    
    case 'user':
    default:
      return <UserDashboard />;
  }
};

export default RoleBasedDashboard;