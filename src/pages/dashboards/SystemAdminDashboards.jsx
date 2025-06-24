import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Shield, 
  Database,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server,
  Globe,
  Settings,
  BarChart3,
  UserCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { mockApi } from '../../services/mockApi';

/**
 * System Administrator Dashboard
 * Full system oversight with global statistics and controls
 */
const SystemAdminDashboard = () => {
  const { user } = useAuth();
  const [systemStats, setSystemStats] = useState({
    totalTenants: 0,
    totalUsers: 0,
    totalOrganizations: 0,
    activeUsers: 0,
    systemHealth: 'healthy'
  });
  const [globalActivity, setGlobalActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemDashboardData();
  }, []);

  const loadSystemDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load global statistics
      const [tenantsRes, usersRes, orgsRes] = await Promise.all([
        mockApi.getTenants(),
        mockApi.getUsers(user?.tenant_id),
        mockApi.getOrganizations(user?.tenant_id)
      ]);

      setSystemStats({
        totalTenants: tenantsRes.data.length,
        totalUsers: usersRes.data.length,
        totalOrganizations: orgsRes.data.length,
        activeUsers: usersRes.data.filter(u => u.active).length,
        systemHealth: 'healthy'
      });

      // Mock global activity
      setGlobalActivity([
        {
          id: 1,
          type: 'tenant_created',
          description: 'New tenant "Innovation Startup Hub" created',
          time: '5 minutes ago',
          severity: 'info'
        },
        {
          id: 2,
          type: 'system_alert',
          description: 'High CPU usage detected on server cluster',
          time: '15 minutes ago',
          severity: 'warning'
        },
        {
          id: 3,
          type: 'security_event',
          description: 'Multiple failed login attempts detected',
          time: '30 minutes ago',
          severity: 'high'
        },
        {
          id: 4,
          type: 'backup_completed',
          description: 'Daily system backup completed successfully',
          time: '2 hours ago',
          severity: 'success'
        }
      ]);

      // Mock system alerts
      setSystemAlerts([
        {
          id: 1,
          title: 'Server Maintenance Required',
          message: 'Database server cluster requires maintenance window',
          severity: 'warning',
          timestamp: '2024-06-25T10:30:00.000Z'
        },
        {
          id: 2,
          title: 'Security Update Available',
          message: 'Critical security patches available for deployment',
          severity: 'high',
          timestamp: '2024-06-25T09:15:00.000Z'
        }
      ]);

    } catch (error) {
      console.error('Error loading system dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // System Admin specific metrics
  const systemMetrics = [
    {
      name: 'Total Tenants',
      value: systemStats.totalTenants,
      icon: Building,
      color: 'bg-blue-500',
      change: '+2 this month',
      href: '/tenants'
    },
    {
      name: 'Global Users',
      value: systemStats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+12% this month',
      href: '/system/users'
    },
    {
      name: 'Active Sessions',
      value: systemStats.activeUsers,
      icon: Activity,
      color: 'bg-yellow-500',
      change: '85% uptime',
      href: '/system/sessions'
    },
    {
      name: 'System Health',
      value: '99.9%',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: 'All systems operational',
      href: '/system/health'
    }
  ];

  // System Admin quick actions
  const systemActions = [
    {
      name: 'Manage All Tenants',
      description: 'View and manage all tenant accounts',
      href: '/tenants',
      icon: Building,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Global User Management',
      description: 'Manage users across all tenants',
      href: '/system/users',
      icon: UserCheck,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'System Configuration',
      description: 'Configure global system settings',
      href: '/system/config',
      icon: Settings,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Security Center',
      description: 'Monitor security events and policies',
      href: '/system/security',
      icon: Shield,
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'System Monitoring',
      description: 'View system performance and logs',
      href: '/system/monitoring',
      icon: BarChart3,
      color: 'bg-indigo-600 hover:bg-indigo-700'
    },
    {
      name: 'API Management',
      description: 'Manage API keys and integrations',
      href: '/system/api',
      icon: Zap,
      color: 'bg-orange-600 hover:bg-orange-700'
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* System Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow rounded-lg">
        <div className="px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">System Administrator Dashboard</h1>
              <p className="mt-1 text-blue-100">
                Global system oversight and management - Welcome, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                <span className="text-sm">All Systems Operational</span>
              </div>
              <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      {systemAlerts.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              System Alerts
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`
                  p-4 rounded-lg border-l-4
                  ${alert.severity === 'high' ? 'bg-red-50 border-red-400' :
                    alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-blue-50 border-blue-400'}
                `}>
                  <h3 className="font-medium text-gray-900">{alert.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => {
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
        {/* System Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Management</h2>
            <p className="mt-1 text-sm text-gray-600">
              Global system administration tools
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {systemActions.map((action) => {
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

        {/* Global Activity Feed */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Global Activity</h2>
            <p className="mt-1 text-sm text-gray-600">
              Recent system-wide events and activities
            </p>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {globalActivity.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== globalActivity.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`
                            h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                            ${activity.severity === 'high' ? 'bg-red-100' :
                              activity.severity === 'warning' ? 'bg-yellow-100' :
                              activity.severity === 'success' ? 'bg-green-100' :
                              'bg-blue-100'}
                          `}>
                            {activity.severity === 'high' ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : activity.severity === 'warning' ? (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            ) : activity.severity === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Activity className="h-4 w-4 text-blue-600" />
                            )}
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
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Health Status</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-900">Database Cluster</span>
              <span className="ml-auto text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-900">API Gateway</span>
              <span className="ml-auto text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-sm text-gray-900">Cache Servers</span>
              <span className="ml-auto text-sm text-yellow-600">Warning</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-900">Load Balancer</span>
              <span className="ml-auto text-sm text-green-600">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;