import React, { useEffect, useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const defaultSettings = {
  name: '',
  description: '',
  email: '',
  phone: '',
  website: '',
  logo_url: '',
  preferences: {
    theme: 'light',
    language: 'English',
    timezone: 'UTC'
  }
};

const TenantSettings = () => {
  const { tenantId } = useAuth();
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getTenants();
      const tenant = res.data.find(t => t.id === tenantId);
      if (tenant) setSettings({ ...defaultSettings, ...tenant });
    } catch {
      setError('Failed to load tenant settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name in settings.preferences) {
      setSettings({ ...settings, preferences: { ...settings.preferences, [name]: value } });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setSettings({ ...settings, logo_url: ev.target.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { preferences, ...tenantData } = settings;
      await mockApi.updateTenant(tenantId, tenantData);
      setSuccess('Settings saved successfully!');
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading tenant settings..." />;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-green-700">Tenant Settings</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium">Tenant Name</label>
          <input name="name" value={settings.name} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={settings.description} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" rows={2} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Contact Email</label>
            <input name="email" value={settings.email} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" type="email" />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input name="phone" value={settings.phone} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Website</label>
          <input name="website" value={settings.website} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
        </div>
        <div>
          <label className="block text-sm font-medium">Logo</label>
          <input type="file" accept="image/*" onChange={handleLogoChange} className="mt-1" />
          {settings.logo_url && <img src={settings.logo_url} alt="Tenant Logo" className="h-16 mt-2 rounded" />}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium">Theme</label>
            <select name="theme" value={settings.preferences.theme} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Language</label>
            <select name="language" value={settings.preferences.language} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Timezone</label>
            <select name="timezone" value={settings.preferences.timezone} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1">
              <option value="UTC">UTC</option>
              <option value="Asia/Kolkata">Asia/Kolkata</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Europe/London">Europe/London</option>
            </select>
          </div>
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</button>
        </div>
      </form>
    </div>
  );
};

export default TenantSettings; 