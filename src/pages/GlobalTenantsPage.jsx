import React, { useState, useEffect } from 'react';
import {
  Building,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreVertical,
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';

// Mock API service
const mockApi = {
  async getGlobalTenants(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const tenants = [
      {
        id: 'tenant-1',
        name: 'TechCorp Solutions',
        industry: 'Technology',
        employees: 250,
        status: 'active',
        region: 'US-West',
        plan: 'Enterprise',
        monthlyRevenue: 125000,
        createdAt: '2024-01-15',
        lastActivity: '2024-06-26T10:30:00Z',
        features: ['API Access', 'Advanced Analytics', 'Custom Integrations'],
        contactEmail: 'admin@techcorp.com',
        contactPhone: '+1-555-0123',
        logo: 'https://via.placeholder.com/60x60/4F46E5/FFFFFF?text=TC'
      },
      {
        id: 'tenant-2',
        name: 'Global Enterprises',
        industry: 'Consulting',
        employees: 500,
        status: 'active',
        region: 'US-East',
        plan: 'Professional',
        monthlyRevenue: 85000,
        createdAt: '2024-02-01',
        lastActivity: '2024-06-26T09:15:00Z',
        features: ['Team Collaboration', 'Reporting Suite'],
        contactEmail: 'contact@globalent.com',
        contactPhone: '+1-555-0456',
        logo: 'https://via.placeholder.com/60x60/059669/FFFFFF?text=GE'
      },
      {
        id: 'tenant-3',
        name: 'Innovation Hub',
        industry: 'Startup Accelerator',
        employees: 45,
        status: 'trial',
        region: 'US-West',
        plan: 'Startup',
        monthlyRevenue: 12000,
        createdAt: '2024-03-10',
        lastActivity: '2024-06-26T08:45:00Z',
        features: ['Basic Features'],
        contactEmail: 'hello@innovationhub.com',
        contactPhone: '+1-555-0789',
        logo: 'https://via.placeholder.com/60x60/DC2626/FFFFFF?text=IH'
      }
    ];

    let filtered = [...tenants];
    
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.region && filters.region !== 'all') {
      filtered = filtered.filter(t => t.region === filters.region);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.industry.toLowerCase().includes(search) ||
        t.contactEmail.toLowerCase().includes(search)
      );
    }
    
    return {
      success: true,
      data: filtered,
      total: filtered.length
    };
  },

  async createTenant(tenantData) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      data: { id: `tenant-${Date.now()}`, ...tenantData }
    };
  },

  async updateTenant(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true };
  },

  async deleteTenant(id) {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true };
  }
};

const GlobalTenantsPage = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadTenants();
  }, [searchTerm, statusFilter, regionFilter]);

  const loadTenants = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getGlobalTenants({
        search: searchTerm,
        status: statusFilter,
        region: regionFilter
      });
      if (response.success) {
        setTenants(response.data);
      }
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (tenantData) => {
    try {
      const response = await mockApi.createTenant(tenantData);
      if (response.success) {
        loadTenants();
        setShowCreateModal(false);
        alert('Tenant created successfully!');
      }
    } catch (error) {
      alert('Failed to create tenant');
    }
  };

  const handleUpdateTenant = async (updates) => {
    try {
      await mockApi.updateTenant(selectedTenant.id, updates);
      loadTenants();
      setShowEditModal(false);
      setSelectedTenant(null);
      alert('Tenant updated successfully!');
    } catch (error) {
      alert('Failed to update tenant');
    }
  };

  const handleDeleteTenant = async () => {
    try {
      await mockApi.deleteTenant(selectedTenant.id);
      setTenants(tenants.filter(t => t.id !== selectedTenant.id));
      setShowDeleteModal(false);
      setSelectedTenant(null);
      alert('Tenant deleted successfully!');
    } catch (error) {
      alert('Failed to delete tenant');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'trial':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'suspended':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      trial: 'bg-yellow-100 text-yellow-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building className="h-6 w-6 mr-2 text-blue-600" />
                Global Tenants
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage all tenants across the system
              </p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={loadTenants}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
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
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+2</span>
              <span className="text-gray-500"> this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {tenants.reduce((sum, t) => sum + t.employees, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-gray-500"> growth</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {formatCurrency(tenants.reduce((sum, t) => sum + t.monthlyRevenue, 0))}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+8%</span>
              <span className="text-gray-500"> vs last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-yellow-600" />
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
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">
                {Math.round((tenants.filter(t => t.status === 'active').length / tenants.length) * 100)}%
              </span>
              <span className="text-gray-500"> activity rate</span>
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
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="trial">Trial</option>
                <option value="suspended">Suspended</option>
              </select>
              
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Regions</option>
                <option value="US-West">US West</option>
                <option value="US-East">US East</option>
                <option value="EU">Europe</option>
                <option value="APAC">Asia Pacific</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{tenants.length} tenants found</span>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtered results</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tenants List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading tenants...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-12 w-12 rounded-lg" 
                        src={tenant.logo} 
                        alt={tenant.name}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{tenant.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tenant.status)}`}>
                          {getStatusIcon(tenant.status)}
                          <span className="ml-1 capitalize">{tenant.status}</span>
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {tenant.plan}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Building className="h-4 w-4 mr-1" />
                          {tenant.industry}
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {tenant.employees} employees
                        </span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {tenant.region}
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {formatCurrency(tenant.monthlyRevenue)}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-900">
                        Last activity: {getTimeAgo(tenant.lastActivity)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {formatDate(tenant.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowEditModal(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Edit Tenant"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Delete Tenant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-800">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Tenant Features */}
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {tenant.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tenants.length === 0 && (
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || regionFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first tenant'
              }
            </p>
            {(!searchTerm && statusFilter === 'all' && regionFilter === 'all') && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tenant
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateTenantModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateTenant}
        />
      )}

      {showEditModal && selectedTenant && (
        <EditTenantModal
          tenant={selectedTenant}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTenant(null);
          }}
          onSubmit={handleUpdateTenant}
        />
      )}

      {showDeleteModal && selectedTenant && (
        <DeleteTenantModal
          tenant={selectedTenant}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedTenant(null);
          }}
          onConfirm={handleDeleteTenant}
        />
      )}

      {showDetailModal && selectedTenant && (
        <TenantDetailModal
          tenant={selectedTenant}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedTenant(null);
          }}
        />
      )}
    </div>
  );
};

// Modal Components
const CreateTenantModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    plan: 'Professional',
    region: 'US-West',
    contactEmail: '',
    contactPhone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Tenant</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Startup">Startup</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Tenant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EditTenantModal = ({ tenant, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: tenant.name,
    industry: tenant.industry,
    plan: tenant.plan,
    region: tenant.region,
    contactEmail: tenant.contactEmail,
    contactPhone: tenant.contactPhone
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Tenant</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({...formData, plan: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="Startup">Startup</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Tenant
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const DeleteTenantModal = ({ tenant, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Delete Tenant</h3>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete "{tenant.name}"? This action cannot be undone and will permanently delete all associated data.
            </p>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Delete Tenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TenantDetailModal = ({ tenant, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <img 
                className="h-16 w-16 rounded-lg" 
                src={tenant.logo} 
                alt={tenant.name}
              />
              <div>
                <h3 className="text-xl font-medium text-gray-900">{tenant.name}</h3>
                <p className="text-gray-500">{tenant.industry}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    {tenant.contactEmail}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    {tenant.contactPhone}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    {tenant.region}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Plan & Billing</h4>
                <div className="space-y-2 text-sm">
                  <div>Plan: <span className="font-medium">{tenant.plan}</span></div>
                  <div>Monthly Revenue: <span className="font-medium">{formatCurrency(tenant.monthlyRevenue)}</span></div>
                  <div>Employees: <span className="font-medium">{tenant.employees}</span></div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Status & Activity</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    Status: 
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tenant.status)}`}>
                      {getStatusIcon(tenant.status)}
                      <span className="ml-1 capitalize">{tenant.status}</span>
                    </span>
                  </div>
                  <div>Created: <span className="font-medium">{formatDate(tenant.createdAt)}</span></div>
                  <div>Last Activity: <span className="font-medium">{getTimeAgo(tenant.lastActivity)}</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {tenant.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

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

export default GlobalTenantsPage;