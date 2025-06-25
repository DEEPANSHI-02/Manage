// src/pages/OrganizationManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Building,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  ChevronRight,
  ChevronDown,
  Building2
} from 'lucide-react';
import { mockApi } from '../services/mockApi';
import LoadingSpinner from '../components/common/LoadingSpinner';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import CreateOrganizationModal from '../components/modals/CreateOrganizationModal';
import EditOrganizationModal from '../components/modals/EditOrganizationModal';
import DeleteConfirmationModal from '../components/modals/DeleteConfirmationModal';

/**
 * Organization Management Page Component
 * Handles CRUD operations for organizations with hierarchical structure
 */
const OrganizationManagement = () => {
  const { user } = useAuthStore();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [expandedOrgs, setExpandedOrgs] = useState(new Set());

  // Load organizations on component mount
  useEffect(() => {
    loadOrganizations();
  }, []);

  /**
   * Load organizations from API
   */
  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getOrganizations(user.tenant_id);
      if (response.success) {
        setOrganizations(response.data);
      }
    } catch (error) {
      toast.error('Failed to load organizations');
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get unique industries for filter dropdown
   */
  const getUniqueIndustries = () => {
    const industries = [...new Set(organizations.map(org => org.industry))];
    return industries.filter(Boolean).sort();
  };

  /**
   * Filter organizations based on search term and filters
   */
  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (org.industry && org.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (org.description && org.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIndustry = !industryFilter || org.industry === industryFilter;
    
    const matchesStatus = 
      statusFilter === '' || 
      (statusFilter === 'active' && org.active) ||
      (statusFilter === 'inactive' && !org.active);

    return matchesSearch && matchesIndustry && matchesStatus;
  });

  /**
   * Build hierarchical organization structure
   */
  const buildHierarchy = (orgs, parentId = null) => {
    return orgs
      .filter(org => org.parent_organization_id === parentId)
      .map(org => ({
        ...org,
        children: buildHierarchy(orgs, org.id)
      }));
  };

  const hierarchicalOrgs = buildHierarchy(filteredOrganizations);

  /**
   * Toggle organization expansion in hierarchy view
   */
  const toggleExpanded = (orgId) => {
    const newExpanded = new Set(expandedOrgs);
    if (newExpanded.has(orgId)) {
      newExpanded.delete(orgId);
    } else {
      newExpanded.add(orgId);
    }
    setExpandedOrgs(newExpanded);
  };

  /**
   * Handle organization creation
   */
  const handleCreateOrganization = async (orgData) => {
    try {
      const response = await mockApi.createOrganization(user.tenant_id, orgData);
      if (response.success) {
        setOrganizations([...organizations, response.data]);
        setShowCreateModal(false);
        toast.success('Organization created successfully');
      }
    } catch (error) {
      toast.error('Failed to create organization');
      console.error('Error creating organization:', error);
    }
  };

  /**
   * Handle organization update
   */
  const handleUpdateOrganization = async (orgData) => {
    try {
      const response = await mockApi.updateOrganization(selectedOrganization.id, orgData);
      if (response.success) {
        setOrganizations(organizations.map(o => 
          o.id === selectedOrganization.id ? response.data : o
        ));
        setShowEditModal(false);
        setSelectedOrganization(null);
        toast.success('Organization updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update organization');
      console.error('Error updating organization:', error);
    }
  };

  /**
   * Handle organization deletion
   */
  const handleDeleteOrganization = async () => {
    try {
      // Check if organization has child organizations
      const hasChildren = organizations.some(org => org.parent_organization_id === selectedOrganization.id);
      if (hasChildren) {
        toast.error('Cannot delete organization with sub-organizations. Please delete or reassign child organizations first.');
        return;
      }

      await mockApi.deleteOrganization(selectedOrganization.id);
      setOrganizations(organizations.filter(o => o.id !== selectedOrganization.id));
      setShowDeleteModal(false);
      setSelectedOrganization(null);
      toast.success('Organization deleted successfully');
    } catch (error) {
      toast.error('Failed to delete organization');
      console.error('Error deleting organization:', error);
    }
  };

  /**
   * Render organization card
   */
  const renderOrganizationCard = (org, level = 0) => {
    const hasChildren = org.children && org.children.length > 0;
    const isExpanded = expandedOrgs.has(org.id);

    return (
      <div key={org.id} className={`${level > 0 ? 'ml-8' : ''}`}>
        <div className="bg-white overflow-hidden shadow rounded-lg mb-4">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                {hasChildren && (
                  <button
                    onClick={() => toggleExpanded(org.id)}
                    className="mr-2 p-1 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                )}
                
                <div className="flex-shrink-0">
                  {org.logo_url ? (
                    <img 
                      className="h-12 w-12 rounded-full" 
                      src={org.logo_url} 
                      alt={org.name} 
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                      {level > 0 ? (
                        <Building2 className="h-6 w-6 text-white" />
                      ) : (
                        <Building className="h-6 w-6 text-white" />
                      )}
                    </div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {org.name}
                    </h3>
                    {level > 0 && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Sub-organization
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {org.industry} • {org.employee_count} employees
                  </p>
                  {org.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {org.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`
                  inline-flex px-2 py-1 text-xs font-semibold rounded-full
                  ${org.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }
                `}>
                  {org.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-4 w-4 mr-2" />
                  {org.email}
                </div>
                {org.phone && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="h-4 w-4 mr-2" />
                    {org.phone}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {org.website && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Globe className="h-4 w-4 mr-2" />
                    <a 
                      href={org.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      {org.website}
                    </a>
                  </div>
                )}
                {org.address && (
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-2" />
                    {org.address}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => {
                  setSelectedOrganization(org);
                  setShowViewModal(true);
                }}
                className="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Eye className="h-4 w-4 inline mr-1" />
                View
              </button>
              <button
                onClick={() => {
                  setSelectedOrganization(org);
                  setShowEditModal(true);
                }}
                className="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Edit className="h-4 w-4 inline mr-1" />
                Edit
              </button>
              <button
                onClick={() => {
                  setSelectedOrganization(org);
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

        {/* Render children if expanded */}
        {hasChildren && isExpanded && (
          <div className="ml-4 border-l-2 border-gray-200 pl-4">
            {org.children.map(child => renderOrganizationCard(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner message="Loading organizations..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organization Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage organizational structures and hierarchies
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              {/* Industry Filter */}
              <select
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Industries</option>
                {getUniqueIndustries().map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="text-sm text-gray-500">
              {filteredOrganizations.length} of {organizations.length} organizations
            </div>
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="space-y-4">
        {hierarchicalOrgs.length > 0 ? (
          hierarchicalOrgs.map(org => renderOrganizationCard(org))
        ) : (
          /* Empty State */
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || industryFilter || statusFilter
                ? 'Try adjusting your search criteria' 
                : 'Get started by creating a new organization'
              }
            </p>
            {!searchTerm && !industryFilter && !statusFilter && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateOrganizationModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateOrganization}
          organizations={organizations}
          tenantId={user.tenant_id}
        />
      )}

      {showEditModal && selectedOrganization && (
        <EditOrganizationModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedOrganization(null);
          }}
          onSubmit={handleUpdateOrganization}
          organization={selectedOrganization}
          organizations={organizations}
        />
      )}

      {showDeleteModal && selectedOrganization && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedOrganization(null);
          }}
          onConfirm={handleDeleteOrganization}
          title="Delete Organization"
          message={`Are you sure you want to delete "${selectedOrganization.name}"? This action cannot be undone.`}
          confirmButtonText="Delete Organization"
        />
      )}
    </div>
  );
};

export default OrganizationManagement;