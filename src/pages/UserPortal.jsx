// Updated UserPortal.jsx - Replace hardcoded data with API calls
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MockApi } from '../services/mockApi'; 
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
// ... other imports

const UserPortal = () => {
  // Remove hardcoded mockUserData, replace with state
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
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Load all user data from APIs
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        profileResponse,
        organizationResponse,
        legalEntitiesResponse,
        // activityResponse,
        // securityResponse
      ] = await Promise.all([
        completeMockApi.getCurrentUser(),
        completeMockApi.getOrganizations(user?.tenant_id),
        completeMockApi.getLegalEntities(user?.tenant_id),
        // completeMockApi.getUserActivity(), // Add these when available
        // completeMockApi.getSecuritySettings()
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
          // Mock data for now - replace with API when available
          {
            id: 1,
            type: 'profile_update',
            description: 'Updated profile information',
            timestamp: new Date().toISOString(),
            icon: User,
            color: 'text-blue-600'
          }
        ],
        notifications: [
          // Mock data for now
          {
            id: 1,
            type: 'system',
            title: 'System Maintenance',
            message: 'Scheduled maintenance on June 30th from 2:00 AM to 4:00 AM PST',
            priority: 'medium',
            read: false,
            timestamp: new Date().toISOString()
          }
        ],
        securitySettings: {
          // Mock data for now
          lastPasswordChange: new Date().toISOString(),
          twoFactorEnabled: false,
          sessionTimeout: 3600,
          loginHistory: []
        },
        preferences: {
          // Mock data for now
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
      const response = await completeMockApi.updateCurrentUser(updatedProfile);
      
      setUserData({
        ...userData,
        profile: response.data
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Handle legal entity creation
  const handleCreateLegalEntity = async (entityData) => {
    try {
      const response = await completeMockApi.createLegalEntity(user?.tenant_id, entityData);
      
      setUserData({
        ...userData,
        legalEntities: [...userData.legalEntities, response.data]
      });
      
      toast.success('Legal entity created successfully');
    } catch (error) {
      console.error('Error creating legal entity:', error);
      toast.error('Failed to create legal entity');
    }
  };

  // Handle legal entity update
  const handleUpdateLegalEntity = async (entityId, entityData) => {
    try {
      const response = await completeMockApi.updateLegalEntity(entityId, entityData);
      
      setUserData({
        ...userData,
        legalEntities: userData.legalEntities.map(entity =>
          entity.id === entityId ? response.data : entity
        )
      });
      
      toast.success('Legal entity updated successfully');
    } catch (error) {
      console.error('Error updating legal entity:', error);
      toast.error('Failed to update legal entity');
    }
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

  // Rest of your existing UserPortal component code...
  // Keep all the existing tab navigation and rendering logic
  // Just replace references to mockUserData with userData

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

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

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

  // Return your existing JSX with userData instead of mockUserData
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

      {/* Rest of your existing JSX... */}
      {/* Replace all mockUserData references with userData */}
      
    </div>
  );
};

export default UserPortal;