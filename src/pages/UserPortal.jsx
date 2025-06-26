// Fixed UserPortal.jsx - Rules of Hooks violation fixed
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

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

// ErrorBoundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    // Log error if needed
    // console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <div className="bg-red-100 text-red-700 px-6 py-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
            <p className="mb-2">An unexpected error occurred. Please try refreshing the page.</p>
            <pre className="text-xs text-red-500">{this.state.error?.toString()}</pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
    if (path.includes('/roles-privileges')) return 'roles-privileges';
    if (path.includes('/sessions')) return 'sessions';
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
  const [userRoles, setUserRoles] = useState([]);
  const [userPrivileges, setUserPrivileges] = useState([]);
  const [roleRequestLoading, setRoleRequestLoading] = useState(false);
  const [roleRequestMessage, setRoleRequestMessage] = useState('');
  const [sessions, setSessions] = useState([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'English',
    timezone: 'America/Los_Angeles',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true
  });
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [userStatus, setUserStatus] = useState('ACTIVE');
  const [statusLoading, setStatusLoading] = useState(false);

  // Load all user data from APIs
  useEffect(() => {
    loadUserData();
  }, []);

  // Update active tab when location changes
  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  // Load roles and privileges for the user
  useEffect(() => {
    const fetchRolesAndPrivileges = async () => {
      if (!user) return;
      try {
        const [rolesRes, privsRes] = await Promise.all([
          mockApi.getUserRoles(user.id),
          mockApi.getUserPrivileges(user.id)
        ]);
        setUserRoles(rolesRes.data || []);
        setUserPrivileges(privsRes.data || []);
      } catch (e) {
        setUserRoles([]);
        setUserPrivileges([]);
      }
    };
    fetchRolesAndPrivileges();
  }, [user]);

  // Load sessions for the user
  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) return;
      setSessionLoading(true);
      setSessionError('');
      try {
        const res = await mockApi.getUserSessions(user.id);
        setSessions(res.data || []);
      } catch (e) {
        setSessionError('Failed to load sessions');
        setSessions([]);
      } finally {
        setSessionLoading(false);
      }
    };
    fetchSessions();
  }, [user]);

  // Load 2FA status from userData
  useEffect(() => {
    if (userData.securitySettings) {
      setTwoFactorEnabled(userData.securitySettings.twoFactorEnabled);
    }
  }, [userData.securitySettings]);

  // Load preferences from userData
  useEffect(() => {
    if (userData.preferences) {
      setPreferences(userData.preferences);
    }
  }, [userData.preferences]);

  // Load user status from userData
  useEffect(() => {
    if (userData.profile && userData.profile.status) {
      setUserStatus(userData.profile.status);
    }
  }, [userData.profile]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Load all data in parallel
      const [
        profileResponse,
        organizationResponse,
        legalEntitiesResponse,
        preferencesResponse,
        securitySettingsResponse
      ] = await Promise.all([
        mockApi.getCurrentUser(),
        mockApi.getOrganizations(user?.tenant_id),
        mockApi.getLegalEntities(user?.tenant_id),
        mockApi.getPreferences(user?.id),
        mockApi.getSecuritySettings(user?.id)
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
        securitySettings: securitySettingsResponse.data,
        preferences: preferencesResponse.data
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
      preferences: '/my-settings',
      'roles-privileges': '/roles-privileges',
      sessions: '/sessions'
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
    { id: 'roles-privileges', name: 'Roles & Privileges', icon: Shield },
    { id: 'sessions', name: 'Sessions', icon: Clock },
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

  // Handle role request
  const handleRoleRequest = async (roleId, action) => {
    setRoleRequestLoading(true);
    setRoleRequestMessage('');
    try {
      // Simulate request to assign or remove role
      await mockApi.requestRoleChange(user.id, roleId, action);
      setRoleRequestMessage('Request submitted successfully!');
      toast.success('Role change request submitted');
      // Optionally refresh roles
      const rolesRes = await mockApi.getUserRoles(user.id);
      setUserRoles(rolesRes.data || []);
    } catch (e) {
      setRoleRequestMessage('Failed to submit request.');
      toast.error('Failed to submit role change request');
    } finally {
      setRoleRequestLoading(false);
    }
  };

  // Handle terminate session
  const handleTerminateSession = async (sessionId) => {
    setSessionLoading(true);
    try {
      await mockApi.terminateSession(user.id, sessionId);
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Session terminated');
    } catch (e) {
      toast.error('Failed to terminate session');
    } finally {
      setSessionLoading(false);
    }
  };

  // Handle toggle 2FA
  const handleToggle2FA = async () => {
    setTwoFactorLoading(true);
    try {
      const res = await mockApi.toggleTwoFactor(user.id, !twoFactorEnabled);
      setTwoFactorEnabled(res.data.enabled);
      toast.success(`Two-Factor Authentication ${res.data.enabled ? 'enabled' : 'disabled'}`);
    } catch (e) {
      toast.error('Failed to update 2FA setting');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (data, reset) => {
    setPasswordChangeLoading(true);
    try {
      await mockApi.changePassword(user.id, data.currentPassword, data.newPassword);
      toast.success('Password changed successfully');
      reset();
    } catch (e) {
      toast.error('Failed to change password');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handlePreferenceChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSavePreferences = async () => {
    setPreferencesLoading(true);
    try {
      await mockApi.savePreferences(user.id, preferences);
      toast.success('Preferences saved');
    } catch (e) {
      toast.error('Failed to save preferences');
    } finally {
      setPreferencesLoading(false);
    }
  };

  const handleDeactivate = async () => {
    setStatusLoading(true);
    try {
      await mockApi.deactivateUser(user.id);
      setUserStatus('INACTIVE');
      toast.success('Account deactivated.');
    } catch (e) {
      toast.error('Failed to deactivate account.');
    } finally {
      setStatusLoading(false);
    }
  };

  const breadcrumbMap = {
    overview: 'Dashboard',
    profile: 'My Profile',
    organization: 'My Organization',
    'legal-entities': 'Legal Entities',
    'roles-privileges': 'Roles & Privileges',
    sessions: 'Sessions',
    activity: 'Activity',
    security: 'Security',
    preferences: 'Settings',
  };

  // LegalEntityModal component
  const LegalEntityModal = () => {
    const isEdit = !!selectedLegalEntity;
    const [formData, setFormData] = useState({
      name: selectedLegalEntity?.name || '',
      entity_type: selectedLegalEntity?.entity_type || '',
      jurisdiction: selectedLegalEntity?.jurisdiction || ''
    });
    useEffect(() => {
      if (selectedLegalEntity) {
        setFormData({
          name: selectedLegalEntity.name || '',
          entity_type: selectedLegalEntity.entity_type || '',
          jurisdiction: selectedLegalEntity.jurisdiction || ''
        });
      } else {
        setFormData({ name: '', entity_type: '', jurisdiction: '' });
      }
    }, [selectedLegalEntity]);
    const handleSubmit = (e) => {
      e.preventDefault();
      if (isEdit) {
        handleUpdateLegalEntity(selectedLegalEntity.id, formData);
      } else {
        handleCreateLegalEntity(formData);
      }
    };
    if (!showLegalEntityModal) return null;
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{isEdit ? 'Edit Legal Entity' : 'Add Legal Entity'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entity Type</label>
              <input
                type="text"
                value={formData.entity_type}
                onChange={e => setFormData({ ...formData, entity_type: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Jurisdiction</label>
              <input
                type="text"
                value={formData.jurisdiction}
                onChange={e => setFormData({ ...formData, jurisdiction: e.target.value })}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => { setShowLegalEntityModal(false); setSelectedLegalEntity(null); }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                {isEdit ? 'Save Changes' : 'Add Entity'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // PasswordChangeForm component (inline for simplicity)
  const PasswordChangeForm = ({ onSubmit, loading }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    return (
      <form onSubmit={handleSubmit((data) => onSubmit(data, reset))} className="space-y-3 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input type="password" {...register('currentPassword', { required: 'Current password is required' })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          {errors.currentPassword && <span className="text-xs text-red-600">{errors.currentPassword.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">New Password</label>
          <input type="password" {...register('newPassword', { required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          {errors.newPassword && <span className="text-xs text-red-600">{errors.newPassword.message}</span>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input type="password" {...register('confirmPassword', { required: 'Please confirm your new password', validate: (value, { newPassword }) => value === newPassword || 'Passwords do not match' })} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          {errors.confirmPassword && <span className="text-xs text-red-600">{errors.confirmPassword.message}</span>}
        </div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">Change Password</button>
      </form>
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
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-indigo-600 hover:underline font-medium"
              >
                Dashboard
              </button>
            </li>
            {activeTab !== 'overview' && (
              <li className="flex items-center">
                <span className="mx-2">/</span>
                <span className="text-gray-700 font-semibold">{breadcrumbMap[activeTab] || ''}</span>
              </li>
            )}
          </ol>
        </nav>
        {/* Welcome Header - Updated to use API data */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow rounded-lg">
          <div className="px-6 py-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-xl font-semibold">
                  {getInitials(userData.profile?.first_name, userData.profile?.last_name)}
                </div>
                {/* Change profile circle color for better visibility */}
                <style>{`
                  .profile-avatar-indigo {
                    background-color: #4f46e5 !important; /* indigo-600 */
                    color: #fff !important;
                  }
                `}</style>
                <div className="h-16 w-16 rounded-full profile-avatar-indigo flex items-center justify-center text-white text-xl font-semibold absolute -z-10" style={{left: 0, top: 0, display: 'none'}}></div>
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
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md transition-colors flex items-center hover:bg-indigo-700"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${userStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{userStatus}</span>
                  </div>
                </div>
                {userStatus === 'ACTIVE' && (
                  <button
                    onClick={handleDeactivate}
                    disabled={statusLoading}
                    className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {statusLoading ? 'Deactivating...' : 'Deactivate Account'}
                  </button>
                )}
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
                <div className="p-6 space-y-6">
                  {!userData.securitySettings ? (
                    <div className="text-red-600">Unable to load security settings. Please try again later.</div>
                  ) : (
                    <>
                      {/* 2FA Toggle */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          onClick={handleToggle2FA}
                          disabled={twoFactorLoading}
                          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${twoFactorEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} disabled:opacity-50`}
                        >
                          {twoFactorEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                      {/* Password Change Form */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Change Password</h4>
                        <PasswordChangeForm onSubmit={handlePasswordChange} loading={passwordChangeLoading} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Password</h4>
                          <p className="text-sm text-gray-500">Last changed {formatDate(userData.securitySettings?.lastPasswordChange)}</p>
                        </div>
                      </div>
                    </>
                  )}
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
                      <input type="checkbox" name="emailNotifications" checked={preferences.emailNotifications} onChange={handlePreferenceChange} className="mr-2" />
                      <span className="text-sm text-gray-700">Email notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="pushNotifications" checked={preferences.pushNotifications} onChange={handlePreferenceChange} className="mr-2" />
                      <span className="text-sm text-gray-700">Push notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="smsNotifications" checked={preferences.smsNotifications} onChange={handlePreferenceChange} className="mr-2" />
                      <span className="text-sm text-gray-700">SMS notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="weeklyDigest" checked={preferences.weeklyDigest} onChange={handlePreferenceChange} className="mr-2" />
                      <span className="text-sm text-gray-700">Weekly digest</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">UI Preferences</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Theme</label>
                      <select name="theme" value={preferences.theme} onChange={handlePreferenceChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Language</label>
                      <select name="language" value={preferences.language} onChange={handlePreferenceChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Timezone</label>
                      <select name="timezone" value={preferences.timezone} onChange={handlePreferenceChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                        <option value="America/Los_Angeles">America/Los_Angeles</option>
                        <option value="America/New_York">America/New_York</option>
                        <option value="Europe/London">Europe/London</option>
                        <option value="Asia/Kolkata">Asia/Kolkata</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={handleSavePreferences} disabled={preferencesLoading} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50">{preferencesLoading ? 'Saving...' : 'Save Preferences'}</button>
              </div>
            </div>
          )}

          {activeTab === 'roles-privileges' && (
            <div className="bg-white shadow rounded-lg p-6 space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">My Roles</h3>
                <ul className="space-y-2">
                  {userRoles.length === 0 && <li className="text-gray-500">No roles assigned.</li>}
                  {userRoles.map(role => (
                    <li key={role.id} className="flex items-center justify-between border-b pb-2">
                      <span className="font-medium text-gray-800">{role.name}</span>
                      <button
                        disabled={roleRequestLoading}
                        onClick={() => handleRoleRequest(role.id, 'remove')}
                        className="ml-2 px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        Request Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-1">Request New Role</h4>
                  <RoleRequestForm onRequest={handleRoleRequest} loading={roleRequestLoading} />
                  {roleRequestMessage && <p className="text-sm text-green-600 mt-2">{roleRequestMessage}</p>}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">My Privileges</h3>
                {userPrivileges.length === 0 && <p className="text-gray-500">No privileges assigned.</p>}
                {Object.entries(
                  userPrivileges.reduce((acc, priv) => {
                    const cat = priv.category || 'Uncategorized';
                    acc[cat] = acc[cat] || [];
                    acc[cat].push(priv);
                    return acc;
                  }, {})
                ).map(([category, privs]) => (
                  <div key={category} className="mb-4">
                    <h5 className="font-semibold text-indigo-700 mb-1">{category}</h5>
                    <ul className="list-disc ml-6">
                      {privs.map(priv => (
                        <li key={priv.id} className="text-gray-800">{priv.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h3>
              {sessionLoading && <p className="text-gray-500">Loading sessions...</p>}
              {sessionError && <p className="text-red-500">{sessionError}</p>}
              <ul className="divide-y divide-gray-200">
                {sessions.map(session => (
                  <li key={session.id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-800">{session.device} <span className="text-xs text-gray-500">({session.location})</span></div>
                      <div className="text-xs text-gray-500">Last active: {formatDateTime(session.lastActive)}</div>
                      {session.current && <span className="inline-block text-xs text-green-600 font-semibold">Current Session</span>}
                    </div>
                    {!session.current && (
                      <button
                        onClick={() => handleTerminateSession(session.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
                        disabled={sessionLoading}
                      >
                        Terminate
                      </button>
                    )}
                  </li>
                ))}
                {sessions.length === 0 && !sessionLoading && <li className="text-gray-500">No active sessions found.</li>}
              </ul>
            </div>
          )}
        </div>

        {/* Profile Edit Modal */}
        <ProfileEditModal />
        {/* Legal Entity Modal */}
        <LegalEntityModal />
      </div>
    </ErrorBoundary>
  );
};

// RoleRequestForm component (inline for simplicity)
const RoleRequestForm = ({ onRequest, loading }) => {
  const [roleId, setRoleId] = useState('');
  const [availableRoles, setAvailableRoles] = useState([]);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await mockApi.getAllRoles();
        setAvailableRoles(res.data || []);
      } catch (e) {
        setAvailableRoles([]);
      }
    };
    fetchRoles();
  }, []);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (roleId) onRequest(roleId, 'assign');
      }}
      className="flex items-center space-x-2"
    >
      <select
        value={roleId}
        onChange={e => setRoleId(e.target.value)}
        className="border rounded px-2 py-1"
        required
      >
        <option value="">Select role</option>
        {availableRoles.map(role => (
          <option key={role.id} value={role.id}>{role.name}</option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading || !roleId}
        className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        Request Assign
      </button>
    </form>
  );
};

export default UserPortal;