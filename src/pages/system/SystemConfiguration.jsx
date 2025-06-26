import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RefreshCw,
  Shield,
  Globe,
  Clock,
  Database,
  Mail,
  Key,
  Users,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const SystemConfiguration = () => {
  const [config, setConfig] = useState({
    general: {
      systemName: 'Enterprise User Management System',
      version: '2.4.1',
      environment: 'Production',
      region: 'us-west-2',
      timezone: 'UTC',
      maintenanceWindow: '02:00-04:00 UTC Sunday'
    },
    security: {
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSymbols: true,
        expiryDays: 90
      },
      twoFactorRequired: false,
      ipWhitelisting: false
    },
    performance: {
      rateLimiting: true,
      cacheEnabled: true,
      compressionEnabled: true,
      cdnEnabled: true,
      maxRequestSize: '10MB',
      timeoutSettings: {
        api: 30000,
        database: 10000,
        external: 60000
      }
    },
    features: {
      auditLogging: true,
      realTimeNotifications: true,
      advancedAnalytics: true,
      bulkOperations: true,
      apiAccess: true,
      customIntegrations: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async (section) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert(`${section} configuration saved successfully!`);
    } catch (error) {
      alert('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (section, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const updateNestedConfig = (section, parentKey, key, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentKey]: {
          ...prev[section][parentKey],
          [key]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Settings className="h-6 w-6 mr-2 text-blue-600" />
                System Configuration
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Configure system-wide settings and preferences
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset to Defaults
              </button>
              <button 
                onClick={() => handleSave(activeTab)}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'general', name: 'General', icon: Globe },
              { id: 'security', name: 'Security', icon: Shield },
              { id: 'performance', name: 'Performance', icon: Database },
              { id: 'features', name: 'Features', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={config.general.systemName}
                    onChange={(e) => updateConfig('general', 'systemName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment
                  </label>
                  <select
                    value={config.general.environment}
                    onChange={(e) => updateConfig('general', 'environment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Development">Development</option>
                    <option value="Staging">Staging</option>
                    <option value="Production">Production</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <select
                    value={config.general.region}
                    onChange={(e) => updateConfig('general', 'region', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="us-west-1">US West 1</option>
                    <option value="us-west-2">US West 2</option>
                    <option value="us-east-1">US East 1</option>
                    <option value="eu-west-1">EU West 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={config.general.timezone}
                    onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Window
                </label>
                <input
                  type="text"
                  value={config.general.maintenanceWindow}
                  onChange={(e) => updateConfig('general', 'maintenanceWindow', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="02:00-04:00 UTC Sunday"
                />
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={config.security.sessionTimeout}
                    onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Length
                    </label>
                    <input
                      type="number"
                      value={config.security.passwordPolicy.minLength}
                      onChange={(e) => updateNestedConfig('security', 'passwordPolicy', 'minLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Days
                    </label>
                    <input
                      type="number"
                      value={config.security.passwordPolicy.expiryDays}
                      onChange={(e) => updateNestedConfig('security', 'passwordPolicy', 'expiryDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { key: 'requireUppercase', label: 'Require Uppercase' },
                    { key: 'requireNumbers', label: 'Require Numbers' },
                    { key: 'requireSymbols', label: 'Require Symbols' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.security.passwordPolicy[item.key]}
                        onChange={(e) => updateNestedConfig('security', 'passwordPolicy', item.key, e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label className="ml-3 text-sm text-gray-700">{item.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.twoFactorRequired}
                    onChange={(e) => updateConfig('security', 'twoFactorRequired', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-3 text-sm text-gray-700">Require Two-Factor Authentication</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.ipWhitelisting}
                    onChange={(e) => updateConfig('security', 'ipWhitelisting', e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="ml-3 text-sm text-gray-700">Enable IP Whitelisting</label>
                </div>
              </div>
            </div>
          )}

          {/* Performance Settings */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="space-y-3">
                {[
                  { key: 'rateLimiting', label: 'Rate Limiting', description: 'Limit API requests per user' },
                  { key: 'cacheEnabled', label: 'Cache Enabled', description: 'Enable response caching' },
                  { key: 'compressionEnabled', label: 'Compression', description: 'Enable response compression' },
                  { key: 'cdnEnabled', label: 'CDN', description: 'Enable Content Delivery Network' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.performance[item.key]}
                      onChange={(e) => updateConfig('performance', item.key, e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Timeout Settings (ms)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Timeout</label>
                    <input
                      type="number"
                      value={config.performance.timeoutSettings.api}
                      onChange={(e) => updateNestedConfig('performance', 'timeoutSettings', 'api', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Database Timeout</label>
                    <input
                      type="number"
                      value={config.performance.timeoutSettings.database}
                      onChange={(e) => updateNestedConfig('performance', 'timeoutSettings', 'database', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">External Timeout</label>
                    <input
                      type="number"
                      value={config.performance.timeoutSettings.external}
                      onChange={(e) => updateNestedConfig('performance', 'timeoutSettings', 'external', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Request Size
                </label>
                <input
                  type="text"
                  value={config.performance.maxRequestSize}
                  onChange={(e) => updateConfig('performance', 'maxRequestSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Feature Settings */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              <div className="space-y-3">
                {[
                  { key: 'auditLogging', label: 'Audit Logging', description: 'Track all user actions and system changes' },
                  { key: 'realTimeNotifications', label: 'Real-time Notifications', description: 'Enable WebSocket notifications' },
                  { key: 'advancedAnalytics', label: 'Advanced Analytics', description: 'Enable detailed usage analytics' },
                  { key: 'bulkOperations', label: 'Bulk Operations', description: 'Allow bulk user and data operations' },
                  { key: 'apiAccess', label: 'API Access', description: 'Enable REST API access for integrations' },
                  { key: 'customIntegrations', label: 'Custom Integrations', description: 'Allow custom webhook integrations' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                    <div className="flex items-center">
                      {config.features[item.key] ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-gray-400 mr-2" />
                      )}
                      <input
                        type="checkbox"
                        checked={config.features[item.key]}
                        onChange={(e) => updateConfig('features', item.key, e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};