import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Building } from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const defaultOrg = { name: '', description: '', industry: '', email: '', phone: '', active: true };

const OrganizationManagement = () => {
  const { tenantId } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editOrg, setEditOrg] = useState(null);
  const [form, setForm] = useState(defaultOrg);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    let data = organizations;
    if (industry) data = data.filter(o => o.industry === industry);
    if (status) data = data.filter(o => (status === 'active' ? o.active : !o.active));
    if (search) data = data.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(data);
  }, [organizations, search, industry, status]);

  const loadOrganizations = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getOrganizations(tenantId);
      setOrganizations(res.data || []);
    } catch (e) {
      setError('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditOrg(null);
    setForm(defaultOrg);
    setShowModal(true);
  };
  const openEdit = (org) => {
    setEditOrg(org);
    setForm(org);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditOrg(null);
    setForm(defaultOrg);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.industry) return setError('Industry is required');
    try {
      if (editOrg) {
        await mockApi.updateOrganization(editOrg.id, form);
      } else {
        await mockApi.createOrganization(tenantId, form);
      }
      closeModal();
      loadOrganizations();
    } catch {
      setError('Failed to save organization');
    }
  };

  const handleDelete = async (org) => {
    if (!window.confirm(`Delete organization "${org.name}"?`)) return;
    try {
      await mockApi.deleteOrganization(org.id);
      loadOrganizations();
    } catch {
      alert('Failed to delete organization');
    }
  };

  // Get unique industries for filter dropdown
  const getUniqueIndustries = () => {
    const industries = [...new Set(organizations.map(org => org.industry))];
    return industries.filter(Boolean).sort();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Building className="h-6 w-6 text-green-600" /> Organization Management</h1>
        <button onClick={openCreate} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center"><Plus className="h-4 w-4 mr-1" />Add Organization</button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search organizations..." className="pl-8 pr-2 py-2 border rounded" />
        </div>
        <div className="relative">
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <select value={industry} onChange={e => setIndustry(e.target.value)} className="pl-8 pr-2 py-2 border rounded">
            <option value="">All Industries</option>
            {getUniqueIndustries().map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div className="relative">
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="pl-8 pr-2 py-2 border rounded">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Industry</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-4 text-center"><LoadingSpinner size="small" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-gray-500">No organizations found.</td></tr>
            ) : filtered.map(org => (
              <tr key={org.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{org.name}</td>
                <td className="p-3">{org.industry}</td>
                <td className="p-3">{org.email}</td>
                <td className="p-3">{org.phone}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    org.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {org.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(org)} className="text-blue-600 hover:underline flex items-center"><Edit className="h-4 w-4 mr-1" />Edit</button>
                  <button onClick={() => handleDelete(org)} className="text-red-600 hover:underline flex items-center"><Trash2 className="h-4 w-4 mr-1" />Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-4 relative">
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">{editOrg ? <Edit className="h-5 w-5 text-green-600" /> : <Plus className="h-5 w-5 text-green-600" />} {editOrg ? 'Edit Organization' : 'Add Organization'}</h2>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Industry</label>
              <input name="industry" value={form.industry} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div className="flex gap-2 items-center">
              <input type="checkbox" name="active" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
              <label className="text-sm">Active</label>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">{editOrg ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default OrganizationManagement; 