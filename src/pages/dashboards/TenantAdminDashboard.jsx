// src/pages/dashboards/EnhancedTenantAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Bell,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Globe,
  MapPin
} from 'lucide-react';

// Import analytics components
import AdvancedAnalyticsDashboard from '../../components/charts/AdvancedDataVisualization';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAuth } from '../../hooks/useAuth';

// Mock API for tenant-specific data
const mockTenantApi = {
  async getUsers(tenantId) {
    return {
      data: [
        {
          id: '1',
          first_name: 'Emma',
          last_name: 'Thompson',
          email: 'emma.hr@techcorp.com',
          active: true,
          role: 'HR Manager',
          department: 'Human Resources',
          last_login: '2024-06-27T08:30:00.000Z',
          created_at: '2024-01-15T10:30:00.000Z'
        },
        {
          id: '2',
          first_name: 'Mike', 
          last_name: 'Chen',
          email: 'mike.dev@techcorp.com',
          active: true,
          role: 'Senior Developer',
          department: 'Engineering',
          last_login: '2024-06-27T09:15:00.000Z',
          created_at: '2024-02-20T14:20:00.000Z'
        },
        {
          id: '3',
          first_name: 'Sarah',
          last_name: 'Johnson', 
          email: 'sarah.manager@techcorp.com',
          active: true,
          role: 'Project Manager',
          department: 'Engineering',
          last_login: '2024-06-26T16:45:00.000Z',
          created_at: '2024-03-10T09:15:00.000Z'
        },
        {
          id: '4',
          first_name: 'Lisa',
          last_name: 'Rodriguez',
          email: 'lisa.sales@techcorp.com', 
          active: false,
          role: 'Sales Lead',
          department: 'Sales',
          last_login: '2024-06-20T14:20:00.000Z',
          created_at: '2024-04-05T11:45:00.000Z'
        },
        {
          id: '5',
          first_name: 'David',
          last_name: 'Wilson',
          email: 'david.finance@techcorp.com',
          active: true,
          role: 'Finance Manager',
          department: 'Finance',
          last_login: '2024-06-27T07:45:00.000Z',
          created_at: '2024-05-12T13:30:00.000Z'
        }
      ]
    };
  },
  async getOrganizations(tenantId) {
    return {
      data: [
        {
          id: '1',
          name: 'Engineering Division',
          description: 'Software development and technical operations',
          user_count: 25,
          manager: 'Sarah Johnson',
          created_at: '2024-01-15T10:30:00.000Z'
        },
        {
          id: '2',
          name: 'Sales & Marketing',
          description: 'Sales operations and marketing campaigns',
          user_count: 12,
          manager: 'Lisa Rodriguez',
          created_at: '2024-01-20T14:20:00.000Z'
        },
        {
          id: '3',
          name: 'Human Resources',
          description: 'HR operations and employee management',
          user_count: 8,
          manager: 'Emma Thompson',
          created_at: '2024-02-01T09:15:00.000Z'
        },
        {
          id: '4',
          name: 'Finance & Operations',
          description: 'Financial planning and operational support',
          user_count: 15,
          manager: 'David Wilson',
          created_at: '2024-02-15T11:45:00.000Z'
        }
      ]
    };
  },
  async getRoles(tenantId) {
    return {
      data: [
        { id: '1', name: 'Manager', description: 'Department management', user_count: 8 },
        { id: '2', name: 'Senior Developer', description: 'Senior technical role', user_count: 15 },
        { id: '3', name: 'Developer', description: 'Software development', user_count: 22 },
        { id: '4', name: 'HR Specialist', description: 'Human resources', user_count: 5 },
        { id: '5', name: 'Sales Representative', description: 'Sales and client relations', user_count: 10 }
      ]
    };
  }
};

// Toast notifications
const toast = {
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  info: (msg) => console.log(`ℹ️ ${msg}`)
};

/**
 * Enhanced Tenant Administrator Dashboard
 * Comprehensive tenant-specific management and analytics
 */
const EnhancedTenantAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Analytics hook for tenant-specific data
  const { 
    data: analyticsData, 
    loading: analyticsLoading, 
    error: analyticsError,
    refreshData: refreshAnalytics 
  } = useAnalytics('tenant', user?.tenant_id);

  const [tenantStats, setTenantStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrganizations: 0,
    totalRoles: 0,
    pendingApprovals: 0,
    systemHealth: 'excellent'
  });

  const [tenantActivity, setTenantActivity] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [tenantAlerts, setTenantAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock tenant info
  const tenantInfo = {
    name: 'TechCorp Solutions',
    industry: 'Technology',
    founded: '2020',
    employees: 250,
    plan: 'Enterprise',
    address: 'San Francisco, CA',
    website: 'www.techcorp.com'
  };

  useEffect(() => {
    loadTenantDashboardData();
    const interval = setInterval(loadTenantDashboardData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [user]);

  const loadTenantDashboardData = async () => {
    try {
      setLoading(true);
      
      if (!user?.tenant_id) return;

      // Load tenant-specific statistics
      const [usersRes, orgsRes, rolesRes] = await Promise.all([
        mockTenantApi.getUsers(user.tenant_id),
        mockTenantApi.getOrganizations(user.tenant_id),
        mockTenantApi.getRoles(user.tenant_id)
      ]);

      const totalUsers = usersRes.data.length;
      const activeUsers = usersRes.data.filter(u => u.active).length;

      setTenantStats({
        totalUsers,
        activeUsers,
        totalOrganizations: orgsRes.data.length,
        totalRoles: rolesRes.data.length,
        pendingApprovals: 5, // Mock pending approvals
        systemHealth: 'excellent'
      });

      setRecentUsers(usersRes.data.slice(0, 5));
      setOrganizations(orgsRes.data);

      // Mock tenant-specific activity
      setTenantActivity([
        {
          id: 1,
          type: 'user_created',
          description: 'New user David Wilson added to Finance department',
          user: 'Emma Thompson',
          time: '10 minutes ago',
          icon: UserPlus,
          color: 'text-green-600'
        },
        {
          id: 2,
          type: 'role_assigned',
          description: 'Senior Developer role assigned to Mike Chen',
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
          type: 'access_granted',
          description: 'Admin privileges granted to Emma Thompson',
          user: 'System',
          time: '2 hours ago',
          icon: Key,
          color: 'text-purple-600'
        },
        {
          id: 5,
          type: 'user_deactivated',
          description: 'User account deactivated for Lisa Rodriguez',
          user: 'Emma Thompson',
          time: '3 hours ago',
          icon: UserCheck,
          color: 'text-gray-600'
        }
      ]);

      // Mock pending tasks with priorities
      setPendingTasks([
        {
          id: 1,
          title: 'User Access Request',
          description: 'Mike Chen requesting additional development server access',
          priority: 'high',
          dueDate: '2024-06-27',
          type: 'approval',
          assignee: 'IT Admin'
        },
        {
          id: 2,
          title: 'Department Restructure Review',
          description: 'Review proposed changes to Sales department hierarchy',
          priority: 'medium',
          dueDate: '2024-06-28',
          type: 'review',
          assignee: 'Emma Thompson'
        },
        {
          id: 3,
          title: 'Quarterly Access Review',
          description: 'Review user access permissions for Q2 2024',
          priority: 'medium',
          dueDate: '2024-06-30',
          type: 'review',
          assignee: 'Security Team'
        },
        {
          id: 4,
          title: 'New Role Definition',
          description: 'Define permissions for DevOps Engineer role',
          priority: 'low',
          dueDate: '2024-07-05',
          type: 'configuration',
          assignee: 'Sarah Johnson'
        },
        {
          id: 5,
          title: 'Onboarding Workflow Update',
          description: 'Update employee onboarding process documentation',
          priority: 'low',
          dueDate: '2024-07-10',
          type: 'documentation',
          assignee: 'HR Team'
        }
      ]);

      // Mock tenant alerts
      setTenantAlerts([
        {
          id: 1,
          title: 'License Utilization Alert',
          message: 'Approaching 85% of user license limit (73/85 licenses used)',
          severity: 'warning',
          timestamp: '2024-06-27T09:30:00.000Z',
          action: 'Consider upgrading plan'
        },
        {
          id: 2,
          title: 'Inactive User Cleanup',
          message: '3 users inactive for more than 30 days',
          severity: 'info',
          timestamp: '2024-06-27T08:15:00.000Z',
          action: 'Review and deactivate if needed'
        }
      ]);

    } catch (error) {
      console.error('Error loading tenant dashboard:', error);
      toast.error('Failed to load tenant data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    toast.success('Refreshing tenant data...');
    loadTenantDashboardData();
    refreshAnalytics();
  };

  const handleTaskComplete = (taskId) => {
    setPendingTasks(prev => prev.filter(task => task.id !== taskId));
    toast.success('Task completed');
  };

  const handleAlertDismiss = (alertId) => {
    setTenantAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Alert dismissed');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'error':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-800';
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
      href: '/users',
      description: 'Active team members'
    },
    {
      name: 'Active Users',
      value: tenantStats.activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      change: `${Math.round((tenantStats.activeUsers / tenantStats.totalUsers) * 100)}% active rate`,
      href: '/users?filter=active',
      description: 'Currently active users'
    },
    {
      name: 'Organizations',
      value: tenantStats.totalOrganizations,
      icon: Building,
      color: 'bg-purple-500',
      change: 'Well structured',
      href: '/organizations',
      description: 'Department divisions'
    },
    {
      name: 'Pending Tasks',
      value: tenantStats.pendingApprovals,
      icon: Clock,
      color: 'bg-orange-500',
      change: 'Requires attention',
      href: '/admin/tasks',
      description: 'Awaiting action'
    }
  ];

  // Tenant Admin quick actions
  const tenantActions = [
    {
      name: 'Manage Users',
      description: 'Add, edit, and manage user accounts',
      href: '/users',
      icon: Users,
      color: 'bg-blue-600 hover:bg-blue-700',
      count: tenantStats.totalUsers
    },
    {
      name: 'Organization Setup',
      description: 'Configure organizational structure',
      href: '/organizations',
      icon: Building2,
      color: 'bg-green-600 hover:bg-green-700',
      count: tenantStats.totalOrganizations
    },
    {
      name: 'Role Management',
      description: 'Create and assign user roles',
      href: '/roles',
      icon: Shield,
      color: 'bg-purple-600 hover:bg-purple-700',
      count: tenantStats.totalRoles
    },
    {
      name: 'Privilege Control',
      description: 'Manage user privileges and permissions',
      href: '/privileges',
      icon: Key,
      color: 'bg-orange-600 hover:bg-orange-700',
      count: '12 active'
    },
    {
      name: 'Tenant Settings',
      description: 'Configure tenant preferences',
      href: '/tenant/settings',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700',
      count: 'Configure'
    },
    {
      name: 'Analytics & Reports',
      description: 'View user and organization analytics',
      href: '/tenant/reports',
      icon: BarChart3,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      count: 'View reports'
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 p-6">
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 rounded-lg h-32"></div>
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
    <div className="space-y-6 p-6">
      {/* Tenant Admin Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-700 shadow rounded-lg">
        <div className="px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Tenant Administration</h1>
              <p className="mt-2 text-purple-100">
                Welcome to {tenantInfo.name} - Manage your organization efficiently
              </p>
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{tenantInfo.industry}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{tenantInfo.employees} employees</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  <span>{tenantInfo.plan} Plan</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleRefreshData}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">System Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Alerts */}
      {tenantAlerts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Bell className="h-5 w-5 mr-2 text-orange-500" />
                Tenant Alerts
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {tenantAlerts.length}
                </span>
              </h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tenantAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()} • {alert.action}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleAlertDismiss(alert.id)}
                      className="ml-4 text-sm bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tenant Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tenantMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.name}
              to={metric.href}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
            >
              <div>
                <div className={`absolute ${metric.color} rounded-md p-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">
                  {metric.name}
                </p>
                <p className="ml-16 text-2xl font-semibold text-gray-900">
                  {metric.value}
                </p>
                <p className="ml-16 text-xs text-gray-400 mt-1">
                  {metric.description}
                </p>
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm flex items-center">
                  <span className="font-medium text-green-600">
                    {metric.change}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Enhanced Analytics Dashboard Integration */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Tenant Analytics Overview</h2>
          <p className="text-sm text-gray-600">Comprehensive analytics for {tenantInfo.name}</p>
        </div>
        {analyticsLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 h-32 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-200 h-64 rounded"></div>
              <div className="bg-gray-200 h-64 rounded"></div>
            </div>
          </div>
        ) : analyticsError ? (
          <div className="text-red-600 text-center py-8">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Error loading analytics: {analyticsError}</p>
            <button 
              onClick={refreshAnalytics}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Try Again
            </button>
          </div>
        ) : (
          <AdvancedAnalyticsDashboard data={analyticsData} />
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-sm text-gray-600">Commonly used administrative functions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenantActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className={`${action.color} text-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Icon className="h-6 w-6 mr-3" />
                      <h3 className="text-lg font-semibold">{action.name}</h3>
                    </div>
                    <p className="text-sm opacity-90 mt-2">{action.description}</p>
                    <div className="mt-3 text-xs opacity-75">
                      {action.count}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Activity and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity Feed */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Recent Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tenantActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Link to="/activity" className="text-sm text-blue-600 hover:text-blue-800">
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-orange-500" />
                Pending Tasks
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {pendingTasks.length}
                </span>
              </h2>
              <Link to="/admin/tasks" className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {pendingTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Due: {task.dueDate}</span>
                        <span>Assignee: {task.assignee}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleTaskComplete(task.id)}
                      className="ml-4 text-sm bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Link to="/admin/tasks" className="text-sm text-blue-600 hover:text-blue-800">
                View all tasks →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Organizations and Users Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organizations Overview */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-purple-500" />
                Organizations
              </h2>
              <Link to="/organizations" className="text-sm text-blue-600 hover:text-blue-800">
                Manage All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {organizations.map((org) => (
                <div key={org.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{org.name}</h3>
                    <p className="text-sm text-gray-600">{org.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{org.user_count} members</span>
                      <span>Manager: {org.manager}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link 
                      to={`/organizations/${org.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link 
                      to={`/organizations/${org.id}/edit`}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Link 
                to="/organizations/new"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add new organization
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-500" />
                Recent Users
              </h2>
              <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">
                Manage All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {user.first_name[0]}{user.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-500">{user.role}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{user.department}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Last login: {new Date(user.last_login).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t">
              <Link 
                to="/users/new"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Add new user
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Information Summary */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 flex items-center">
            <Building className="h-5 w-5 mr-2 text-indigo-500" />
            Tenant Information
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Organization</h3>
              <p className="text-lg font-semibold text-gray-900">{tenantInfo.name}</p>
              <p className="text-sm text-gray-600">{tenantInfo.industry}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Established</h3>
              <p className="text-lg font-semibold text-gray-900">{tenantInfo.founded}</p>
              <p className="text-sm text-gray-600">{new Date().getFullYear() - parseInt(tenantInfo.founded)} years in business</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Team Size</h3>
              <p className="text-lg font-semibold text-gray-900">{tenantInfo.employees}</p>
              <p className="text-sm text-gray-600">employees worldwide</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Subscription</h3>
              <p className="text-lg font-semibold text-gray-900">{tenantInfo.plan}</p>
              <p className="text-sm text-gray-600">Plan active</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{tenantInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{tenantInfo.website}</span>
                </div>
              </div>
              <Link 
                to="/tenant/settings"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Settings className="h-4 w-4 mr-1" />
                Update settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTenantAdminDashboard;