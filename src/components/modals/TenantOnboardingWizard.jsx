import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Building, 
  Users, 
  Shield, 
  Settings,
  Plus,
  Trash2,
  AlertCircle,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

// Auto-save hook
const useAutoSave = (data, saveFunction, delay = 3000) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (data && Object.keys(data).length > 0) {
        setSaving(true);
        try {
          await saveFunction(data);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
        } finally {
          setSaving(false);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [data, saveFunction, delay]);

  return { lastSaved, saving };
};

const TenantOnboardingWizard = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    tenant: {
      name: '',
      industry: '',
      description: '',
      email: '',
      phone: '',
      website: ''
    },
    organizations: [
      {
        id: Date.now(),
        name: '',
        industry: '',
        description: '',
        email: '',
        parent_id: null
      }
    ],
    users: [
      {
        id: Date.now(),
        first_name: '',
        last_name: '',
        email: '',
        job_title: '',
        organization_id: null,
        is_admin: true,
        password: '',
        confirm_password: ''
      }
    ],
    roles: [
      { name: 'Administrator', description: 'Full system access', selected: true },
      { name: 'Manager', description: 'Department management access', selected: true },
      { name: 'User', description: 'Standard user access', selected: true }
    ],
    settings: {
      theme: 'light',
      language: 'English',
      timezone: 'UTC',
      notifications: true,
      security: {
        password_policy: {
          min_length: 8,
          require_uppercase: true,
          require_lowercase: true,
          require_numbers: true,
          require_symbols: false
        },
        session_timeout: 3600,
        two_factor_required: false
      }
    }
  });

  const [errors, setErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [showPasswords, setShowPasswords] = useState({});

  // Auto-save functionality
  const saveProgress = async (data) => {
    // Simulate API call to save progress
    localStorage.setItem('tenant-onboarding-progress', JSON.stringify(data));
  };

  const { lastSaved, saving } = useAutoSave(formData, saveProgress);

  // Load saved progress on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('tenant-onboarding-progress');
    if (savedProgress) {
      try {
        setFormData(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, []);

  const steps = [
    {
      id: 'tenant',
      title: 'Tenant Information',
      description: 'Basic tenant details and configuration',
      icon: Building,
      component: TenantInfoStep
    },
    {
      id: 'organizations',
      title: 'Organizations',
      description: 'Set up organizational structure',
      icon: Building,
      component: OrganizationsStep
    },
    {
      id: 'users',
      title: 'Initial Users',
      description: 'Add initial users and administrators',
      icon: Users,
      component: UsersStep
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      description: 'Configure roles and access controls',
      icon: Shield,
      component: RolesStep
    },
    {
      id: 'settings',
      title: 'Tenant Settings',
      description: 'Customize tenant preferences',
      icon: Settings,
      component: SettingsStep
    }
  ];

  const validateStep = (stepId) => {
    const stepErrors = {};
    
    switch (stepId) {
      case 'tenant':
        if (!formData.tenant.name) stepErrors.name = 'Tenant name is required';
        if (!formData.tenant.industry) stepErrors.industry = 'Industry is required';
        if (!formData.tenant.email) stepErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.tenant.email)) {
          stepErrors.email = 'Please enter a valid email address';
        }
        break;
      case 'organizations':
        formData.organizations.forEach((org, index) => {
          if (!org.name) stepErrors[`org_${index}_name`] = 'Organization name is required';
          if (!org.email) stepErrors[`org_${index}_email`] = 'Organization email is required';
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.email)) {
            stepErrors[`org_${index}_email`] = 'Please enter a valid email address';
          }
        });
        break;
      case 'users':
        formData.users.forEach((user, index) => {
          if (!user.first_name) stepErrors[`user_${index}_first_name`] = 'First name is required';
          if (!user.last_name) stepErrors[`user_${index}_last_name`] = 'Last name is required';
          if (!user.email) stepErrors[`user_${index}_email`] = 'Email is required';
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            stepErrors[`user_${index}_email`] = 'Please enter a valid email address';
          }
          if (!user.password) stepErrors[`user_${index}_password`] = 'Password is required';
          else if (user.password.length < 8) {
            stepErrors[`user_${index}_password`] = 'Password must be at least 8 characters';
          }
          if (user.password !== user.confirm_password) {
            stepErrors[`user_${index}_confirm_password`] = 'Passwords do not match';
          }
        });
        break;
      case 'roles':
        const selectedRoles = formData.roles.filter(role => role.selected);
        if (selectedRoles.length === 0) {
          stepErrors.roles = 'At least one role must be selected';
        }
        break;
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    const currentStepId = steps[currentStep].id;
    if (validateStep(currentStepId)) {
      setCompletedSteps(prev => new Set([...prev, currentStepId]));
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (validateStep(steps[currentStep].id)) {
      try {
        setCompletedSteps(prev => new Set([...prev, steps[currentStep].id]));
        
        // Prepare final data for submission
        const finalData = {
          ...formData,
          // Remove passwords from organizations and clean up data
          organizations: formData.organizations.map(org => ({
            ...org,
            organization_id: org.id
          })),
          users: formData.users.map(user => ({
            ...user,
            user_id: user.id,
            // Password will be handled securely on backend
            password: user.password,
            confirm_password: undefined
          }))
        };
        
        await onComplete(finalData);
        localStorage.removeItem('tenant-onboarding-progress');
        onClose();
      } catch (error) {
        console.error('Failed to complete onboarding:', error);
        setErrors({ submit: 'Failed to complete setup. Please try again.' });
      }
    }
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Tenant Setup Wizard</h2>
              <p className="text-sm text-gray-500">Complete setup for your new tenant ({currentStep + 1} of {steps.length})</p>
            </div>
            <div className="flex items-center space-x-2">
              {saving && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500 mr-2"></div>
                  Saving...
                </div>
              )}
              {lastSaved && !saving && (
                <div className="flex items-center text-sm text-green-600">
                  <Save className="h-4 w-4 mr-1" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = index === currentStep;
              const isAccessible = index <= currentStep || isCompleted;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-colors
                      ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                        isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                        isAccessible ? 'border-gray-300 text-gray-500 hover:border-gray-400' :
                        'border-gray-200 text-gray-300'}
                    `}
                    onClick={() => isAccessible && setCurrentStep(index)}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p className={`text-sm font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-gray-300 mx-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-6">
          <CurrentStepComponent
            data={formData}
            errors={errors}
            updateData={updateFormData}
            showPasswords={showPasswords}
            togglePasswordVisibility={togglePasswordVisibility}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            
            {currentStep === steps.length - 1 ? (
              <button
                onClick={handleComplete}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
              >
                Complete Setup
                <CheckCircle className="h-4 w-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Global Error Display */}
        {errors.submit && (
          <div className="px-6 py-2 bg-red-50 border-t border-red-200">
            <div className="flex items-center text-red-800">
              <AlertCircle className="h-4 w-4 mr-2" />
              {errors.submit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Step Components
const TenantInfoStep = ({ data, errors, updateData }) => {
  const handleChange = (field, value) => {
    updateData('tenant', {
      ...data.tenant,
      [field]: value
    });
  };

  const industries = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Government', 'Other'];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tenant Name *</label>
            <input
              type="text"
              value={data.tenant.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="Enter tenant name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Industry *</label>
            <select
              value={data.tenant.industry}
              onChange={(e) => handleChange('industry', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors.industry ? 'border-red-300' : 'border-gray-300'}`}
            >
              <option value="">Select industry</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.industry && <p className="mt-1 text-sm text-red-600">{errors.industry}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              value={data.tenant.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="contact@company.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={data.tenant.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              value={data.tenant.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://company.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={data.tenant.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of your organization"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const OrganizationsStep = ({ data, errors, updateData }) => {
  const addOrganization = () => {
    const newOrg = {
      id: Date.now(),
      name: '',
      industry: '',
      description: '',
      email: '',
      parent_id: null
    };
    updateData('organizations', [...data.organizations, newOrg]);
  };

  const removeOrganization = (id) => {
    updateData('organizations', data.organizations.filter(org => org.id !== id));
  };

  const updateOrganization = (id, field, value) => {
    updateData('organizations', data.organizations.map(org =>
      org.id === id ? { ...org, [field]: value } : org
    ));
  };

  const industries = ['Technology', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Government', 'Other'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Organizations</h3>
        <button
          onClick={addOrganization}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      <div className="space-y-4">
        {data.organizations.map((org, index) => (
          <div key={org.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">Organization {index + 1}</h4>
              {data.organizations.length > 1 && (
                <button
                  onClick={() => removeOrganization(org.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  value={org.name}
                  onChange={(e) => updateOrganization(org.id, 'name', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`org_${index}_name`] ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Organization name"
                />
                {errors[`org_${index}_name`] && <p className="mt-1 text-sm text-red-600">{errors[`org_${index}_name`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Industry</label>
                <select
                  value={org.industry}
                  onChange={(e) => updateOrganization(org.id, 'industry', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  value={org.email}
                  onChange={(e) => updateOrganization(org.id, 'email', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`org_${index}_email`] ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="org@company.com"
                />
                {errors[`org_${index}_email`] && <p className="mt-1 text-sm text-red-600">{errors[`org_${index}_email`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Parent Organization</label>
                <select
                  value={org.parent_id || ''}
                  onChange={(e) => updateOrganization(org.id, 'parent_id', e.target.value || null)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No parent (Top-level)</option>
                  {data.organizations.filter(o => o.id !== org.id).map(parentOrg => (
                    <option key={parentOrg.id} value={parentOrg.id}>{parentOrg.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={org.description}
                  onChange={(e) => updateOrganization(org.id, 'description', e.target.value)}
                  rows={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Organization description"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const UsersStep = ({ data, errors, updateData, showPasswords, togglePasswordVisibility }) => {
  const addUser = () => {
    const newUser = {
      id: Date.now(),
      first_name: '',
      last_name: '',
      email: '',
      job_title: '',
      organization_id: null,
      is_admin: false,
      password: '',
      confirm_password: ''
    };
    updateData('users', [...data.users, newUser]);
  };

  const removeUser = (id) => {
    updateData('users', data.users.filter(user => user.id !== id));
  };

  const updateUser = (id, field, value) => {
    updateData('users', data.users.map(user =>
      user.id === id ? { ...user, [field]: value } : user
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Initial Users</h3>
        <button
          onClick={addUser}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="space-y-4">
        {data.users.map((user, index) => (
          <div key={user.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-gray-900">User {index + 1}</h4>
              <div className="flex items-center space-x-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={user.is_admin}
                    onChange={(e) => updateUser(user.id, 'is_admin', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Administrator</span>
                </label>
                {data.users.length > 1 && (
                  <button
                    onClick={() => removeUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  value={user.first_name}
                  onChange={(e) => updateUser(user.id, 'first_name', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`user_${index}_first_name`] ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="First name"
                />
                {errors[`user_${index}_first_name`] && <p className="mt-1 text-sm text-red-600">{errors[`user_${index}_first_name`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  value={user.last_name}
                  onChange={(e) => updateUser(user.id, 'last_name', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`user_${index}_last_name`] ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Last name"
                />
                {errors[`user_${index}_last_name`] && <p className="mt-1 text-sm text-red-600">{errors[`user_${index}_last_name`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => updateUser(user.id, 'email', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`user_${index}_email`] ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="user@company.com"
                />
                {errors[`user_${index}_email`] && <p className="mt-1 text-sm text-red-600">{errors[`user_${index}_email`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <input
                  type="text"
                  value={user.job_title}
                  onChange={(e) => updateUser(user.id, 'job_title', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password *</label>
                <div className="relative">
                  <input
                    type={showPasswords[user.id] ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => updateUser(user.id, 'password', e.target.value)}
                    className={`mt-1 block w-full border rounded-md px-3 py-2 pr-10 focus:ring-blue-500 focus:border-blue-500 ${errors[`user_${index}_password`] ? 'border-red-300' : 'border-gray-300'}`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility(user.id)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswords[user.id] ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors[`user_${index}_password`] && <p className="mt-1 text-sm text-red-600">{errors[`user_${index}_password`]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                <input
                  type="password"
                  value={user.confirm_password}
                  onChange={(e) => updateUser(user.id, 'confirm_password', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 ${errors[`user_${index}_confirm_password`] ? 'border-red-300' : 'border-gray-300'}`}
                  placeholder="Confirm password"
                />
                {errors[`user_${index}_confirm_password`] && <p className="mt-1 text-sm text-red-600">{errors[`user_${index}_confirm_password`]}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Organization</label>
                <select
                  value={user.organization_id || ''}
                  onChange={(e) => updateUser(user.id, 'organization_id', e.target.value || null)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select organization</option>
                  {data.organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RolesStep = ({ data, errors, updateData }) => {
  const toggleRole = (index) => {
    const updatedRoles = data.roles.map((role, i) =>
      i === index ? { ...role, selected: !role.selected } : role
    );
    updateData('roles', updatedRoles);
  };

  const addCustomRole = () => {
    const newRole = {
      name: '',
      description: '',
      selected: false,
      custom: true
    };
    updateData('roles', [...data.roles, newRole]);
  };

  const updateCustomRole = (index, field, value) => {
    const updatedRoles = data.roles.map((role, i) =>
      i === index ? { ...role, [field]: value } : role
    );
    updateData('roles', updatedRoles);
  };

  const removeCustomRole = (index) => {
    updateData('roles', data.roles.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Roles & Permissions</h3>
        <button
          onClick={addCustomRole}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Role
        </button>
      </div>

      {errors.roles && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-600">{errors.roles}</p>
        </div>
      )}

      <div className="space-y-4">
        {data.roles.map((role, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={role.selected}
                  onChange={() => toggleRole(index)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <div className="flex-1">
                  {role.custom ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) => updateCustomRole(index, 'name', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Role name"
                      />
                      <input
                        type="text"
                        value={role.description}
                        onChange={(e) => updateCustomRole(index, 'description', e.target.value)}
                        className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Role description"
                      />
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{role.name}</h4>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                  )}
                </div>
              </div>
              {role.custom && (
                <button
                  onClick={() => removeCustomRole(index)}
                  className="text-red-600 hover:text-red-800 ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsStep = ({ data, errors, updateData }) => {
  const handleSettingChange = (section, field, value) => {
    if (section) {
      updateData('settings', {
        ...data.settings,
        [section]: {
          ...data.settings[section],
          [field]: value
        }
      });
    } else {
      updateData('settings', {
        ...data.settings,
        [field]: value
      });
    }
  };

  const handlePasswordPolicyChange = (field, value) => {
    updateData('settings', {
      ...data.settings,
      security: {
        ...data.settings.security,
        password_policy: {
          ...data.settings.security.password_policy,
          [field]: value
        }
      }
    });
  };

  const timezones = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Australia/Sydney'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Tenant Settings</h3>
      
      {/* General Settings */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">General Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Theme</label>
            <select
              value={data.settings.theme}
              onChange={(e) => handleSettingChange(null, 'theme', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select
              value={data.settings.language}
              onChange={(e) => handleSettingChange(null, 'language', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
              value={data.settings.timezone}
              onChange={(e) => handleSettingChange(null, 'timezone', e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {timezones.map(timezone => (
                <option key={timezone} value={timezone}>{timezone}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={data.settings.notifications}
              onChange={(e) => handleSettingChange(null, 'notifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Enable notifications</label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-md font-medium text-gray-900 mb-4">Security Settings</h4>
        
        <div className="space-y-4">
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-2">Password Policy</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600">Minimum Length</label>
                <input
                  type="number"
                  min="6"
                  max="20"
                  value={data.settings.security.password_policy.min_length}
                  onChange={(e) => handlePasswordPolicyChange('min_length', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.settings.security.password_policy.require_uppercase}
                    onChange={(e) => handlePasswordPolicyChange('require_uppercase', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs text-gray-700">Require uppercase</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.settings.security.password_policy.require_lowercase}
                    onChange={(e) => handlePasswordPolicyChange('require_lowercase', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs text-gray-700">Require lowercase</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.settings.security.password_policy.require_numbers}
                    onChange={(e) => handlePasswordPolicyChange('require_numbers', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs text-gray-700">Require numbers</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.settings.security.password_policy.require_symbols}
                    onChange={(e) => handlePasswordPolicyChange('require_symbols', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-xs text-gray-700">Require symbols</label>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Session Timeout (seconds)</label>
              <input
                type="number"
                min="300"
                max="86400"
                value={data.settings.security.session_timeout}
                onChange={(e) => handleSettingChange('security', 'session_timeout', parseInt(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                checked={data.settings.security.two_factor_required}
                onChange={(e) => handleSettingChange('security', 'two_factor_required', e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Require two-factor authentication</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantOnboardingWizard;