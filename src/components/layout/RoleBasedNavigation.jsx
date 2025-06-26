// src/components/layout/RoleBasedNavigation.jsx
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home, 
  Building, 
  Users, 
  Shield, 
  Key, 
  FileText, 
  Settings,
  Database,
  BarChart3,
  Globe,
  UserCheck,
  Monitor,
  Zap,
  Bell,
  Clock,
  Activity
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

/**
 * Role-Based Navigation Component
 * Renders different navigation items based on user role
 */
const RoleBasedNavigation = () => {
  const { userRole, isSystemAdmin, isTenantAdmin, isRegularUser } = useAuth();
  const location = useLocation();

  // System Admin Navigation Items
  const systemAdminNavigation = [
    {
      name: 'System Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'Global Tenants',
      href: '/tenants',
      icon: Building,
      current: location.pathname === '/tenants'
    },
    {
      name: 'System Users',
      href: '/system/users',
      icon: Users,
      current: location.pathname === '/system/users'
    },
    {
      name: 'Global Organizations',
      href: '/system/organizations',
      icon: Building,
      current: location.pathname === '/system/organizations'
    },
    {
      name: 'System Monitoring',
      href: '/system/monitoring',
      icon: Monitor,
      current: location.pathname === '/system/monitoring'
    },
    {
      name: 'System Configuration',
      href: '/system/config',
      icon: Settings,
      current: location.pathname === '/system/config'
    },
    {
      name: 'Security Center',
      href: '/system/security',
      icon: Shield,
      current: location.pathname === '/system/security'
    },
    {
      name: 'API Management',
      href: '/system/api',
      icon: Zap,
      current: location.pathname === '/system/api'
    },
    {
      name: 'Global Reports',
      href: '/system/reports',
      icon: BarChart3,
      current: location.pathname === '/system/reports'
    }
  ];

  // Tenant Admin Navigation Items
  const tenantAdminNavigation = [
    {
      name: 'Tenant Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'User Management',
      href: '/users',
      icon: Users,
      current: location.pathname === '/users'
    },
    {
      name: 'Organizations',
      href: '/organizations',
      icon: Building,
      current: location.pathname === '/organizations'
    },
    {
      name: 'Role Management',
      href: '/roles',
      icon: Shield,
      current: location.pathname === '/roles'
    },
    {
      name: 'Privileges',
      href: '/privileges',
      icon: Key,
      current: location.pathname === '/privileges'
    },
    {
      name: 'Legal Entities',
      href: '/legal-entities',
      icon: FileText,
      current: location.pathname === '/legal-entities'
    },
    {
      name: 'Tenant Settings',
      href: '/tenant/settings',
      icon: Settings,
      current: location.pathname === '/tenant/settings'
    },
    {
      name: 'Analytics & Reports',
      href: '/tenant/reports',
      icon: BarChart3,
      current: location.pathname === '/tenant/reports'
    },
    {
      name: 'Notifications',
      href: '/tenant/notifications',
      icon: Bell,
      current: location.pathname === '/tenant/notifications'
    }
  ];

  // Regular User Navigation Items
  const userNavigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard'
    },
    {
      name: 'My Profile',
      href: '/profile',
      icon: UserCheck,
      current: location.pathname === '/profile'
    },
    {
      name: 'My Organization',
      href: '/my-organization',
      icon: Building,
      current: location.pathname === '/my-organization'
    },
    {
      name: 'Legal Entities',
      href: '/legal-entities',
      icon: FileText,
      current: location.pathname === '/legal-entities'
    },
    {
      name: 'Roles & Privileges',
      href: '/roles-privileges',
      icon: Shield,
      current: location.pathname === '/roles-privileges'
    },
    {
      name: 'Sessions',
      href: '/sessions',
      icon: Clock,
      current: location.pathname === '/sessions'
    },
    {
      name: 'Activity',
      href: '/activity',
      icon: Activity,
      current: location.pathname === '/activity'
    },
    {
      name: 'Security',
      href: '/security',
      icon: Shield,
      current: location.pathname === '/security'
    },
    {
      name: 'My Settings',
      href: '/settings',
      icon: Settings,
      current: location.pathname === '/settings'
    }
  ];

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (isSystemAdmin()) {
      return systemAdminNavigation;
    } else if (isTenantAdmin()) {
      return tenantAdminNavigation;
    } else {
      return userNavigation;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="mt-5 px-2 space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
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
  );
};

export default RoleBasedNavigation;