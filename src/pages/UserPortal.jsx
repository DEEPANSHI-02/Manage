// Fixed UserPortal.jsx - Rules of Hooks violation fixed
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

// Add missing icon imports
import { 
  User, 
  Building, 
  Shield, 
  Activity, 
  Settings, 
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Bell,
  Eye,
  EyeOff,
  Plus,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const UserPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Move all hooks to the top level - this fixes the Rules of Hooks violation
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('/my-profile') || path.includes('/profile')) return 'profile';
    if (path.includes('/my-organization') || path.includes('/organization')) return 'organization';
    if (path.includes('/legal-entities')) return 'legal-entities';
    if (path.includes('/my-settings') || path.includes('/settings')) return 'preferences';
    if (path.includes('/activity')) return 'activity';
    if (path.includes('/security')) return 'security';
    return 'overview';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());
  const [userData, setUserData] = useState({
    profile: null,
    organization: null,
    legalEntities: [],
    recentActivity: [],
    notifications: [],
    securitySettings: null,
    preferences: null
  });
  
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedLegalEntity, setSelectedLegalEntity] = useState(null);
  const [showLegalEntityModal, setShowLegalEntityModal] = useState(false);

  // Load all user data from APIs
  useEffect(() => {
    loadUserData();
  }, []);

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        profileResponse,
        organizationResponse,
        legalEntitiesResponse,
      ] = await Promise.all([
        mockApi.getCurrentUser(),
        mockApi.getOrganizations(user?.tenant_id),
        mockApi.getLegalEntities(user?.tenant_id),
      ]);

      // Find user's organization
      const userOrganization = organizationResponse.data.find(
        org => org.id === user?.organization_id
      );

      setUserData({
        profile: profileResponse.data,
        organization: userOrganization,
        legalEntities: legalEntitiesResponse.data,
        recentActivity: [
          {
            id: 1,
            type: 'profile_update',
            description: 'Updated profile information',
            timestamp: new Date().toISOString(),
            icon: User,
            color: 'text-blue-600'
          },
          {
            id: 2,
            type: 'login',
            description: 'Logged in from new device',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            icon: Shield,
            color: 'text-green-600'
          }
        ],
        notifications: [
          {
            id: 1,
            type: 'system',
            title: 'System Maintenance',
            message: 'Scheduled maintenance on June 30th from 2:00 AM to 4:00 AM PST',
            priority: 'medium',
            read: false,
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: 'info',
            title: 'Profile Updated',
            message: 'Your profile information has been successfully updated',
            priority: 'low',
            read: true,
            timestamp: new Date(Date.now() - 86400000).toISOString()
          }
        ],
        securitySettings: {
          lastPasswordChange: new Date().toISOString(),
          twoFactorEnabled: false,
          sessionTimeout: 3600,
          loginHistory: [
            {
              id: 1,
              ip: '192.168.1.1',
              location: 'San Francisco, CA',
              device: 'Chrome on Windows',
              timestamp: new Date().toISOString(),
              success: true
            }
          ]
        },
        preferences: {
          theme: 'light',
          language: 'English',
          timezone: 'America/Los_Angeles',
          emailNotifications: true,
          pushNotifications: true,
          smsNotifications: false,
          weeklyDigest: true
        }
      });

    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  // Handle profile save with API call
  const handleProfileSave = async (updatedProfile) => {
    try {
      const response = await mockApi.updateCurrentUser(updatedProfile);
      
      setUserData({
        ...userData,
        profile: response.data
      });
      
      toast.success('Profile updated successfully');
      setShowProfileModal(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Handle legal entity creation
  const handleCreateLegalEntity = async (entityData) => {
    try {
      const response = await mockApi.createLegalEntity(user?.tenant_id, entityData);
      
      setUserData({
        ...userData,
        legalEntities: [...userData.legalEntities, response.data]
      });
      
      toast.success('Legal entity created successfully');
      setShowLegalEntityModal(false);
    } catch (error) {
      console.error('Error creating legal entity:', error);
      toast.error('Failed to create legal entity');
    }
  };

  // Handle legal entity update
  const handleUpdateLegalEntity = async (entityId, entityData) => {
    try {
      const response = await mockApi.updateLegalEntity(entityId, entityData);
      
      setUserData({
        ...userData,
        legalEntities: userData.legalEntities.map(entity =>
          entity.id === entityId ? response.data : entity
        )
      });
      
      toast.success('Legal entity updated successfully');
      setShowLegalEntityModal(false);
    } catch (error) {
      console.error('Error updating legal entity:', error);
      toast.error('Failed to update legal entity');
    }
  };

  // Handle tab changes and update URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    const paths = {
      overview: '/dashboard',
      profile: '/my-profile',
      organization: '/my-organization',
      'legal-entities': '/legal-entities',
      activity: '/activity',
      security: '/security',
      preferences: '/my-settings'
    };
    navigate(paths[tab] || '/dashboard');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: User },
    { id: 'profile', name: 'My Profile', icon: User },
    { id: 'organization', name: 'My Organization', icon: Building },
    { id: 'legal-entities', name: 'Legal Entities', icon: Building },
    { id: 'activity', name: 'Activity', icon: Activity },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'preferences', name: 'Settings', icon: Settings }
  ];

  // Basic Profile Edit Modal Component
  const ProfileEditModal = () => {
    const [formData, setFormData] = useState({
      first_name: userData.profile?.first_name || '',
      last_name: userData.profile?.last_name || '',
      email: userData.profile?.email || '',
      phone: userData.profile?.phone || '',
      job_title: userData.profile?.job_title || '',
      department: userData.profile?.department || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleProfileSave(formData);
    };

    if (!showProfileModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <input
                type="text"
                value={formData.job_title}
                onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Show loading spinner while data loads
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="ml-4 text-gray-600">Loading your dashboard...</p>
      </div>
    );
  }

  // Show error if no data loaded
  if (!userData.profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Unable to load dashboard</h3>
          <p className="text-gray-500">Please refresh the page or contact support</p>
          <button 
            onClick={loadUserData}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header - Updated to use API data */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow rounded-lg">
        <div className="px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-xl font-semibold">
                {getInitials(userData.profile?.first_name, userData.profile?.last_name)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {userData.profile?.first_name}!
                </h1>
                <p className="text-indigo-100">
                  {userData.profile?.job_title} • {userData.organization?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-md transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Profile Completion</p>
                  <p className="text-2xl font-semibold text-gray-900">85%</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Legal Entities</p>
                  <p className="text-2xl font-semibold text-gray-900">{userData.legalEntities.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Recent Activities</p>
                  <p className="text-2xl font-semibold text-gray-900">{userData.recentActivity.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.profile?.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.profile?.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.profile?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title</label>
                  <p className="mt-1 text-sm text-gray-900">{userData.profile?.job_title}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'organization' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Organization Information</h3>
            </div>
            <div className="p-6">
              {userData.organization ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <p className="mt-1 text-sm text-gray-900">{userData.organization.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Industry</label>
                    <p className="mt-1 text-sm text-gray-900">{userData.organization.industry}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Size</label>
                    <p className="mt-1 text-sm text-gray-900">{userData.organization.size}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1 text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userData.organization.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {userData.organization.active ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No organization information available</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'legal-entities' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Legal Entities</h3>
              <button
                onClick={() => setShowLegalEntityModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Legal Entity
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userData.legalEntities.map((entity) => (
                <div key={entity.id} className="bg-white p-6 rounded-lg shadow">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{entity.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{entity.entity_type}</p>
                  <p className="text-sm text-gray-500 mb-4">{entity.jurisdiction}</p>
                  <div className="flex justify-between items-center">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entity.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entity.status}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedLegalEntity(entity);
                        setShowLegalEntityModal(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {userData.recentActivity.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-center space-x-4">
                      <div className={`flex-shrink-0 ${activity.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">{formatDateTime(activity.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700">
                    Enable
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Password</h4>
                    <p className="text-sm text-gray-500">Last changed {formatDate(userData.securitySettings?.lastPasswordChange)}</p>
                  </div>
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-700">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" checked={userData.preferences?.emailNotifications} className="mr-2" />
                    <span className="text-sm text-gray-700">Email notifications</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={userData.preferences?.pushNotifications} className="mr-2" />
                    <span className="text-sm text-gray-700">Push notifications</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal />
    </div>
  );
};

export default UserPortal;