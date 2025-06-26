import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Filter, Search, Key, List } from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const defaultPrivilege = { name: '', description: '', category: '' };
const categories = [
  'User Management',
  'Role Management',
  'Tenant Management',
  'Organization',
  'Security',
  'Custom'
];

const PrivilegeManagement = () => {
  const { tenantId } = useAuth();
  const [privileges, setPrivileges] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editPrivilege, setEditPrivilege] = useState(null);
  const [form, setForm] = useState(defaultPrivilege);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPrivileges();
  }, []);

  useEffect(() => {
    let data = privileges;
    if (category) data = data.filter(p => p.category === category);
    if (search) data = data.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(data);
  }, [privileges, search, category]);

  const loadPrivileges = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getPrivileges(tenantId);
      setPrivileges(res.data || []);
    } catch (e) {
      setError('Failed to load privileges');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditPrivilege(null);
    setForm(defaultPrivilege);
    setShowModal(true);
  };
  const openEdit = (priv) => {
    setEditPrivilege(priv);
    setForm(priv);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditPrivilege(null);
    setForm(defaultPrivilege);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.category) return setError('Category is required');
    try {
      if (editPrivilege) {
        await mockApi.updatePrivilege(editPrivilege.id, form);
      } else {
        await mockApi.createPrivilege(tenantId, form);
      }
      closeModal();
      loadPrivileges();
    } catch {
      setError('Failed to save privilege');
    }
  };

  const handleDelete = async (priv) => {
    if (!window.confirm(`Delete privilege "${priv.name}"?`)) return;
    try {
      await mockApi.deletePrivilege(priv.id);
      loadPrivileges();
    } catch {
      alert('Failed to delete privilege');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Key className="h-6 w-6" /> Privilege Management</h1>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"><Plus className="h-4 w-4 mr-1" />Add Privilege</button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search privileges..." className="pl-8 pr-2 py-2 border rounded" />
        </div>
        <div className="relative">
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="pl-8 pr-2 py-2 border rounded">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center"><LoadingSpinner size="small" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-gray-500">No privileges found.</td></tr>
            ) : filtered.map(priv => (
              <tr key={priv.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{priv.name}</td>
                <td className="p-3">{priv.description}</td>
                <td className="p-3">{priv.category}</td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(priv)} className="text-blue-600 hover:underline flex items-center"><Edit className="h-4 w-4 mr-1" />Edit</button>
                  <button onClick={() => handleDelete(priv)} className="text-red-600 hover:underline flex items-center"><Trash2 className="h-4 w-4 mr-1" />Delete</button>
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
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">{editPrivilege ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {editPrivilege ? 'Edit Privilege' : 'Add Privilege'}</h2>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <input name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{editPrivilege ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default PrivilegeManagement; 