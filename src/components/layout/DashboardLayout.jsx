// src/components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Building, 
  LogOut,
  User,
  ChevronDown,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import RoleBasedNavigation from './RoleBasedNavigation';

/**
 * Enhanced Dashboard Layout Component
 * Provides role-based layout structure with dynamic navigation
 */
const DashboardLayout = ({ children }) => {
  const { user, logout, getRoleDisplayName } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  /**
   * Handle logout
   */
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    logout();
    setUserMenuOpen(false);
    setShowLogoutConfirm(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  /**
   * Get the appropriate app title based on user role
   */
  const getAppTitle = () => {
    const { isSystemAdmin, isTenantAdmin } = useAuth();
    
    if (isSystemAdmin()) {
      return 'System Management';
    } else if (isTenantAdmin()) {
      return 'Tenant Management';
    } else {
      return 'User Portal';
    }
  };

  /**
   * Get the appropriate theme color based on user role
   */
  const getThemeColors = () => {
    const { isSystemAdmin, isTenantAdmin } = useAuth();
    
    if (isSystemAdmin()) {
      return {
        primary: 'bg-blue-600',
        hover: 'hover:bg-blue-700',
        focus: 'focus:ring-blue-500'
      };
    } else if (isTenantAdmin()) {
      return {
        primary: 'bg-green-600',
        hover: 'hover:bg-green-700',
        focus: 'focus:ring-green-500'
      };
    } else {
      return {
        primary: 'bg-indigo-600',
        hover: 'hover:bg-indigo-700',
        focus: 'focus:ring-indigo-500'
      };
    }
  };

  const themeColors = getThemeColors();

  /**
   * Sidebar Component
   */
  const Sidebar = ({ mobile = false }) => (
    <div className={`
      ${mobile ? 'fixed inset-0 z-40' : 'hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col'}
    `}>
      {/* Mobile overlay */}
      {mobile && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar content */}
      <div className={`
        relative flex-1 flex flex-col min-h-0 bg-white shadow-lg
        ${mobile ? 'w-64 ml-0' : 'w-full'}
      `}>
        {/* Mobile close button */}
        {mobile && (
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
        )}

        {/* Logo */}
        <div className={`flex items-center h-16 flex-shrink-0 px-4 ${themeColors.primary}`}>
          <Building className="h-8 w-8 text-white" />
          <span className="ml-2 text-white text-lg font-semibold">
            {getAppTitle()}
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <RoleBasedNavigation />
        </div>

        {/* User info */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className={`h-8 w-8 ${themeColors.primary} rounded-full flex items-center justify-center`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{getRoleDisplayName()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar */}
      {sidebarOpen && <Sidebar mobile />}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden lg:ml-64">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          {/* Mobile menu button */}
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Navigation content */}
          <div className="flex-1 px-4 flex justify-between">
            {/* Left side - Role indicator */}
            <div className="flex-1 flex items-center">
              <div className="flex items-center space-x-3">
                <span className={`
                  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white
                  ${themeColors.primary}
                `}>
                  {getRoleDisplayName()}
                </span>
                {user?.tenant_id && (
                  <span className="text-sm text-gray-500">
                    Tenant: {user.tenant_id.substring(0, 8)}...
                  </span>
                )}
              </div>
            </div>

            {/* Right side - notifications and user menu */}
            <div className="ml-4 flex items-center space-x-4">
              {/* Notifications */}
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Bell className="h-6 w-6" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  type="button"
                  className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className={`h-8 w-8 ${themeColors.primary} rounded-full flex items-center justify-center`}>
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <span className="hidden md:ml-3 md:block text-gray-700 text-sm font-medium">
                    {user?.name}
                  </span>
                  <ChevronDown className="hidden md:ml-1 md:block h-4 w-4 text-gray-400" />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                      {user?.email}
                    </div>
                    <a
                      href="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </a>
                    <a
                      href="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </a>
                    <button
                      onClick={handleLogoutClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Logout</h3>
              <button onClick={handleCancelLogout} className="text-gray-400 hover:text-gray-600 focus:outline-none">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-700 mb-6">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;