// src/pages/dashboards/SystemAdminDashboard.jsx - Updated with Wizard Integration
import React, { useState, useEffect } from 'react';
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
  Trash2,
  Sparkles
} from 'lucide-react';

// Import the wizard
import TenantOnboardingWizard from '../../components/modals/TenantOnboardingWizard';

// Import the enhanced analytics dashboard
import AdvancedAnalyticsDashboard from '../../components/charts/AdvancedDataVisualization';
import { useAnalytics } from '../../hooks/useAnalytics';

// Mock API imports (replace with your actual API services)
const mockApi = {
  async getGlobalTenants() {
    return {
      data: [
        {
          id: '1',
          name: 'TechCorp Solutions',
          industry: 'Technology',
          employee_count: 250,
          active: true,
          created_at: '2024-01-15T10:30:00.000Z'
        },
        {
          id: '2', 
          name: 'Global Enterprises',
          industry: 'Consulting',
          employee_count: 500,
          active: true,
          created_at: '2024-02-20T14:20:00.000Z'
        },
        {
          id: '3',
          name: 'Innovation Startup Hub', 
          industry: 'Venture Capital',
          employee_count: 45,
          active: true,
          created_at: '2024-03-10T09:15:00.000Z'
        },
        {
          id: '4',
          name: 'Enterprise Solutions Ltd',
          industry: 'Software',
          employee_count: 180,
          active: true,
          created_at: '2024-04-05T11:45:00.000Z'
        }
      ]
    };
  },
  async getGlobalUsers() {
    return {
      data: [
        {
          id: '1',
          first_name: 'Emma',
          last_name: 'Thompson',
          email: 'emma.hr@techcorp.com',
          active: true,
          tenant_name: 'TechCorp Solutions',
          role: 'HR Manager',
          last_login: '2024-06-27T08:30:00.000Z'
        },
        {
          id: '2',
          first_name: 'Mike', 
          last_name: 'Chen',
          email: 'mike.dev@techcorp.com',
          active: true,
          tenant_name: 'TechCorp Solutions',
          role: 'Senior Developer',
          last_login: '2024-06-27T09:15:00.000Z'
        },
        {
          id: '3',
          first_name: 'Sarah',
          last_name: 'Johnson', 
          email: 'sarah.manager@globalent.com',
          active: true,
          tenant_name: 'Global Enterprises',
          role: 'Project Manager',
          last_login: '2024-06-26T16:45:00.000Z'
        },
        {
          id: '4',
          first_name: 'Lisa',
          last_name: 'Rodriguez',
          email: 'lisa.sales@innovation.com', 
          active: false,
          tenant_name: 'Innovation Startup Hub',
          role: 'Sales Lead',
          last_login: '2024-06-20T14:20:00.000Z'
        }
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

const EnhancedSystemAdminDashboard = () => {
  const user = { name: 'John Administrator', email: 'admin@system.com' };
  
  // Use the analytics hook for real data
  const { 
    data: analyticsData, 
    loading: analyticsLoading, 
    error: analyticsError, 
    refreshData: refreshAnalytics 
  } = useAnalytics('system');

  // Wizard state
  const [showWizard, setShowWizard] = useState(false);

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

  useEffect(() => {
    loadSystemDashboardData();
    const interval = setInterval(loadSystemDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSystemDashboardData = async () => {
    try {
      setLoading(true);
      
      const [tenantsRes, usersRes] = await Promise.all([
        mockApi.getGlobalTenants(),
        mockApi.getGlobalUsers()
      ]);

      const totalTenants = tenantsRes.data.length;
      const totalUsers = usersRes.data.length;
      const activeUsers = usersRes.data.filter(u => u.active).length;

      setSystemStats({
        totalTenants,
        totalUsers,
        totalOrganizations: totalTenants * 4,
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
          description: 'JWT authentication and session management',
          cpu: '12%',
          memory: '65%'
        },
        { 
          name: 'User Management API', 
          status: 'healthy', 
          uptime: '99.8%', 
          response: '67ms',
          description: 'User CRUD operations and role management',
          cpu: '8%',
          memory: '42%'
        },
        { 
          name: 'Database Cluster', 
          status: 'warning', 
          uptime: '99.5%', 
          response: '120ms',
          description: 'Primary database cluster with replication',
          cpu: '78%',
          memory: '88%'
        },
        { 
          name: 'File Storage', 
          status: 'healthy', 
          uptime: '100%', 
          response: '23ms',
          description: 'Document and media file storage service',
          cpu: '5%',
          memory: '34%'
        },
        { 
          name: 'Email Service', 
          status: 'healthy', 
          uptime: '99.7%', 
          response: '89ms',
          description: 'SMTP service for notifications and alerts',
          cpu: '3%',
          memory: '28%'
        }
      ]);

      // Mock global activity
      setGlobalActivity([
        {
          id: 1,
          type: 'tenant_created',
          description: 'New tenant "Enterprise Solutions Ltd" created',
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
          description: 'Failed login attempts from IP 192.168.1.100',
          user: 'Security System',
          time: '1 hour ago',
          severity: 'warning',
          icon: Shield
        },
        {
          id: 5,
          type: 'maintenance',
          description: 'Scheduled backup completed successfully',
          user: 'System',
          time: '2 hours ago',
          severity: 'info',
          icon: Database
        }
      ]);

      // Mock system alerts
      setSystemAlerts([
        {
          id: 1,
          title: 'Database Performance Warning',
          message: 'Database cluster response time above threshold (120ms avg)',
          severity: 'warning',
          timestamp: '2024-06-27T10:30:00.000Z',
          action: 'Review database optimization',
          affected_services: ['User Management API', 'Authentication Service']
        },
        {
          id: 2,
          title: 'Security Alert',
          message: 'Suspicious login patterns detected from multiple IPs',
          severity: 'high',
          timestamp: '2024-06-27T09:15:00.000Z',
          action: 'Review security logs',
          affected_services: ['Authentication Service']
        },
        {
          id: 3,
          title: 'Storage Capacity Warning',
          message: 'File storage usage approaching 85% capacity',
          severity: 'medium',
          timestamp: '2024-06-27T08:45:00.000Z',
          action: 'Plan storage expansion',
          affected_services: ['File Storage']
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
    refreshAnalytics();
  };

  const handleResolveAlert = (alertId) => {
    setSystemAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Alert resolved');
  };

  // Handle wizard completion
  const handleWizardComplete = async (tenantData) => {
    try {
      console.log('Creating tenant with data:', tenantData);
      
      // Create new tenant object
      const newTenant = {
        id: `tenant-${Date.now()}`,
        name: tenantData.tenant.name,
        industry: tenantData.tenant.industry,
        employee_count: tenantData.organizations.reduce((sum, org) => sum + (org.user_count || 0), 0),
        active: true,
        created_at: new Date().toISOString()
      };

      // Add to tenants list
      setTenants(prev => [newTenant, ...prev]);
      
      // Update system stats
      setSystemStats(prev => ({
        ...prev,
        totalTenants: prev.totalTenants + 1,
        totalUsers: prev.totalUsers + tenantData.users.length,
        totalOrganizations: prev.totalOrganizations + tenantData.organizations.length
      }));

      // Add activity log entry
      setGlobalActivity(prev => [{
        id: Date.now(),
        type: 'tenant_created',
        description: `New tenant "${tenantData.tenant.name}" created via onboarding wizard`,
        user: user.name,
        time: 'just now',
        severity: 'info',
        icon: Building
      }, ...prev.slice(0, 4)]);
      
      toast.success(`Tenant "${tenantData.tenant.name}" created successfully with ${tenantData.users.length} users and ${tenantData.organizations.length} organizations!`);
      
    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error('Failed to create tenant. Please try again.');
      throw error;
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
      description: 'Active tenant organizations'
    },
    {
      name: 'Global Users',
      value: systemStats.totalUsers,
      icon: Users,
      color: 'bg-green-500',
      change: '+12% this month',
      trend: 'up',
      description: 'Total users across all tenants'
    },
    {
      name: 'API Requests',
      value: systemStats.apiRequests.toLocaleString(),
      icon: Zap,
      color: 'bg-purple-500',
      change: '+5% today',
      trend: 'up',
      description: 'Daily API request volume'
    },
    {
      name: 'System Health',
      value: '99.9%',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      change: 'All systems operational',
      trend: 'stable',
      description: 'Overall system uptime'
    }
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-6 p-6">
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
    <div className="space-y-6 p-6">
      {/* System Admin Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow rounded-lg">
        <div className="px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">System Administrator Dashboard</h1>
              <p className="mt-2 text-blue-100">
                Global system oversight and management - Welcome, {user?.name}
              </p>
              <div className="mt-4 flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Server className="h-4 w-4 mr-2" />
                  <span>System Version 2.4.1</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>Multi-Region Deployment</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowWizard(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center border border-blue-400 shadow-sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                New Tenant Wizard
              </button>
              <button
                onClick={handleRefreshData}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors flex items-center border border-indigo-400 shadow-sm"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-white">All Systems Operational</span>
              </div>
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
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All Alerts
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
                      {alert.affected_services && (
                        <div className="mt-2">
                          <span className="text-xs font-medium">Affected Services: </span>
                          <span className="text-xs">{alert.affected_services.join(', ')}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleResolveAlert(alert.id)}
                      className="ml-4 text-sm bg-white bg-opacity-50 hover:bg-opacity-75 px-3 py-1 rounded transition-colors"
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* System Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div
              key={metric.name}
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
                <p className="ml-16 text-xs text-gray-400 mt-1">
                  {metric.description}
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

      {/* Enhanced Analytics Dashboard Integration */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-2">System Analytics Overview</h2>
          <p className="text-sm text-gray-600">Comprehensive system-wide analytics and performance trends</p>
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
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
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

      {/* System Services Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Monitor className="h-5 w-5 mr-2 text-blue-500" />
              System Services
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {systemServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{service.name}</h3>
                      <div className="flex items-center">
                        {getStatusIcon(service.status)}
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>Uptime: {service.uptime}</span>
                      <span>Response: {service.response}</span>
                      <span>CPU: {service.cpu}</span>
                      <span>Memory: {service.memory}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Activity Feed */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Global Activity
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {globalActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 p-2 rounded-full bg-gray-100`}>
                      <Icon className="h-4 w-4 text-gray-600" />
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
            <div className="mt-4 pt-4 border-t">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View all activity →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tenants and Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tenants */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-purple-500" />
                Recent Tenants
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tenants.slice(0, 4).map((tenant) => (
                <div key={tenant.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{tenant.name}</h3>
                    <p className="text-sm text-gray-600">{tenant.industry} • {tenant.employee_count} employees</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(tenant.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${tenant.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tenant.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setShowWizard(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Tenant
              </button>
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
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {user.first_name[0]}{user.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        {user.tenant_name} • {user.role}
                      </p>
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
          </div>
        </div>
      </div>

      {/* Tenant Onboarding Wizard */}
      <TenantOnboardingWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />
    </div>
  );
};

export default EnhancedSystemAdminDashboard;