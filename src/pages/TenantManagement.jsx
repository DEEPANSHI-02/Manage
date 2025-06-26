// src/pages/TenantManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search, 
  Filter,
  Download,
  Building,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Star,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import TenantOnboardingWizard from '../components/modals/TenantOnboardingWizard';

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showWizard, setShowWizard] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock tenant data - replace with actual API calls
  const mockTenants = [
    {
      id: 'tenant-1',
      name: 'TechCorp Solutions',
      industry: 'Technology',
      description: 'Leading software development company',
      email: 'admin@techcorp.com',
      phone: '+1-555-0100',
      website: 'https://techcorp.com',
      employee_count: 250,
      active: true,
      plan: 'Enterprise',
      created_at: '2024-01-15T10:30:00.000Z',
      last_activity: '2024-06-27T09:15:00.000Z',
      organizations: 4,
      users: 82,
      status: 'active'
    },
    {
      id: 'tenant-2',
      name: 'Global Enterprises',
      industry: 'Consulting',
      description: 'Strategic business consulting firm',
      email: 'contact@globalent.com',
      phone: '+1-555-0200',
      website: 'https://globalenterprises.com',
      employee_count: 500,
      active: true,
      plan: 'Premium',
      created_at: '2024-02-20T14:20:00.000Z',
      last_activity: '2024-06-26T16:45:00.000Z',
      organizations: 6,
      users: 156,
      status: 'active'
    },
    {
      id: 'tenant-3',
      name: 'Innovation Startup Hub',
      industry: 'Venture Capital',
      description: 'Early-stage startup incubator',
      email: 'hello@innovationhub.com',
      phone: '+1-555-0300',
      website: 'https://innovationhub.com',
      employee_count: 45,
      active: false,
      plan: 'Standard',
      created_at: '2024-03-10T09:15:00.000Z',
      last_activity: '2024-06-25T11:30:00.000Z',
      organizations: 2,
      users: 28,
      status: 'inactive'
    },
    {
      id: 'tenant-4',
      name: 'Enterprise Solutions Ltd',
      industry: 'Software',
      description: 'Custom enterprise software solutions',
      email: 'info@enterprisesolutions.com',
      phone: '+1-555-0400',
      website: 'https://enterprisesolutions.com',
      employee_count: 180,
      active: true,
      plan: 'Enterprise',
      created_at: '2024-04-05T11:45:00.000Z',
      last_activity: '2024-06-27T08:30:00.000Z',
      organizations: 3,
      users: 95,
      status: 'setup_pending'
    }
  ];

  useEffect(() => {
    loadTenants();
  }, []);

  // Debug: Log when tenants state changes
  useEffect(() => {
    console.log('Tenants state updated:', tenants.length, 'tenants');
    console.log('Current tenants:', tenants);
  }, [tenants]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTenants(mockTenants);
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast.error('Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleWizardComplete = async (tenantData) => {
    try {
      console.log('Creating tenant with data:', tenantData);
      
      // Simulate API call to create tenant
      const newTenant = {
        id: `tenant-${Date.now()}`,
        name: tenantData.tenant.name,
        industry: tenantData.tenant.industry,
        description: tenantData.tenant.description,
        email: tenantData.tenant.email,
        phone: tenantData.tenant.phone,
        website: tenantData.tenant.website,
        employee_count: tenantData.users.length, // Use actual user count
        active: true,
        plan: 'Standard', // Default plan
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        organizations: tenantData.organizations.length,
        users: tenantData.users.length,
        status: 'active'
      };

      // Add to tenants list at the beginning
      setTenants(prevTenants => [newTenant, ...prevTenants]);
      
      toast.success(`Tenant "${tenantData.tenant.name}" created successfully!`);
      
      // Show detailed success message
      setTimeout(() => {
        toast.success(
          `✅ Setup Complete!\n• ${tenantData.organizations.length} organizations\n• ${tenantData.users.length} users\n• ${tenantData.roles.filter(r => r.selected).length} roles configured`,
          { 
            duration: 5000,
            style: {
              background: '#10B981',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px'
            }
          }
        );
      }, 500);

    } catch (error) {
      console.error('Error creating tenant:', error);
      toast.error('Failed to create tenant. Please try again.');
      throw error; // Re-throw to prevent wizard from closing
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTenants(prev => prev.filter(t => t.id !== tenantId));
      setShowDeleteModal(false);
      setSelectedTenant(null);
      
      toast.success('Tenant deleted successfully');
    } catch (error) {
      toast.error('Failed to delete tenant');
    }
  };

  const handleToggleStatus = async (tenantId) => {
    try {
      setTenants(prev => prev.map(tenant => 
        tenant.id === tenantId 
          ? { ...tenant, active: !tenant.active, status: !tenant.active ? 'active' : 'inactive' }
          : tenant
      ));
      
      const tenant = tenants.find(t => t.id === tenantId);
      toast.success(`Tenant ${!tenant.active ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update tenant status');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      setup_pending: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'setup_pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlanBadge = (plan) => {
    const badges = {
      Enterprise: 'bg-purple-100 text-purple-800',
      Premium: 'bg-blue-100 text-blue-800',
      Standard: 'bg-gray-100 text-gray-800'
    };
    return badges[plan] || 'bg-gray-100 text-gray-800';
  };

  // Filter tenants based on search and status
  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log('Filtered tenants:', filteredTenants.length, 'out of', tenants.length);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage all tenant organizations and their configurations
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowWizard(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Tenant Setup
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tenants</dt>
                  <dd className="text-lg font-medium text-gray-900">{tenants.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Tenants</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tenants.filter(t => t.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tenants.reduce((sum, t) => sum + t.users, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Setup Pending</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tenants.filter(t => t.status === 'setup_pending').length}
                  </dd>
                </dl>
              </div>
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
                  placeholder="Search tenants by name, industry, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="setup_pending">Setup Pending</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry & Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users & Orgs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search criteria or filters'
                        : 'Get started by creating your first tenant'
                      }
                    </p>
                    {!searchTerm && statusFilter === 'all' && (
                      <div className="mt-6">
                        <button
                          onClick={() => setShowWizard(true)}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Tenant Setup
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredTenants.map((tenant) => (
                  <tr key={tenant.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {tenant.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {tenant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {tenant.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tenant.industry}</div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanBadge(tenant.plan)}`}>
                        {tenant.plan}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {tenant.users} users
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Building className="h-4 w-4 mr-1 text-gray-400" />
                        {tenant.organizations} orgs
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tenant.status)}`}>
                        {getStatusIcon(tenant.status)}
                        <span className="ml-1 capitalize">{tenant.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tenant.created_at)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(tenant.last_activity)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => {/* View tenant details */}}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {/* Edit tenant */}}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Edit Tenant"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(tenant.id)}
                          className={tenant.active ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                          title={tenant.active ? "Deactivate" : "Activate"}
                        >
                          {tenant.active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTenant(tenant);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Tenant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tenant Onboarding Wizard */}
      <TenantOnboardingWizard
        isOpen={showWizard}
        onClose={() => setShowWizard(false)}
        onComplete={handleWizardComplete}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTenant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete Tenant
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete "{selectedTenant.name}"? This action cannot be undone and will permanently remove all associated data, users, and organizations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex flex-row-reverse space-x-2 space-x-reverse">
              <button
                onClick={() => handleDeleteTenant(selectedTenant.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedTenant(null);
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantManagement;