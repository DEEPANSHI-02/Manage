import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import TenantManagement from './pages/TenantManagement';
import OrganizationManagement from './pages/OrganizationManagement';
import SystemUsersPage from './pages/SystemUsersPage';
import RoleManagement from './pages/roles/RoleManagement';

// Import all three dashboards
import SystemAdminDashboard from './pages/dashboards/SystemAdminDashboards';
import TenantAdminDashboard from './pages/dashboards/TenantAdminDashboard';
import UserPortal from './pages/UserPortal';

import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';
import PrivilegeManagement from './pages/system/PrivilegeManagement';
import LegalEntityManagement from './pages/system/LegalEntityManagement';
import SystemMonitoring from './pages/system/SystemMonitoring';
import SystemConfiguration from './pages/system/SystemConfiguration';
import SecurityCenter from './pages/system/SecurityCenter';
import APIManagement from './pages/system/APIManagement';
import GlobalReports from './pages/system/GlobalReports';

/**
 * Role-Based Dashboard Component
 */
const RoleBasedDashboard = () => {
  const { user, userRole, loading, isSystemAdmin, isTenantAdmin, isRegularUser, isAuthenticated } = useAuth();

  // Show loading spinner while authentication is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading dashboard..." />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Render appropriate dashboard based on user role
  try {
    if (isSystemAdmin()) {
      return <SystemAdminDashboard />;
    } else if (isTenantAdmin()) {
      return <TenantAdminDashboard />;
    } else if (isRegularUser() || !userRole) {
      return <UserPortal />;
    } else {
      return <UserPortal />;
    }
  } catch (error) {
    console.error('Error rendering dashboard:', error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard Error</h2>
          <p className="text-gray-600 mb-4">There was an error loading your dashboard.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
};

/**
 * Protected Route Component
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

/**
 * Public Route Component
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

/**
 * Role-Protected Route Component
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
          <div className="mx-auto h-12 w-12 text-red-400 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-sm text-gray-500 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return children;
};

/**
 * Main Application Component - CLEANED UP VERSION
 */
function App() {
  return (
    <Router>
      <div className="App">
        {/* DEBUG COMPONENTS REMOVED - Clean production version */}
        
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
                    
                    {/* Role-based dashboard routing */}
                    <Route path="/dashboard" element={<RoleBasedDashboard />} />
                    
                    {/* User Portal Routes */}
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

                    {/* Legacy routes for compatibility */}
                    <Route 
                      path="/profile" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin', 'user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />

                    <Route 
                      path="/settings" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin', 'user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    {/* Admin Routes */}
                    <Route 
                      path="/tenants" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin']}>
                          <TenantManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/organizations" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <OrganizationManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/users" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <SystemUsersPage />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/roles" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          <RoleManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/system/privileges" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin']}>
                          <PrivilegeManagement />
                        </RoleProtectedRoute>
                      } 
                    />
                    
                    <Route 
                      path="/admin/settings" 
                      element={
                        <RoleProtectedRoute allowedRoles={['system_admin', 'tenant_admin']}>
                          {/* Placeholder for settings page */}
                        </RoleProtectedRoute>
                      } 
                    />

                    {/* New routes for regular users */}
                    <Route 
                      path="/roles-privileges" 
                      element={
                        <RoleProtectedRoute allowedRoles={['user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/sessions" 
                      element={
                        <RoleProtectedRoute allowedRoles={['user']}>
                          <UserPortal />
                        </RoleProtectedRoute>
                      } 
                    />

                    {/* System Admin routes */}
                    <Route path="/system/users" element={<RoleProtectedRoute allowedRoles={['system_admin']}><SystemUsersPage /></RoleProtectedRoute>} />
                    <Route path="/system/organizations" element={<RoleProtectedRoute allowedRoles={['system_admin']}><OrganizationManagement /></RoleProtectedRoute>} />
                    <Route path="/system/monitoring" element={<RoleProtectedRoute allowedRoles={['system_admin']}><SystemMonitoring /></RoleProtectedRoute>} />
                    <Route path="/system/config" element={<RoleProtectedRoute allowedRoles={['system_admin']}><SystemConfiguration /></RoleProtectedRoute>} />
                    <Route path="/system/security" element={<RoleProtectedRoute allowedRoles={['system_admin']}><SecurityCenter /></RoleProtectedRoute>} />
                    <Route path="/system/api-management" element={<RoleProtectedRoute allowedRoles={['system_admin']}><APIManagement /></RoleProtectedRoute>} />
                    <Route path="/system/global-reports" element={<RoleProtectedRoute allowedRoles={['system_admin']}><GlobalReports /></RoleProtectedRoute>} />

                    {/* Catch-all route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
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
            error: {
              duration: 5000,
              style: {
                background: '#ef4444',
                color: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;