import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import TenantManagement from './pages/TenantManagement';
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
                    <Route path="/dashboard" element={<Dashboard />} />
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