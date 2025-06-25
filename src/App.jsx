import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import TenantManagement from './pages/TenantManagement';

// Import all three dashboards directly
import SystemAdminDashboard from './pages/dashboards/SystemAdminDashboards';
import TenantAdminDashboard from './pages/dashboards/TenantAdminDashboard';
import UserDashboard from './pages/Dashboard';

import DebugDashboard from './components/DebugDashboard';

import { 
  OrganizationManagement,
  UserManagement,
  RoleManagement,
  PrivilegeManagement,
  LegalEntityManagement,
  Profile,
  SettingsPage
} from './pages/PlaceholderPages';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

/**
 * Role-Based Dashboard Component
 * Renders appropriate dashboard based on user role
 */
const RoleBasedDashboard = () => {
  const { user, userRole, loading } = useAuth();

  // Debug logging
  console.log('=== DASHBOARD ROUTING DEBUG ===');
  console.log('User:', user);
  console.log('User Role:', userRole);
  console.log('User Email:', user?.email);
  console.log('Loading:', loading);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!user) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  // Route to appropriate dashboard based on user role
  console.log('Routing to dashboard for role:', userRole);
  
  switch (userRole) {
    case 'system_admin':
      console.log('Rendering SystemAdminDashboard');
      return <SystemAdminDashboard />;
    
    case 'tenant_admin':
      console.log('Rendering TenantAdminDashboard');
      return <TenantAdminDashboard />;
    
    case 'user':
    default:
      console.log('Rendering UserDashboard (default)');
      return <UserDashboard />;
  }
};

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
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
 * Main Application Component
 * Handles routing and global layout
 */
function App() {
  return (
    <Router>
      <div className="App">
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
                    {/* <Route path="/dashboard" element={<RoleBasedDashboard />} /> */}
                    <Route path="/dashboard" element={<DebugDashboard />} />
                    
                    {/* Other routes */}
                    <Route path="/tenants" element={<TenantManagement />} />
                    <Route path="/organizations" element={<OrganizationManagement />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/roles" element={<RoleManagement />} />
                    <Route path="/privileges" element={<PrivilegeManagement />} />
                    <Route path="/legal-entities" element={<LegalEntityManagement />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<SettingsPage />} />
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