import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Using mock navigation
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
  Zap,
  Monitor,
  Bell,
  Eye,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  ArrowUp,
  ArrowDown,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Edit,
  Trash2
} from 'lucide-react';
  // Mock toast notifications
  const toast = {
    success: (msg) => alert(`✅ ${msg}`),
    error: (msg) => alert(`❌ ${msg}`),
    info: (msg) => alert(`ℹ️ ${msg}`)
  };
  const mockApi = {
    getTenants: async () => ({
      data: [
        {
          id: '1',
          name: 'TechCorp Solutions',
          industry: 'Technology',
          employee_count: 250,
          active: true
        },
        {
          id: '2', 
          name: 'Global Enterprises',
          industry: 'Consulting',
          employee_count: 500,
          active: true
        },
        {
          id: '3',
          name: 'Innovation Startup Hub', 
          industry: 'Venture Capital',
          employee_count: 45,
          active: true
        }
      ]
    }),
    getUsers: async () => ({
      data: [
        {
          id: '1',
          first_name: 'Emma',
          last_name: 'Thompson',
          email: 'emma.hr@techcorp.com',
          active: true
        },
        {
          id: '2',
          first_name: 'Mike', 
          last_name: 'Chen',
          email: 'mike.dev@techcorp.com',
          active: true
        },
        {
          id: '3',
          first_name: 'Sarah',
          last_name: 'Johnson', 
          email: 'sarah.manager@techcorp.com',
          active: true
        },
        {
          id: '4',
          first_name: 'Lisa',
          last_name: 'Rodriguez',
          email: 'lisa.sales@techcorp.com', 
          active: false
        }
      ]
    })
  };

/**
 * Enhanced System Administrator Dashboard
 * Implements PDF requirements: Global tenant management, system monitoring, user oversight
 */
const EnhancedSystemAdminDashboard = () => {
  // Mock user data for demo
  const user = { name: 'John Administrator', email: 'admin@techcorp.com' };
  
  // Mock navigation function for demo
  const navigateTo = (path) => {
    alert(`Would navigate to: ${path}`);
  };
  const [systemStats, setSystemStats] = useState({
    totalTenants: 0,
    totalUsers: 0,
    totalOrganizations: 0,
    activeUsers: 0,
    systemHealth: 'healthy',
    apiRequests: 1250000,
    errorRate: 0.02,
    avgResponseTime: 156
  });

  const [tenants, setTenants] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [globalActivity, setGlobalActivity] = useState([]);
  const [systemServices, setSystemServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadSystemDashboardData();
    const interval = setInterval(loadSystemDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSystemDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load data from your mock APIs
      const [tenantsRes, usersRes] = await Promise.all([
        mockApi.getTenants(),
        // Get users from first tenant for demo (in real app, would be global endpoint)
        mockApi.getUsers('tenant-tech-corp-2024-001')
      ]);

      // Calculate system statistics
      const totalTenants = tenantsRes.data.length;
      const totalUsers = usersRes.data.length;
      const activeUsers = usersRes.data.filter(u => u.active).length;

      setSystemStats({
        totalTenants,
        totalUsers,
        totalOrganizations: totalTenants * 4, // Estimated
        activeUsers,
        systemHealth: 'healthy',
        apiRequests: 1250000 + Math.floor(Math.random() * 10000),
        errorRate: 0.02 + (Math.random() * 0.01),
        avgResponseTime: 156 + Math.floor(Math.random() * 50)
      });

      setTenants(tenantsRes.data);
      setRecentUsers(usersRes.data.slice(0, 5));

      // Mock system services status
      setSystemServices([
        { 
          name: 'Authentication Service', 
          status: 'healthy', 
          uptime: '99.9%', 
          response: '45ms',
          description: 'JWT authentication and session management'
        },
        { 
          name: 'User Management API', 
          status: 'healthy', 
          uptime: '99.8%', 
          response: '67ms',
          description: 'User CRUD operations and role management'
        },
        { 
          name: 'Database Cluster', 
          status: 'warning', 
          uptime: '99.5%', 
          response: '120ms',
          description: 'Primary database cluster with replication'
        },
        { 
          name: 'File Storage', 
          status: 'healthy', 
          uptime: '100%', 
          response: '23ms',
          description: 'Document and media file storage service'
        },
        { 
          name: 'Email Service', 
          status: 'healthy', 
          uptime: '99.7%', 
          response: '89ms',
          description: 'SMTP service for notifications and alerts'
        }
      ]);

      // Mock global activity
      setGlobalActivity([
        {
          id: 1,
          type: 'tenant_created',
          description: 'New tenant "Innovation Labs" created',
          user: 'System Admin',
          time: '5 minutes ago',
          severity: 'info',
          icon: Building
        },
        {
          id: 2,
          type: 'user_created',
          description: 'New user Emma Thompson added to TechCorp',
          user: 'John Administrator',
          time: '15 minutes ago',
          severity: 'info',
          icon: UserCheck
        },
        {
          id: 3,
          type: 'system_alert',
          description: 'High CPU usage detected on database cluster',
          user: 'System Monitor',
          time: '30 minutes ago',
          severity: 'warning',
          icon: AlertTriangle
        },
        {
          id: 4,
          type: 'security_event',
          description: 'Multiple failed login attempts from 203.0.113.42',
          user: 'Security Monitor',
          time: '45 minutes ago',
          severity: 'high',
          icon: Shield
        }
      ]);

      // Mock system alerts
      setSystemAlerts([
        {
          id: 1,
          title: 'Database Performance Warning',
          message: 'Database cluster response time above threshold (120ms avg)',
          severity: 'warning',
          timestamp: '2024-06-25T10:30:00.000Z',
          action: 'Review database optimization'
        },
        {
          id: 2,
          title: 'Security Alert',
          message: 'Suspicious login patterns detected from multiple IPs',
          severity: 'high',
          timestamp: '2024-06-25T09:15:00.000Z',
          action: 'Review security logs'
        },
        {
          id: 3,
          title: 'Storage Capacity',
          message: 'File storage approaching 80% capacity',
          severity: 'medium',
          timestamp: '2024-06-25T08:45:00.000Z',
          action: 'Plan storage expansion'
        }
      ]);

    } catch (error) {
      console.error('Error loading system dashboard:', error);
      toast.error('Failed to load system data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshData = () => {
    toast.success('Refreshing system data...');
    loadSystemDashboardData();
  };

  const handleTenantAction = async (tenantId, action) => {
    try {
      if (action === 'edit') {
        // In real app, would open edit modal
        toast.info('Edit tenant functionality would open here');
      } else if (action === 'delete') {
        // In real app, would show confirmation modal
        toast.info('Delete tenant confirmation would show here');
      }
    } catch (error) {
      toast.error(`Failed to ${action} tenant`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      case 'medium':
        return 'bg-blue-50 border-blue-400 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-400 text-gray-800';
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
      trend: 'up',
      href: '/tenants'
    },
    {
      name: 'Global Users',
      value: systemStats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+12% this month',
      trend: 'up',
      href: '/system/users'
    },
    {
      name: 'API Requests',
      value: systemStats.apiRequests.toLocaleString(),
      icon: Zap,
      color: 'bg-purple-500',
      change: '+5% today',
      trend: 'up',
      href: '/system/api'
    },
    {
      name: 'System Health',
      value: '99.9%',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: 'All systems operational',
      trend: 'stable',
      href: '/system/health'
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg h-32"></div>
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
              <button
                onClick={handleRefreshData}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                System Alerts
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  {systemAlerts.length}
                </span>
              </h2>
              <button
                onClick={() => navigateTo('/system/alerts')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium">{alert.title}</h3>
                      <p className="text-sm mt-1">{alert.message}</p>
                      <p className="text-xs mt-2 opacity-75">
                        {new Date(alert.timestamp).toLocaleString()} • {alert.action}
                      </p>
                    </div>
                    <button className="ml-4 text-sm bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded transition-colors">
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.name}
              onClick={() => navigateTo(metric.href)}
              className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
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
                <div className="text-sm flex items-center">
                  {metric.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : metric.trend === 'down' ? (
                    <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                  ) : null}
                  <span className="font-medium text-green-600">
                    {metric.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Tenant Management */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Global Tenant Management</h2>
              <button
                onClick={() => navigateTo('/tenants')}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tenant
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tenants.slice(0, 4).map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{tenant.name}</h3>
                      <p className="text-sm text-gray-500">{tenant.industry} • {tenant.employee_count} employees</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tenant.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {tenant.active ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => handleTenantAction(tenant.id, 'edit')}
                      className="text-blue-600 hover:text-blue-500"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigateTo('/tenants')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View All {systemStats.totalTenants} Tenants →
              </button>
            </div>
          </div>
        </div>

        {/* System Services Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Services Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(service.status)}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                      <p className="text-xs text-gray-500">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{service.response}</div>
                      <div className="text-xs text-gray-500">Response</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{service.uptime}</div>
                      <div className="text-xs text-gray-500">Uptime</div>
                    </div>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Activity and Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global Activity Feed */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Global Activity Feed</h2>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {globalActivity.map((activity, activityIdx) => {
                  const Icon = activity.icon;
                  return (
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
                              <Icon className={`h-4 w-4 ${
                                activity.severity === 'high' ? 'text-red-600' :
                                activity.severity === 'warning' ? 'text-yellow-600' :
                                activity.severity === 'success' ? 'text-green-600' :
                                'text-blue-600'
                              }`} />
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

        {/* Recent Users Across Tenants */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Recent Users</h2>
              <button
                onClick={() => navigateTo('/system/users')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View All Users
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-500">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Performance Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Performance</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-lg mb-3">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">24%</div>
              <div className="text-sm text-gray-500">CPU Usage</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-lg mb-3">
                <MemoryStick className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">67%</div>
              <div className="text-sm text-gray-500">Memory Usage</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-lg mb-3">
                <HardDrive className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">45%</div>
              <div className="text-sm text-gray-500">Disk Usage</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-100 rounded-lg mb-3">
                <Wifi className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{systemStats.avgResponseTime}ms</div>
              <div className="text-sm text-gray-500">Avg Response</div>
              <div className="text-xs text-green-600 mt-1">↓ 12ms from yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSystemAdminDashboard;