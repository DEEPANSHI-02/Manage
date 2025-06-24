import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Building, 
  Users, 
  Shield, 
  Key, 
  FileText, 
  Settings,
  LogOut,
  User,
  ChevronDown,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Dashboard Layout Component
 * Provides the main layout structure with sidebar navigation
 */
const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Navigation items configuration
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Tenants',
      href: '/tenants',
      icon: Building,
      current: location.pathname === '/tenants',
      requiredPrivileges: ['tenant.manage']
    },
    {
      name: 'Organizations',
      href: '/organizations',
      icon: Building,
      current: location.pathname === '/organizations',
      requiredPrivileges: ['organization.manage']
    },
    {
      name: 'Users',
      href: '/users',
      icon: Users,
      current: location.pathname === '/users',
      requiredPrivileges: ['user.read']
    },
    {
      name: 'Roles',
      href: '/roles',
      icon: Shield,
      current: location.pathname === '/roles',
      requiredPrivileges: ['role.manage']
    },
    {
      name: 'Privileges',
      href: '/privileges',
      icon: Key,
      current: location.pathname === '/privileges',
      requiredPrivileges: ['role.manage']
    },
    {
      name: 'Legal Entities',
      href: '/legal-entities',
      icon: FileText,
      current: location.pathname === '/legal-entities'
    }
  ];

  /**
   * Handle logout
   */
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

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
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-indigo-600">
          <Building className="h-8 w-8 text-white" />
          <span className="ml-2 text-white text-lg font-semibold">
            User Management
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 px-2 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => mobile && setSidebarOpen(false)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${item.current
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className={`
                    mr-3 flex-shrink-0 h-5 w-5
                    ${item.current ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User info */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
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
            {/* Left side - could add breadcrumbs here */}
            <div className="flex-1 flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigationItems.find(item => item.current)?.name || 'Dashboard'}
              </h1>
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
                  <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
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
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
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
    </div>
  );
};

export default DashboardLayout;