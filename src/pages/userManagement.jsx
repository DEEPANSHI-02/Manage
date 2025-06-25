import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Users,
  Mail,
  Phone,
  Building,
  Shield,
  Calendar,
  Download,
  Upload,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  AlertCircle,
  Settings,
  X
} from 'lucide-react';

// Mock API service for User Management
const mockApiService = {
  async getUsers(tenantId, filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = [
      {
        id: '1',
        email: 'john.admin@techcorp.com',
        first_name: 'John',
        last_name: 'Administrator',
        phone: '+1-555-0100',
        job_title: 'System Administrator',
        department: 'IT Operations',
        active: true,
        organization_id: 'org-1',
        organization_name: 'Engineering Division',
        last_login: '2024-06-24T09:30:00.000Z',
        created_at: '2024-01-15T08:30:00.000Z',
        roles: ['System Administrator'],
        status: 'active'
      },
      {
        id: '2',
        email: 'sarah.manager@techcorp.com',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '+1-555-0101',
        job_title: 'Engineering Manager',
        department: 'Software Development',
        active: true,
        organization_id: 'org-1',
        organization_name: 'Engineering Division',
        last_login: '2024-06-24T08:15:00.000Z',
        created_at: '2024-01-20T09:15:00.000Z',
        roles: ['Manager'],
        status: 'active'
      },
      {
        id: '3',
        email: 'mike.developer@techcorp.com',
        first_name: 'Mike',
        last_name: 'Chen',
        phone: '+1-555-0102',
        job_title: 'Senior Software Developer',
        department: 'Product Engineering',
        active: true,
        organization_id: 'org-1',
        organization_name: 'Engineering Division',
        last_login: '2024-06-24T07:45:00.000Z',
        created_at: '2024-02-01T10:00:00.000Z',
        roles: ['Standard User'],
        status: 'active'
      },
      {
        id: '4',
        email: 'lisa.sales@techcorp.com',
        first_name: 'Lisa',
        last_name: 'Rodriguez',
        phone: '+1-555-0103',
        job_title: 'Sales Director',
        department: 'Business Development',
        active: false,
        organization_id: 'org-2',
        organization_name: 'Sales & Marketing',
        last_login: '2024-06-20T16:20:00.000Z',
        created_at: '2024-02-10T11:30:00.000Z',
        roles: ['Standard User'],
        status: 'inactive'
      },
      {
        id: '5',
        email: 'emma.hr@techcorp.com',
        first_name: 'Emma',
        last_name: 'Thompson',
        phone: '+1-555-0126',
        job_title: 'HR Specialist',
        department: 'Human Resources',
        active: true,
        organization_id: 'org-4',
        organization_name: 'Human Resources',
        last_login: '2024-06-24T10:00:00.000Z',
        created_at: '2024-02-20T13:30:00.000Z',
        roles: ['HR Specialist'],
        status: 'pending'
      }
    ];

    // Apply filters
    let filteredUsers = users;
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.first_name.toLowerCase().includes(searchTerm) ||
        user.last_name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.job_title.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.status && filters.status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }
    
    if (filters.organization && filters.organization !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.organization_id === filters.organization);
    }

    return {
      success: true,
      data: filteredUsers,
      total: filteredUsers.length
    };
  },

  async createUser(userData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      success: true,
      data: {
        id: Date.now().toString(),
        ...userData,
        created_at: new Date().toISOString(),
        status: 'active'
      }
    };
  },

  async updateUser(id, userData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      success: true,
      data: { id, ...userData, updated_at: new Date().toISOString() }
    };
  },

  async deleteUser(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    return { success: true };
  },

  async getUserRoles(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      success: true,
      data: [
        { id: '1', name: 'System Administrator' },
        { id: '2', name: 'Manager' },
        { id: '3', name: 'Standard User' },
        { id: '4', name: 'HR Specialist' }
      ]
    };
  },

  async assignRole(userId, roleId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },

  async removeRole(userId, roleId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => (
  <div className={`
    fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg transition-all duration-300
    ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
    text-white flex items-center space-x-2
  `}>
    <span>{message}</span>
    <button onClick={onClose} className="ml-2">
      <X className="h-4 w-4" />
    </button>
  </div>
);

// Loading spinner component
const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 ${sizeClasses[size]}`}></div>
    </div>
  );
};

// Create/Edit User Modal
const UserModal = ({ isOpen, onClose, user, onSave, loading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    job_title: '',
    department: '',
    organization_id: '',
    active: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        job_title: '',
        department: '',
        organization_id: '',
        active: true
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.job_title) newErrors.job_title = 'Job title is required';
    if (!formData.organization_id) newErrors.organization_id = 'Organization is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {user ? 'Edit User' : 'Create New User'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${errors.first_name ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${errors.last_name ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`mt-1 block w-full border rounded-md px-3 py-2 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title *</label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${errors.job_title ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.job_title && <p className="mt-1 text-sm text-red-600">{errors.job_title}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Organization *</label>
              <select
                value={formData.organization_id}
                onChange={(e) => setFormData({...formData, organization_id: e.target.value})}
                className={`mt-1 block w-full border rounded-md px-3 py-2 ${errors.organization_id ? 'border-red-300' : 'border-gray-300'}`}
              >
                <option value="">Select Organization</option>
                <option value="org-1">Engineering Division</option>
                <option value="org-2">Sales & Marketing</option>
                <option value="org-3">Human Resources</option>
                <option value="org-4">Finance & Admin</option>
              </select>
              {errors.organization_id && <p className="mt-1 text-sm text-red-600">{errors.organization_id}</p>}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({...formData, active: e.target.checked})}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
            />
            <label htmlFor="active" className="ml-2 text-sm text-gray-700">
              Active User
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {loading ? <LoadingSpinner size="small" /> : null}
              <span className={loading ? 'ml-2' : ''}>{user ? 'Update' : 'Create'} User</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Role Management Modal
const RoleModal = ({ isOpen, onClose, user, availableRoles, userRoles, onAssignRole, onRemoveRole, loading }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Manage Roles for {user.first_name} {user.last_name}
          </h3>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Current Roles</h4>
              {userRoles.length > 0 ? (
                <div className="space-y-2">
                  {userRoles.map((role) => (
                    <div key={role.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-900">{role.name}</span>
                      <button
                        onClick={() => onRemoveRole(user.id, role.id)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No roles assigned</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Available Roles</h4>
              <div className="space-y-2">
                {availableRoles.filter(role => !userRoles.find(ur => ur.id === role.id)).map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm text-gray-900">{role.name}</span>
                    <button
                      onClick={() => onAssignRole(user.id, role.id)}
                      disabled={loading}
                      className="text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, user, onConfirm, loading }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-3 text-center">
            <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete {user.first_name} {user.last_name}? This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(user.id)}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
            >
              {loading ? <LoadingSpinner size="small" /> : null}
              <span className={loading ? 'ml-2' : ''}>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main User Management Component
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [organizationFilter, setOrganizationFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [searchTerm, statusFilter, organizationFilter]);

  // Load available roles
  useEffect(() => {
    loadAvailableRoles();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await mockApiService.getUsers('tenant-1', {
        search: searchTerm,
        status: statusFilter,
        organization: organizationFilter
      });
      
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRoles = async () => {
    try {
      const response = await mockApiService.getUserRoles();
      if (response.success) {
        setAvailableRoles(response.data);
      }
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      setActionLoading(true);
      const response = await mockApiService.createUser(userData);
      
      if (response.success) {
        setUsers([...users, response.data]);
        setShowUserModal(false);
        setSelectedUser(null);
        showToast('User created successfully');
      }
    } catch (error) {
      showToast('Failed to create user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      setActionLoading(true);
      const response = await mockApiService.updateUser(selectedUser.id, userData);
      
      if (response.success) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...userData } : u));
        setShowUserModal(false);
        setSelectedUser(null);
        showToast('User updated successfully');
      }
    } catch (error) {
      showToast('Failed to update user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setActionLoading(true);
      const response = await mockApiService.deleteUser(userId);
      
      if (response.success) {
        setUsers(users.filter(u => u.id !== userId));
        setShowDeleteModal(false);
        setSelectedUser(null);
        showToast('User deleted successfully');
      }
    } catch (error) {
      showToast('Failed to delete user', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignRole = async (userId, roleId) => {
    try {
      setActionLoading(true);
      const response = await mockApiService.assignRole(userId, roleId);
      
      if (response.success) {
        const role = availableRoles.find(r => r.id === roleId);
        setUserRoles([...userRoles, role]);
        showToast('Role assigned successfully');
      }
    } catch (error) {
      showToast('Failed to assign role', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveRole = async (userId, roleId) => {
    try {
      setActionLoading(true);
      const response = await mockApiService.removeRole(userId, roleId);
      
      if (response.success) {
        setUserRoles(userRoles.filter(r => r.id !== roleId));
        showToast('Role removed successfully');
      }
    } catch (error) {
      showToast('Failed to remove role', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setUserRoles(availableRoles.filter(role => user.roles.includes(role.name)));
    setShowRoleModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  // Pagination
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage users, roles, and permissions across your organization
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </button>
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setShowUserModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
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
                  placeholder="Search users by name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              
              <select
                value={organizationFilter}
                onChange={(e) => setOrganizationFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Organizations</option>
                <option value="org-1">Engineering Division</option>
                <option value="org-2">Sales & Marketing</option>
                <option value="org-3">Human Resources</option>
                <option value="org-4">Finance & Admin</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{users.length} users found</span>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtered results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12">
            <LoadingSpinner size="large" />
            <p className="text-center text-gray-500 mt-4">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
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
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.job_title}
                            </div>
                          </div>
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
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-400" />
                          {user.organization_name}
                        </div>
                        {user.department && (
                          <div className="text-sm text-gray-500">
                            {user.department}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              {role}
                            </span>
                          ))}
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
                          {new Date(user.last_login).toLocaleDateString()}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit User"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openRoleModal(user)}
                            className="text-green-600 hover:text-green-900"
                            title="Manage Roles"
                          >
                            <Shield className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(startIndex + itemsPerPage, users.length)}
                      </span>{' '}
                      of <span className="font-medium">{users.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => setCurrentPage(index + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === index + 1
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || organizationFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by creating a new user'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && organizationFilter === 'all') && (
              <div className="mt-6">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setShowUserModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={selectedUser ? handleUpdateUser : handleCreateUser}
        loading={actionLoading}
      />

      <RoleModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUser(null);
          setUserRoles([]);
        }}
        user={selectedUser}
        availableRoles={availableRoles}
        userRoles={userRoles}
        onAssignRole={handleAssignRole}
        onRemoveRole={handleRemoveRole}
        loading={actionLoading}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onConfirm={handleDeleteUser}
        loading={actionLoading}
      />
    </div>
  );
};

export default UserManagement;