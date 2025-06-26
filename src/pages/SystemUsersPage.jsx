import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  Shield,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Settings,
  RefreshCw,
  Download,
  Upload,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Lock,
  Unlock
} from 'lucide-react';
import toast from 'react-hot-toast';

// Mock API for System Users
const mockSystemUsersApi = {
  async getSystemUsers(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = [
      {
        id: 'user-1',
        name: 'John Administrator',
        email: 'admin@techcorp.com',
        tenantId: 'tenant-1',
        tenantName: 'TechCorp Solutions',
        role: 'System Administrator',
        status: 'active',
        lastLogin: '2024-06-26T10:30:00Z',
        department: 'IT Operations',
        location: 'San Francisco, CA',
        joinDate: '2024-01-15',
        phone: '+1-555-0123',
        loginCount: 547,
        lastIp: '192.168.1.100',
        twoFactorEnabled: true,
        avatar: 'https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=JA'
      },
      {
        id: 'user-2',
        name: 'Sarah Johnson',
        email: 'sarah.manager@techcorp.com',
        tenantId: 'tenant-1',
        tenantName: 'TechCorp Solutions',
        role: 'Manager',
        status: 'active',
        lastLogin: '2024-06-26T09:45:00Z',
        department: 'Engineering',
        location: 'San Francisco, CA',
        joinDate: '2024-01-20',
        phone: '+1-555-0124',
        loginCount: 423,
        lastIp: '192.168.1.101',
        twoFactorEnabled: true,
        avatar: 'https://via.placeholder.com/40x40/059669/FFFFFF?text=SJ'
      },
      {
        id: 'user-3',
        name: 'Mike Chen',
        email: 'mike.dev@techcorp.com',
        tenantId: 'tenant-1',
        tenantName: 'TechCorp Solutions',
        role: 'Developer',
        status: 'active',
        lastLogin: '2024-06-26T08:30:00Z',
        department: 'Engineering',
        location: 'San Jose, CA',
        joinDate: '2024-02-01',
        phone: '+1-555-0125',
        loginCount: 356,
        lastIp: '192.168.1.102',
        twoFactorEnabled: false,
        avatar: 'https://via.placeholder.com/40x40/8B5CF6/FFFFFF?text=MC'
      },
      {
        id: 'user-4',
        name: 'David Williams',
        email: 'david@globalent.com',
        tenantId: 'tenant-2',
        tenantName: 'Global Enterprises',
        role: 'Senior Consultant',
        status: 'active',
        lastLogin: '2024-06-26T07:15:00Z',
        department: 'Consulting',
        location: 'New York, NY',
        joinDate: '2024-02-15',
        phone: '+1-555-0456',
        loginCount: 289,
        lastIp: '203.0.113.15',
        twoFactorEnabled: true,
        avatar: 'https://via.placeholder.com/40x40/F59E0B/FFFFFF?text=DW'
      },
      {
        id: 'user-5',
        name: 'Lisa Rodriguez',
        email: 'lisa@innovationhub.com',
        tenantId: 'tenant-3',
        tenantName: 'Innovation Hub',
        role: 'Program Manager',
        status: 'inactive',
        lastLogin: '2024-06-25T16:20:00Z',
        department: 'Operations',
        location: 'Austin, TX',
        joinDate: '2024-03-20',
        phone: '+1-555-0789',
        loginCount: 145,
        lastIp: '198.51.100.42',
        twoFactorEnabled: false,
        avatar: 'https://via.placeholder.com/40x40/EF4444/FFFFFF?text=LR'
      },
      {
        id: 'user-6',
        name: 'Emma Thompson',
        email: 'emma.hr@techcorp.com',
        tenantId: 'tenant-1',
        tenantName: 'TechCorp Solutions',
        role: 'HR Specialist',
        status: 'suspended',
        lastLogin: '2024-06-24T14:30:00Z',
        department: 'Human Resources',
        location: 'San Francisco, CA',
        joinDate: '2024-02-20',
        phone: '+1-555-0126',
        loginCount: 178,
        lastIp: '192.168.1.103',
        twoFactorEnabled: true,
        avatar: 'https://via.placeholder.com/40x40/10B981/FFFFFF?text=ET'
      }
    ];

    let filtered = [...users];
    
    if (filters.tenantId && filters.tenantId !== 'all') {
      filtered = filtered.filter(u => u.tenantId === filters.tenantId);
    }
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(u => u.status === filters.status);
    }
    if (filters.role && filters.role !== 'all') {
      filtered = filtered.filter(u => u.role.toLowerCase().includes(filters.role.toLowerCase()));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.department.toLowerCase().includes(search) ||
        u.tenantName.toLowerCase().includes(search)
      );
    }
    
    return {
      success: true,
      data: filtered,
      total: filtered.length
    };
  },

  async impersonateUser(userId) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: { sessionToken: `impersonate_${userId}_${Date.now()}` },
      message: 'Impersonation session started'
    };
  },

  async resetPassword(userId) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: { tempPassword: 'TempPass123!' },
      message: 'Password reset successfully'
    };
  },

  async suspendUser(userId) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'User suspended' };
  },

  async activateUser(userId) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'User activated' };
  }
};

const SystemUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantFilter, setTenantFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [searchTerm, tenantFilter, statusFilter, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await mockSystemUsersApi.getSystemUsers({
        search: searchTerm,
        tenantId: tenantFilter,
        status: statusFilter,
        role: roleFilter
      });
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (action, userId) => {
    try {
      setActionLoading(true);
      let response;
      
      switch (action) {
        case 'impersonate':
          response = await mockSystemUsersApi.impersonateUser(userId);
          if (response.success) {
            toast.success(response.message);
          }
          break;
        case 'resetPassword':
          response = await mockSystemUsersApi.resetPassword(userId);
          if (response.success) {
            toast.success(response.message);
          }
          break;
        case 'suspend':
          response = await mockSystemUsersApi.suspendUser(userId);
          if (response.success) {
            toast.success(response.message);
            loadUsers();
          }
          break;
        case 'activate':
          response = await mockSystemUsersApi.activateUser(userId);
          if (response.success) {
            toast.success(response.message);
            loadUsers();
          }
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role) => {
    if (role.includes('Administrator')) return 'bg-purple-100 text-purple-800';
    if (role.includes('Manager')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const uniqueTenants = [...new Set(users.map(u => ({ id: u.tenantId, name: u.tenantName })))];
  const uniqueRoles = [...new Set(users.map(u => u.role))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                System Users
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage users across all tenants in the system
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={loadUsers}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{users.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500"> this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(u => u.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                {Math.round((users.filter(u => u.status === 'active').length / users.length) * 100) || 0}%
              </span>
              <span className="text-gray-500"> activity rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">2FA Enabled</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {users.filter(u => u.twoFactorEnabled).length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                {Math.round((users.filter(u => u.twoFactorEnabled).length / users.length) * 100) || 0}%
              </span>
              <span className="text-gray-500"> security rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tenants</dt>
                  <dd className="text-lg font-medium text-gray-900">{uniqueTenants.length}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-blue-600 font-medium">Multi-tenant</span>
              <span className="text-gray-500"> system</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users by name, email, department, or tenant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <select
                value={tenantFilter}
                onChange={(e) => setTenantFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Tenants</option>
                {uniqueTenants.map(tenant => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{users.length} users found across {uniqueTenants.length} tenants</span>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Global view</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant & Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full" 
                            src={user.avatar} 
                            alt={user.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        {user.tenantName}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                          <Shield className="h-3 w-3 mr-1" />
                          {user.role}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        {user.location}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="flex items-center">
                          {user.twoFactorEnabled ? (
                            <>
                              <Lock className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm text-green-600">2FA Enabled</span>
                            </>
                          ) : (
                            <>
                              <Unlock className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-sm text-red-600">2FA Disabled</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          Logins: {user.loginCount}
                        </div>
                        <div className="text-xs text-gray-500">
                          IP: {user.lastIp}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {getStatusIcon(user.status)}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {getTimeAgo(user.lastLogin)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Joined: {formatDate(user.joinDate)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDetailModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('impersonate', user.id)}
                          disabled={actionLoading}
                          className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                          title="Impersonate User"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction('resetPassword', user.id)}
                          disabled={actionLoading}
                          className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                          title="Reset Password"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction('suspend', user.id)}
                            disabled={actionLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Suspend User"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction('activate', user.id)}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Activate User"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || tenantFilter !== 'all' || statusFilter !== 'all' || roleFilter !== 'all'
                ? 'Try adjusting your search criteria or filters'
                : 'No users available in the system'
              }
            </p>
          </div>
        )}
      </div>

      {/* System Admin Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">System Admin Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => toast.info('Bulk role assignment feature')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Shield className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Bulk Role Assignment</span>
              <span className="text-xs text-gray-500 text-center mt-1">Assign roles to multiple users</span>
            </button>

            <button
              onClick={() => toast.info('Mass password reset feature')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Settings className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Mass Password Reset</span>
              <span className="text-xs text-gray-500 text-center mt-1">Reset passwords for selected users</span>
            </button>

            <button
              onClick={() => toast.info('Tenant migration feature')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Building className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Tenant Migration</span>
              <span className="text-xs text-gray-500 text-center mt-1">Move users between tenants</span>
            </button>

            <button
              onClick={() => toast.info('Activity report generation')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <Activity className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Activity Report</span>
              <span className="text-xs text-gray-500 text-center mt-1">Generate user activity reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedUser(null);
          }}
          onAction={handleUserAction}
        />
      )}
    </div>
  );
};

// User Detail Modal Component
const UserDetailModal = ({ user, onClose, onAction }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                className="h-16 w-16 rounded-full" 
                src={user.avatar} 
                alt={user.name}
              />
              <div>
                <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Building className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Tenant</div>
                      <div className="text-sm text-gray-500">{user.tenantName}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Department</div>
                      <div className="text-sm text-gray-500">{user.department}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Location</div>
                      <div className="text-sm text-gray-500">{user.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Join Date</div>
                      <div className="text-sm text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Email</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">Phone</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security & Activity */}
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Security Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    {user.twoFactorEnabled ? (
                      <Lock className="h-5 w-5 text-green-500 mr-3" />
                    ) : (
                      <Unlock className="h-5 w-5 text-red-500 mr-3" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">Two-Factor Authentication</div>
                      <div className={`text-sm ${user.twoFactorEnabled ? 'text-green-600' : 'text-red-600'}`}>
                        {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Last Login</div>
                      <div className="text-sm text-gray-500">{new Date(user.lastLogin).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Last IP Address</div>
                      <div className="text-sm text-gray-500">{user.lastIp}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Login Count</div>
                      <div className="text-sm text-gray-500">{user.loginCount} total logins</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => onAction('impersonate', user.id)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Impersonate User
                  </button>
                  <button
                    onClick={() => onAction('resetPassword', user.id)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Reset Password
                  </button>
                  {user.status === 'active' ? (
                    <button
                      onClick={() => onAction('suspend', user.id)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Suspend User
                    </button>
                  ) : (
                    <button
                      onClick={() => onAction('activate', user.id)}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Activate User
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemUsersPage;