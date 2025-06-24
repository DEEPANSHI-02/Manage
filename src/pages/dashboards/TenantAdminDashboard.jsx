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
  Building2
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