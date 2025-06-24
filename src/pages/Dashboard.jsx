import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Shield, 
  FileText, 
  TrendingUp, 
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { mockApi } from '../services/mockApi';

/**
 * Dashboard Page Component
 * Provides overview and quick access to system functions
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    organizations: 0,
    roles: 0,
    legalEntities: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch statistics (mock data for now)
        const [usersRes, orgsRes, rolesRes, entitiesRes] = await Promise.all([
          mockApi.getUsers(user?.tenant_id),
          mockApi.getOrganizations(user?.tenant_id),
          mockApi.getRoles(user?.tenant_id),
          mockApi.getLegalEntities(user?.tenant_id)
        ]);

        setStats({
          users: usersRes.data.length,
          organizations: orgsRes.data.length,
          roles: rolesRes.data.length,
          legalEntities: entitiesRes.data.length
        });

        // Mock recent activity
        setRecentActivity([
          {
            id: 1,
            type: 'user_created',
            description: 'New user Mike Chen was created',
            time: '2 hours ago',
            icon: Users,
            color: 'text-green-600'
          },
          {
            id: 2,
            type: 'role_assigned',
            description: 'Manager role assigned to Sarah Johnson',
            time: '4 hours ago',
            icon: Shield,
            color: 'text-blue-600'
          },
          {
            id: 3,
            type: 'organization_updated',
            description: 'Engineering Division profile updated',
            time: '1 day ago',
            icon: Building,
            color: 'text-yellow-600'
          },
          {
            id: 4,
            type: 'legal_entity_created',
            description: 'New legal entity TechCorp International Inc. created',
            time: '2 days ago',
            icon: FileText,
            color: 'text-purple-600'
          }
        ]);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.tenant_id) {
      loadDashboardData();
    }
  }, [user]);

  // Statistics cards configuration
  const statCards = [
    {
      name: 'Total Users',
      value: stats.users,
      icon: Users,
      color: 'bg-blue-500',
      href: '/users',
      change: '+12%',
      changeType: 'increase'
    },
    {
      name: 'Organizations',
      value: stats.organizations,
      icon: Building,
      color: 'bg-green-500',
      href: '/organizations',
      change: '+5%',
      changeType: 'increase'
    },
    {
      name: 'Active Roles',
      value: stats.roles,
      icon: Shield,
      color: 'bg-yellow-500',
      href: '/roles',
      change: '+2%',
      changeType: 'increase'
    },
    {
      name: 'Legal Entities',
      value: stats.legalEntities,
      icon: FileText,
      color: 'bg-purple-500',
      href: '/legal-entities',
      change: '0%',
      changeType: 'neutral'
    }
  ];

  // Quick actions configuration
  const quickActions = [
    {
      name: 'Add New User',
      description: 'Create a new user account',
      href: '/users?action=create',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Manage Roles',
      description: 'Configure user roles and permissions',
      href: '/roles',
      icon: Shield,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'View Organizations',
      description: 'Manage organizational structure',
      href: '/organizations',
      icon: Building,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      name: 'System Settings',
      description: 'Configure system preferences',
      href: '/settings',
      icon: Activity,
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow h-96"></div>
          <div className="bg-white p-6 rounded-lg shadow h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here's what's happening with your user management system today.
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.name}
              to={card.href}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <div className={`absolute ${card.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {card.name}
                </p>
                <p className="ml-16 text-2xl font-semibold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span
                    className={`
                      font-medium
                      ${card.changeType === 'increase' ? 'text-green-600' : 
                        card.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'}
                    `}
                  >
                    {card.change}
                  </span>
                  <span className="text-gray-500"> from last month</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            <p className="mt-1 text-sm text-gray-600">
              Frequently used actions and shortcuts
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.name}
                    to={action.href}
                    className={`
                      relative rounded-lg p-4 text-white ${action.color}
                      transition duration-150 ease-in-out transform hover:scale-105
                    `}
                  >
                    <div className="flex items-center">
                      <Icon className="h-6 w-6 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium">{action.name}</h3>
                        <p className="text-xs text-white/80">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <p className="mt-1 text-sm text-gray-600">
              Latest changes and updates in your system
            </p>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, activityIdx) => {
                  const Icon = activity.icon;
                  return (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivity.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`
                              h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                              ${activity.color.includes('green') ? 'bg-green-100' :
                                activity.color.includes('blue') ? 'bg-blue-100' :
                                activity.color.includes('yellow') ? 'bg-yellow-100' :
                                'bg-purple-100'}
                            `}>
                              <Icon className={`h-4 w-4 ${activity.color}`} />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-900">Authentication Service</span>
              <span className="ml-auto text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-900">User Management API</span>
              <span className="ml-auto text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-900">Database Connection</span>
              <span className="ml-auto text-sm text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;