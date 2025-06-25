import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Shield, 
  UserPlus,
  Settings,
  BarChart3,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Building2,
  Key,
  Target,
  Award,
  Bell
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { mockApi } from '../../services/mockApi';

/**
 * Tenant Administrator Dashboard
 * Tenant-specific management and oversight
 */
const TenantAdminDashboard = () => {
  const { user } = useAuth();
  const [tenantStats, setTenantStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrganizations: 0,
    totalRoles: 0,
    pendingApprovals: 0
  });
  const [tenantActivity, setTenantActivity] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTenantDashboardData();
  }, [user]);

  const loadTenantDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!user?.tenant_id) return;

      // Load tenant-specific statistics
      const [usersRes, orgsRes, rolesRes] = await Promise.all([
        mockApi.getUsers(user.tenant_id),
        mockApi.getOrganizations(user.tenant_id),
        mockApi.getRoles(user.tenant_id)
      ]);

      setTenantStats({
        totalUsers: usersRes.data.length,
        activeUsers: usersRes.data.filter(u => u.active).length,
        totalOrganizations: orgsRes.data.length,
        totalRoles: rolesRes.data.length,
        pendingApprovals: 3 // Mock pending approvals
      });

      // Mock tenant activity
      setTenantActivity([
        {
          id: 1,
          type: 'user_created',
          description: 'New user Emma Thompson was added to HR department',
          user: 'System',
          time: '10 minutes ago',
          icon: UserPlus,
          color: 'text-green-600'
        },
        {
          id: 2,
          type: 'role_assigned',
          description: 'Manager role assigned to Mike Chen',
          user: 'Sarah Johnson',
          time: '30 minutes ago',
          icon: Shield,
          color: 'text-blue-600'
        },
        {
          id: 3,
          type: 'organization_updated',
          description: 'Engineering Division structure updated',
          user: 'Sarah Johnson',
          time: '1 hour ago',
          icon: Building,
          color: 'text-yellow-600'
        },
        {
          id: 4,
          type: 'user_deactivated',
          description: 'Inactive user account cleaned up',
          user: 'System',
          time: '2 hours ago',
          icon: UserCheck,
          color: 'text-gray-600'
        }
      ]);

      // Mock pending tasks
      setPendingTasks([
        {
          id: 1,
          title: 'User Access Request',
          description: 'Emma Thompson requesting additional privileges',
          priority: 'high',
          dueDate: '2024-06-25',
          type: 'approval'
        },
        {
          id: 2,
          title: 'Department Restructure',
          description: 'Review proposed changes to Sales department',
          priority: 'medium',
          dueDate: '2024-06-26',
          type: 'review'
        },
        {
          id: 3,
          title: 'Quarterly Access Review',
          description: 'Review user access permissions for Q2',
          priority: 'low',
          dueDate: '2024-06-30',
          type: 'review'
        }
      ]);

    } catch (error) {
      console.error('Error loading tenant dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tenant Admin specific metrics
  const tenantMetrics = [
    {
      name: 'Total Users',
      value: tenantStats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+3 this week',
      href: '/users'
    },
    {
      name: 'Active Users',
      value: tenantStats.activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      change: '95% active rate',
      href: '/users?filter=active'
    },
    {
      name: 'Organizations',
      value: tenantStats.totalOrganizations,
      icon: Building,
      color: 'bg-purple-500',
      change: 'Well structured',
      href: '/organizations'
    },
    {
      name: 'Pending Tasks',
      value: tenantStats.pendingApprovals,
      icon: Clock,
      color: 'bg-orange-500',
      change: 'Requires attention',
      href: '/admin/tasks'
    }
  ];

  // Tenant Admin quick actions
  const tenantActions = [
    {
      name: 'Manage Users',
      description: 'Add, edit, and manage user accounts',
      href: '/users',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Organization Setup',
      description: 'Configure organizational structure',
      href: '/organizations',
      icon: Building2,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Role Management',
      description: 'Create and assign user roles',
      href: '/roles',
      icon: Shield,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Privilege Control',
      description: 'Manage user privileges and permissions',
      href: '/privileges',
      icon: Key,
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      name: 'Tenant Settings',
      description: 'Configure tenant preferences',
      href: '/settings',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      name: 'Analytics & Reports',
      description: 'View user and organization analytics',
      href: '/reports',
      icon: BarChart3,
      color: 'bg-indigo-600 hover:bg-indigo-700'
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
      {/* Tenant Admin Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 shadow rounded-lg">
        <div className="px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Tenant Administrator Dashboard</h1>
              <p className="mt-1 text-green-100">
                Tenant management and oversight - Welcome, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                <span className="text-sm">TechCorp Solutions</span>
              </div>
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Tasks Alert */}
      {pendingTasks.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-orange-500" />
              Pending Tasks
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                {pendingTasks.length}
              </span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className={`
                  p-3 rounded-lg border-l-4 cursor-pointer hover:bg-gray-50
                  ${task.priority === 'high' ? 'bg-red-50 border-red-400' :
                    task.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'}
                `}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                    </div>
                    <div className="text-right">
                      <span className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${task.priority === 'high' ? 'bg-red-100 text-red-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'}
                      `}>
                        {task.priority}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">Due: {task.dueDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tenant Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tenantMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.name}
              to={metric.href}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <div className={`absolute ${metric.color} rounded-md p-3`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {metric.name}
                </p>
                <p className="ml-16 text-2xl font-semibold text-gray-900">
                  {metric.value}
                </p>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <span className="font-medium text-green-600">
                    {metric.change}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tenant Management Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tenant Management</h2>
            <p className="mt-1 text-sm text-gray-600">
              Essential tenant administration tools
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {tenantActions.map((action) => {
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

        {/* Tenant Activity Feed */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
            <p className="mt-1 text-sm text-gray-600">
              Latest changes and updates in your tenant
            </p>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {tenantActivity.map((activity, activityIdx) => {
                  const Icon = activity.icon;
                  return (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== tenantActivity.length - 1 && (
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
                                'bg-gray-100'}
                            `}>
                              <Icon className={`h-4 w-4 ${activity.color}`} />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-900">
                                {activity.description}
                              </p>
                              <p className="text-xs text-gray-500">
                                by {activity.user}
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

      {/* Quick Stats and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart Placeholder */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">User Growth</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Chart Coming Soon</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className="text-gray-500">This Month</span>
              <span className="font-medium text-green-600">+12%</span>
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Role Distribution</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Administrators</span>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Managers</span>
                <span className="text-sm font-medium">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Users</span>
                <span className="text-sm font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">HR Specialists</span>
                <span className="text-sm font-medium">3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Health */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Tenant Health</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-900">User Management</span>
                <span className="ml-auto text-sm text-green-600">Healthy</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-900">Organizations</span>
                <span className="ml-auto text-sm text-green-600">Healthy</span>
              </div>
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-sm text-gray-900">Permissions</span>
                <span className="ml-auto text-sm text-yellow-600">Review Needed</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm text-gray-900">Data Sync</span>
                <span className="ml-auto text-sm text-green-600">Synchronized</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantAdminDashboard;