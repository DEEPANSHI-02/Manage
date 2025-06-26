import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Building,
  Users,
  Globe,
  Mail,
  Phone
} from 'lucide-react';
import { mockApi } from '../services/mockApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * Tenant Management Page Component
 * Handles CRUD operations for tenants
 */
const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load tenants on component mount
  useEffect(() => {
    loadTenants();
  }, []);

  /**
   * Load tenants from API
   */
  const loadTenants = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getTenants();
      if (response.success) {
        setTenants(response.data);
      }
    } catch (error) {
      toast.error('Failed to load tenants');
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter tenants based on search term
   */
  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle tenant creation
   */
  const handleCreateTenant = async (tenantData) => {
    try {
      const response = await mockApi.createTenant(tenantData);
      if (response.success) {
        setShowCreateModal(false);
        toast.success('Tenant created successfully');
        loadTenants();
      }
    } catch (error) {
      toast.error('Failed to create tenant');
      console.error('Error creating tenant:', error);
    }
  };

  /**
   * Handle tenant update
   */
  const handleUpdateTenant = async (tenantData) => {
    try {
      const response = await mockApi.updateTenant(selectedTenant.id, tenantData);
      if (response.success) {
        setShowEditModal(false);
        setSelectedTenant(null);
        toast.success('Tenant updated successfully');
        loadTenants();
      }
    } catch (error) {
      toast.error('Failed to update tenant');
      console.error('Error updating tenant:', error);
    }
  };

  /**
   * Handle tenant deletion
   */
  const handleDeleteTenant = async () => {
    try {
      await mockApi.deleteTenant(selectedTenant.id);
      setShowDeleteModal(false);
      setSelectedTenant(null);
      toast.success('Tenant deleted successfully');
      loadTenants();
    } catch (error) {
      toast.error('Failed to delete tenant');
      console.error('Error deleting tenant:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading tenants..." />;
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
                Manage tenants and their configurations
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredTenants.length} of {tenants.length} tenants
            </div>
          </div>
        </div>
      </div>

      {/* Tenants Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredTenants.map((tenant) => (
          <div key={tenant.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {tenant.logo_url ? (
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={tenant.logo_url} 
                      alt={tenant.name} 
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {tenant.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    {tenant.industry}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className={`
                    inline-flex px-2 py-1 text-xs font-semibold rounded-full
                    ${tenant.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                    }
                  `}>
                    {tenant.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {tenant.description}
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  {tenant.email}
                </div>
                {tenant.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {tenant.phone}
                  </div>
                )}
                {tenant.website && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="h-4 w-4 mr-2" />
                    <a 
                      href={tenant.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {tenant.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {tenant.employee_count} employees
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setShowEditModal(true);
                  }}
                  className="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit className="h-4 w-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedTenant(tenant);
                    setShowDeleteModal(true);
                  }}
                  className="flex-1 bg-white py-2 px-3 border border-red-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTenants.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'Get started by creating a new tenant'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals would go here - CreateTenantModal, EditTenantModal, DeleteConfirmationModal */}
      {/* For brevity, I'll create these in separate components */}
    </div>
  );
};

export default TenantManagement;