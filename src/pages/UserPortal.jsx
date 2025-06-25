import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Building, 
  FileText, 
  Settings,
  Activity,
  Clock,
  CheckCircle,
  Bell,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  Shield,
  Key,
  Edit,
  Save,
  X,
  Upload,
  Camera,
  AlertCircle,
  Info,
  Download,
  Eye,
  EyeOff,
  RefreshCw,
  HelpCircle,
  MessageSquare,
  BarChart3,
  Bookmark,
  Star,
  Zap,
  Users,
  Award,
  Target,
  TrendingUp,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

// Mock user data service
const mockUserData = {
  profile: {
    id: 'user-mike-dev-003',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.developer@techcorp.com',
    phone: '+1-555-0102',
    jobTitle: 'Senior Software Developer',
    department: 'Product Engineering',
    employeeId: 'EMP-2024-0103',
    startDate: '2024-02-01',
    manager: 'Sarah Johnson',
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    avatar: null,
    bio: 'Passionate software developer with expertise in React, Node.js, and cloud technologies.',
    skills: ['React', 'JavaScript', 'Python', 'AWS', 'Docker', 'PostgreSQL'],
    languages: ['English', 'Mandarin'],
    linkedIn: 'https://linkedin.com/in/mikechen',
    github: 'https://github.com/mikechen'
  },
  organization: {
    id: 'org-engineering-div-001',
    name: 'Engineering Division',
    description: 'Product development, software engineering, and technical innovation teams',
    industry: 'Technology',
    employees: 120,
    department: 'Product Engineering',
    team: 'Frontend Development Team',
    officeLocation: 'TechCorp Tower, Floor 8',
    contactEmail: 'engineering@techcorp.com',
    contactPhone: '+1-555-0123'
  },
  recentActivity: [
    {
      id: 1,
      type: 'profile_update',
      description: 'Updated profile information',
      timestamp: '2024-06-24T14:30:00.000Z',
      icon: User,
      color: 'text-blue-600'
    },
    {
      id: 2,
      type: 'password_change',
      description: 'Changed account password',
      timestamp: '2024-06-20T09:15:00.000Z',
      icon: Key,
      color: 'text-green-600'
    },
    {
      id: 3,
      type: 'document_access',
      description: 'Accessed company handbook',
      timestamp: '2024-06-18T16:45:00.000Z',
      icon: FileText,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'settings_change',
      description: 'Updated notification preferences',
      timestamp: '2024-06-15T11:20:00.000Z',
      icon: Settings,
      color: 'text-gray-600'
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
      timestamp: '2024-06-25T10:00:00.000Z'
    },
    {
      id: 2,
      type: 'security',
      title: 'Password Expiry Warning',
      message: 'Your password will expire in 15 days. Please update it soon.',
      priority: 'high',
      read: false,
      timestamp: '2024-06-24T09:00:00.000Z'
    },
    {
      id: 3,
      type: 'info',
      title: 'New Company Policy',
      message: 'Updated remote work policy is now available in the handbook',
      priority: 'low',
      read: true,
      timestamp: '2024-06-23T14:30:00.000Z'
    }
  ],
  quickActions: [
    {
      name: 'Update Profile',
      description: 'Edit your personal information',
      href: '/profile',
      icon: User,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'View Organization',
      description: 'See your organization details',
      href: '/my-organization',
      icon: Building,
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      name: 'Access Documents',
      description: 'View company documents and policies',
      href: '/documents',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      name: 'Account Settings',
      description: 'Manage your account preferences',
      href: '/settings',
      icon: Settings,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ],
  securitySettings: {
    lastPasswordChange: '2024-06-20T09:15:00.000Z',
    twoFactorEnabled: false,
    sessionTimeout: 3600,
    loginHistory: [
      {
        timestamp: '2024-06-24T07:45:00.000Z',
        location: 'San Francisco, CA',
        device: 'Chrome on MacOS',
        ip: '192.168.1.100'
      },
      {
        timestamp: '2024-06-23T08:30:00.000Z',
        location: 'San Francisco, CA',
        device: 'Chrome on MacOS',
        ip: '192.168.1.100'
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
};

// Profile Edit Modal Component
const ProfileEditModal = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(formData);
    setLoading(false);
    onClose();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Edit Profile</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Avatar Upload */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-semibold">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-md cursor-pointer hover:bg-gray-50">
                <Camera className="h-4 w-4 text-gray-600" />
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </label>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900">Profile Photo</h4>
              <p className="text-sm text-gray-500">Upload a professional photo</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email || ''}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-sm text-gray-500">Email cannot be changed. Contact administrator if needed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
              <input
                type="url"
                value={formData.linkedIn || ''}
                onChange={(e) => setFormData({...formData, linkedIn: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">GitHub</label>
              <input
                type="url"
                value={formData.github || ''}
                onChange={(e) => setFormData({...formData, github: e.target.value})}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://github.com/username"
              />
            </div>
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
              {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Password Change Modal
const PasswordChangeModal = ({ isOpen, onClose, onSave }) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwords.current) newErrors.current = 'Current password is required';
    if (!passwords.new) newErrors.new = 'New password is required';
    else if (passwords.new.length < 8) newErrors.new = 'Password must be at least 8 characters';
    if (passwords.new !== passwords.confirm) newErrors.confirm = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave();
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {['current', 'new', 'confirm'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 capitalize">
                {field === 'confirm' ? 'Confirm New Password' : `${field} Password`}
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPasswords[field] ? 'text' : 'password'}
                  value={passwords[field]}
                  onChange={(e) => setPasswords({...passwords, [field]: e.target.value})}
                  className={`block w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors[field] ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({...showPasswords, [field]: !showPasswords[field]})}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPasswords[field] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
            </div>
          ))}

          <div className="bg-blue-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-blue-900">Password Requirements:</h4>
            <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Include uppercase and lowercase letters</li>
              <li>Include at least one number</li>
              <li>Include at least one special character</li>
            </ul>
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
              {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Preferences Modal
const PreferencesModal = ({ isOpen, onClose, preferences, onSave }) => {
  const [formData, setFormData] = useState(preferences);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSave(formData);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              value={formData.theme || 'light'}
              onChange={(e) => setFormData({...formData, theme: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={formData.language || 'English'}
              onChange={(e) => setFormData({...formData, language: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <select
              value={formData.timezone || 'America/Los_Angeles'}
              onChange={(e) => setFormData({...formData, timezone: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="America/Los_Angeles">Pacific Time (PST)</option>
              <option value="America/Denver">Mountain Time (MST)</option>
              <option value="America/Chicago">Central Time (CST)</option>
              <option value="America/New_York">Eastern Time (EST)</option>
            </select>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-900">Notifications</h4>
            
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'pushNotifications', label: 'Push Notifications' },
              { key: 'smsNotifications', label: 'SMS Notifications' },
              { key: 'weeklyDigest', label: 'Weekly Digest' }
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData[item.key] || false}
                    onChange={(e) => setFormData({...formData, [item.key]: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
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
              {loading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main User Portal Component
const UserPortal = () => {
  const [userData, setUserData] = useState(mockUserData);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleProfileSave = (updatedProfile) => {
    setUserData({
      ...userData,
      profile: updatedProfile
    });
  };

  const handlePasswordSave = () => {
    // Update last password change date
    setUserData({
      ...userData,
      securitySettings: {
        ...userData.securitySettings,
        lastPasswordChange: new Date().toISOString()
      }
    });
  };

  const handlePreferencesSave = (updatedPreferences) => {
    setUserData({
      ...userData,
      preferences: updatedPreferences
    });
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

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow rounded-lg">
        <div className="px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-xl font-semibold">
                {getInitials(userData.profile.firstName, userData.profile.lastName)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {userData.profile.firstName}!
                </h1>
                <p className="text-indigo-100">
                  {userData.profile.jobTitle} • {userData.organization.name}
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
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'organization', label: 'My Organization', icon: Building },
              { id: 'activity', label: 'Activity', icon: Activity },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'preferences', label: 'Preferences', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Days with Company</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Math.floor((new Date() - new Date(userData.profile.startDate)) / (1000 * 60 * 60 * 24))}
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
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Team Size</dt>
                        <dd className="text-lg font-medium text-gray-900">{userData.organization.employees}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Skills</dt>
                        <dd className="text-lg font-medium text-gray-900">{userData.profile.skills.length}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Bell className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Notifications</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {userData.notifications.filter(n => !n.read).length}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-4">
                    {userData.quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => setActiveTab(action.href.replace('/', '').replace('my-', ''))}
                          className={`
                            relative rounded-lg p-4 text-white ${action.color}
                            transition duration-150 ease-in-out transform hover:scale-105
                          `}
                        >
                          <div className="flex items-center">
                            <Icon className="h-6 w-6 mr-3" />
                            <div className="text-left">
                              <h3 className="text-sm font-medium">{action.name}</h3>
                              <p className="text-xs text-white/80">{action.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="flow-root">
                    <ul className="-mb-8">
                      {userData.recentActivity.map((activity, activityIdx) => {
                        const Icon = activity.icon;
                        return (
                          <li key={activity.id}>
                            <div className="relative pb-8">
                              {activityIdx !== userData.recentActivity.length - 1 && (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              )}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className={`
                                    h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                                    ${activity.color.includes('blue') ? 'bg-blue-100' :
                                      activity.color.includes('green') ? 'bg-green-100' :
                                      activity.color.includes('purple') ? 'bg-purple-100' :
                                      'bg-gray-100'}
                                  `}>
                                    <Icon className={`h-4 w-4 ${activity.color}`} />
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                  <div>
                                    <p className="text-sm text-gray-900">{activity.description}</p>
                                  </div>
                                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                    <time>{formatDateTime(activity.timestamp)}</time>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Notifications</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userData.notifications.slice(0, 3).map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        notification.priority === 'high' ? 'bg-red-50 border-red-400' :
                        notification.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                        'bg-blue-50 border-blue-400'
                      } ${!notification.read ? 'ring-2 ring-indigo-200' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDateTime(notification.timestamp)}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="ml-4">
                            <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">My Profile</h2>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-semibold">
                        {getInitials(userData.profile.firstName, userData.profile.lastName)}
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {userData.profile.firstName} {userData.profile.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">{userData.profile.jobTitle}</p>
                        <p className="text-sm text-gray-500">Employee ID: {userData.profile.employeeId}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{userData.profile.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{userData.profile.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                        <span>{userData.profile.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                        <span>Started {formatDate(userData.profile.startDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {userData.profile.bio && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700">{userData.profile.bio}</p>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {userData.profile.languages.map((language, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                {(userData.profile.linkedIn || userData.profile.github) && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Links</h3>
                    <div className="space-y-2">
                      {userData.profile.linkedIn && (
                        <a
                          href={userData.profile.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          LinkedIn Profile
                        </a>
                      )}
                      {userData.profile.github && (
                        <a
                          href={userData.profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          GitHub Profile
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Organization Tab */}
        {activeTab === 'organization' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">My Organization</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Organization Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Organization Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{userData.organization.name}</p>
                          <p className="text-sm text-gray-500">{userData.organization.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{userData.organization.employees} Employees</p>
                          <p className="text-sm text-gray-500">Organization size</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{userData.organization.officeLocation}</p>
                          <p className="text-sm text-gray-500">Office location</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">My Role</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium text-gray-900">{userData.profile.jobTitle}</p>
                        <p className="text-sm text-gray-500">Position</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userData.organization.department}</p>
                        <p className="text-sm text-gray-500">Department</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userData.organization.team}</p>
                        <p className="text-sm text-gray-500">Team</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{userData.profile.manager}</p>
                        <p className="text-sm text-gray-500">Manager</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organization Description */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">About Our Organization</h3>
                  <p className="text-gray-700">{userData.organization.description}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{userData.organization.contactEmail}</p>
                        <p className="text-sm text-gray-500">General email</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 mr-3 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{userData.organization.contactPhone}</p>
                        <p className="text-sm text-gray-500">Main phone</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Activity History</h2>
            </div>
            <div className="p-6">
              <div className="flow-root">
                <ul className="-mb-8">
                  {userData.recentActivity.map((activity, activityIdx) => {
                    const Icon = activity.icon;
                    return (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== userData.recentActivity.length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`
                                h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                                ${activity.color.includes('blue') ? 'bg-blue-100' :
                                  activity.color.includes('green') ? 'bg-green-100' :
                                  activity.color.includes('purple') ? 'bg-purple-100' :
                                  'bg-gray-100'}
                              `}>
                                <Icon className={`h-4 w-4 ${activity.color}`} />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div className="flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">{activity.description}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Activity ID: {activity.id}
                                  </p>
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  <time>{formatDateTime(activity.timestamp)}</time>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Security Overview */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Security & Privacy</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Password Security */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Password Security</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Key className="h-5 w-5 mr-3 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Password</p>
                            <p className="text-sm text-gray-500">
                              Last changed {formatDate(userData.securitySettings.lastPasswordChange)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordModal(true)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          Change
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <Shield className="h-5 w-5 mr-3 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">
                              {userData.securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                            </p>
                          </div>
                        </div>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                          {userData.securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Session Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Session Security</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Session Timeout</p>
                            <p className="text-sm text-gray-500">
                              {userData.securitySettings.sessionTimeout / 60} minutes
                            </p>
                          </div>
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Current Session</p>
                            <p className="text-sm text-gray-500">Active since login</p>
                          </div>
                          <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                            End Session
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Login History */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Login History</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userData.securitySettings.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{login.device}</p>
                          <p className="text-sm text-gray-500">{login.location} • {login.ip}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{formatDateTime(login.timestamp)}</p>
                        <p className="text-xs text-gray-500">Successful login</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
                <button
                  onClick={() => setShowPreferencesModal(true)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Preferences
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* Display Preferences */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Display & Language</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Theme</p>
                      <p className="text-sm text-gray-500 capitalize">{userData.preferences.theme}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Language</p>
                      <p className="text-sm text-gray-500">{userData.preferences.language}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">Timezone</p>
                      <p className="text-sm text-gray-500">{userData.preferences.timezone}</p>
                    </div>
                  </div>
                </div>

                {/* Notification Preferences */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications' },
                      { key: 'pushNotifications', label: 'Push Notifications' },
                      { key: 'smsNotifications', label: 'SMS Notifications' },
                      { key: 'weeklyDigest', label: 'Weekly Digest' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{item.label}</span>
                        <div className="flex items-center">
                          {userData.preferences[item.key] ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <X className="h-5 w-5 text-gray-400" />
                          )}
                          <span className="ml-2 text-sm text-gray-500">
                            {userData.preferences[item.key] ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Privacy Settings */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy & Data</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Profile Visibility</p>
                        <p className="text-sm text-gray-500">Who can see your profile information</p>
                      </div>
                      <span className="text-sm text-gray-600">Organization Only</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Activity Tracking</p>
                        <p className="text-sm text-gray-500">Allow system to track your activity for analytics</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">Data Export</p>
                        <p className="text-sm text-gray-500">Download your personal data</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Help & Support */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Help & Support</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left">
                      <HelpCircle className="h-6 w-6 text-gray-400 mb-2" />
                      <h4 className="font-medium text-gray-900">Help Center</h4>
                      <p className="text-sm text-gray-500">Browse help articles and tutorials</p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left">
                      <MessageSquare className="h-6 w-6 text-gray-400 mb-2" />
                      <h4 className="font-medium text-gray-900">Contact Support</h4>
                      <p className="text-sm text-gray-500">Get help from our support team</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ProfileEditModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={userData.profile}
        onSave={handleProfileSave}
      />

      <PasswordChangeModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSave={handlePasswordSave}
      />

      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        preferences={userData.preferences}
        onSave={handlePreferencesSave}
      />

      {/* Additional Features Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Documents & Resources */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Links</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Employee Handbook</p>
                    <p className="text-sm text-gray-500">Company policies and procedures</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Company Calendar</p>
                    <p className="text-sm text-gray-500">Events and important dates</p>
                  </div>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Team Directory</p>
                    <p className="text-sm text-gray-500">Find and connect with colleagues</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">System Status</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-900">User Portal</span>
                </div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-900">Authentication</span>
                </div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-900">File Storage</span>
                </div>
                <span className="text-sm text-yellow-600">Maintenance</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-900">Email Service</span>
                </div>
                <span className="text-sm text-green-600">Operational</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Status Page
              </button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">My Usage</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Storage Used</span>
                  <span className="text-sm text-gray-500">2.4 GB / 5 GB</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">API Calls</span>
                  <span className="text-sm text-gray-500">847 / 1000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '84.7%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">Session Time</span>
                  <span className="text-sm text-gray-500">2h 34m today</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
                <BarChart3 className="h-4 w-4 mr-1" />
                View Detailed Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                Last updated: {formatDateTime(new Date().toISOString())}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Shield className="h-4 w-4 mr-2" />
                Secure connection
              </div>
            </div>
            <div className="text-sm text-gray-500">
              User Portal v2.1.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPortal;