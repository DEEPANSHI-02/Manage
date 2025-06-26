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
  Activity
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
  const navigate = useNavigate();

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
      color: 'bg-green-600 hover:bg-orange-400 hover:text-white'
    },
    {
      name: 'Tenant Settings',
      description: 'Configure tenant preferences',
      href: '/tenant/settings',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      name: 'Analytics & Reports',
      description: 'View user and organization analytics',
      href: '/tenant/reports',
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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Building className="h-6 w-6 mr-2 text-blue-600" />
        Tenant Admin Dashboard
      </h1>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tenantMetrics.map(metric => (
          <div key={metric.name} className="bg-white rounded-lg shadow p-4 flex items-center">
            <metric.icon className={`h-8 w-8 text-white p-1 rounded ${metric.color} mr-4`} />
            <div>
              <div className="text-lg font-bold">{metric.value}</div>
              <div className="text-gray-500 text-sm">{metric.name}</div>
              <div className="text-xs text-gray-400">{metric.change}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {tenantActions.map(action => (
          <Link to={action.href} key={action.name} className={`bg-white rounded-lg shadow p-4 flex items-center hover:bg-gray-50 transition ${action.color}`}>
            <action.icon className="h-6 w-6 text-white mr-4" />
            <div>
              <div className="text-lg font-bold">{action.name}</div>
              <div className="text-gray-500 text-sm">{action.description}</div>
            </div>
          </Link>
        ))}
      </div>
      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center"><Activity className="h-5 w-5 mr-2 text-blue-600" />Recent Activity</h2>
        <ul className="divide-y divide-gray-200">
          {tenantActivity.map(item => (
            <li key={item.id} className="py-3 flex items-center">
              <item.icon className={`h-5 w-5 mr-3 ${item.color}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{item.description}</div>
                <div className="text-xs text-gray-500">{item.user} &middot; {item.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Pending Tasks */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center"><Clock className="h-5 w-5 mr-2 text-orange-600" />Pending Tasks</h2>
        <ul className="divide-y divide-gray-200">
          {pendingTasks.map(task => (
            <li key={task.id} className="py-3 flex items-center">
              <CheckCircle className="h-5 w-5 mr-3 text-green-500" />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
                <div className="text-xs text-gray-500">{task.description} &middot; Due: {task.dueDate}</div>
              </div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>{task.priority}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TenantAdminDashboard;