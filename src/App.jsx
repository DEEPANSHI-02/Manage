import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import TenantManagement from './pages/TenantManagement';
import OrganizationManagement from './pages/OrganizationManagement';

// Import all three dashboards directly - FIXED IMPORTS
import SystemAdminDashboard from './pages/dashboards/SystemAdminDashboards';
import TenantAdminDashboard from './pages/dashboards/TenantAdminDashboard';
import UserPortal from './pages/UserPortal'; // Enhanced User Portal

import { 
  UserManagement,
  RoleManagement,
  PrivilegeManagement,
  LegalEntityManagement,
  SettingsPage
} from './pages/PlaceholderPages';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

/**
 * Role-Based Dashboard Component - FIXED VERSION
 * Renders appropriate dashboard based on user role
 */
const RoleBasedDashboard = () => {
  const { user, userRole, loading, isSystemAdmin, isTenantAdmin, isRegularUser } = useAuth();

  // Debug logging for routing
  console.log('=== RoleBasedDashboard Debug ===');
  console.log('User:', user);
  console.log('UserRole:', userRole);
  console.log('Loading:', loading);
  console.log('isSystemAdmin():', isSystemAdmin());
  console.log('isTenantAdmin():', isTenantAdmin());
  console.log('isRegularUser():', isRegularUser());

  if (loading) {
    console.log('🔄 Loading dashboard...');
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!user) {
    console.log('❌ No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on user role
  if (isSystemAdmin()) {
    console.log('✅ Routing to SystemAdminDashboard');
    return <SystemAdminDashboard />;
  } else if (isTenantAdmin()) {
    console.log('✅ Routing to TenantAdminDashboard');
    return <TenantAdminDashboard />;
  } else if (isRegularUser()) {
    console.log('✅ Routing to UserPortal');
    return <UserPortal />; // Enhanced User Portal for regular users
  } else {
    console.log('⚠️ Unknown role, defaulting to UserPortal. UserRole:', userRole);
    return <UserPortal />; // Fallback to UserPortal
  }
};

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated, 'loading:', loading);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * Public Route Component  
 * Redirects to dashboard if user is already authenticated
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

/**
 * Role-Protected Route Component
 * Restricts access based on user roles
 */
const RoleProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { userRole, isSystemAdmin, isTenantAdmin, isRegularUser } = useAuth();
  
  // System admin can access everything
  if (isSystemAdmin()) {
    return children;
  }
  
  // Check if current user role is in allowed roles
  const hasAccess = allowedRoles.includes(userRole) || 
    (allowedRoles.includes('tenant_admin') && isTenantAdmin()) ||
    (allowedRoles.includes('user') && isRegularUser());
  
  if (!hasAccess) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">
            You don't have permission to access this page.
          </p>
          <div className="mt-6">
            <Navigate to="/dashboard" replace />
          </div>
        </div>
      </div>
    );
  }
  
  return children;
};

/**
 * Debug Auth Component - TEMPORARY FOR DEBUGGING
 */
const DebugAuth = () => {
  const { user, userRole, isAuthenticated, isSystemAdmin, isTenantAdmin, isRegularUser } = useAuth();
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <div><strong>🔍 DEBUG AUTH:</strong></div>
      <div>Authenticated: {isAuthenticated ? '✅ YES' : '❌ NO'}</div>
      <div>UserRole: {userRole || '❌ NONE'}</div>
      <div>IsSystemAdmin: {isSystemAdmin() ? '✅ YES' : '❌ NO'}</div>
      <div>IsTenantAdmin: {isTenantAdmin() ? '✅ YES' : '❌ NO'}</div>
      <div>IsRegularUser: {isRegularUser() ? '✅ YES' : '❌ NO'}</div>
      <div>User Email: {user?.email || '❌ NONE'}</div>
      <div>User Name: {user?.name || '❌ NONE'}</div>
    </div>
  );
};

/**
 * Main Application Component
 * Handles routing and global layout
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* DEBUG COMPONENT - REMOVE IN PRODUCTION */}
        <DebugAuth />
        
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Role-based dashboard routing - MAIN DASHBOARD ROUTE */}
                    <Route path="/dashboard" element={<RoleBasedDashboard />} />
                    
                    {/* User Portal Routes - All route to the same UserPortal component with different tabs */}
                    <Route 
                      path="/my-profile" 
                      element={
                        <RoleProtectedRoute allowedRoles={['user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/my-organization" 
                      element={
                        <RoleProtectedRoute allowedRoles={['user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/legal-entities" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin', 'user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/activity" 
                      element={
                        <RoleProtectedRoute allowedRoles={['user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/security" 
                      element={
                        <RoleProtectedRoute allowedRoles={['user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/my-settings" 
                      element={
                        <RoleProtectedRoute allowedRoles={['user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />

                    {/* Legacy profile route for compatibility */}
                    <Route 
                      path="/profile" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin', 'user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />

                    {/* Legacy settings route for compatibility */}
                    <Route 
                      path="/settings" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin', 'user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* Tenant Management - Only for System Admins */}
                    <Route 
                      path="/tenants" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin']}>
                          <TenantManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* Organization Management - System Admin and Tenant Admin */}
                    <Route 
                      path="/organizations" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <OrganizationManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* User Management - System Admin and Tenant Admin */}
                    <Route 
                      path="/users" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <UserManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* Role Management - System Admin and Tenant Admin */}
                    <Route 
                      path="/roles" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <RoleManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* Privilege Management - System Admin and Tenant Admin */}
                    <Route 
                      path="/privileges" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <PrivilegeManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Settings - System Admin and Tenant Admin */}
                    <Route 
                      path="/admin/settings" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <SettingsPage />
                        </RoleProtectedRoute>
                      } 
                    />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        {/* Global Toast Notifications */}
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;