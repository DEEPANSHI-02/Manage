import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import systemAdminMockApi from '../../services/systemAdminMockApi';
import { Zap, Plus, FileText } from 'lucide-react';

const initialApi = { name: '', endpoint: '', method: 'GET', description: '' };

const methodColors = {
  GET: 'bg-green-100 text-green-800',
  POST: 'bg-blue-100 text-blue-800',
  PUT: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
  PATCH: 'bg-purple-100 text-purple-800',
};

const APIManagement = () => {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(initialApi);
  const [editingId, setEditingId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Example summary stats
  const summaryStats = [
    { label: 'Total APIs', value: apis.length, icon: Zap },
    { label: 'Unique Methods', value: [...new Set(apis.map(a => a.method))].length, icon: FileText },
  ];

  // Fetch APIs
  const fetchApis = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await systemAdminMockApi.getApis();
      setApis(res.data);
    } catch (err) {
      setError('Failed to load APIs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApis();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await systemAdminMockApi.updateApi(editingId, formData);
        toast.success('API updated');
      } else {
        await systemAdminMockApi.createApi(formData);
        toast.success('API created');
      }
      setShowForm(false);
      setFormData(initialApi);
      setEditingId(null);
      fetchApis();
    } catch (err) {
      toast.error('Failed to save API');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    setLoading(true);
    try {
      await systemAdminMockApi.deleteApi(deleteId);
      toast.success('API deleted');
      setShowDelete(false);
      setDeleteId(null);
      fetchApis();
    } catch (err) {
      toast.error('Failed to delete API');
    } finally {
      setLoading(false);
    }
  };

  // Open edit form
  const openEdit = (api) => {
    setFormData(api);
    setEditingId(api.id);
    setShowForm(true);
  };

  // Open create form
  const openCreate = () => {
    setFormData(initialApi);
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Zap className="h-6 w-6 mr-2 text-blue-600" />
          API Management
        </h1>
        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"><Plus className="h-4 w-4 mr-1" />Add API</button>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {summaryStats.map(stat => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-4 flex items-center">
            <stat.icon className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Endpoint</th>
              <th className="px-4 py-2 text-left">Method</th>
              <th className="px-4 py-2 text-left">Description</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apis.map((api) => (
              <tr key={api.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{api.name}</td>
                <td className="px-4 py-2">{api.endpoint}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${methodColors[api.method] || 'bg-gray-100 text-gray-800'}`}>{api.method}</span>
                </td>
                <td className="px-4 py-2">{api.description}</td>
                <td className="px-4 py-2">
                  <button onClick={() => openEdit(api)} className="text-blue-600 mr-2 hover:underline">Edit</button>
                  <button onClick={() => { setShowDelete(true); setDeleteId(api.id); }} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit API' : 'Add API'}</h2>
            <div className="mb-3">
              <label className="block mb-1">Name</label>
              <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border px-2 py-1 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Endpoint</label>
              <input required value={formData.endpoint} onChange={e => setFormData({ ...formData, endpoint: e.target.value })} className="w-full border px-2 py-1 rounded" />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Method</label>
              <select required value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value })} className="w-full border px-2 py-1 rounded">
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>DELETE</option>
                <option>PATCH</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block mb-1">Description</label>
              <input value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full border px-2 py-1 rounded" />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">{editingId ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Delete Modal */}
      {showDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-80">
            <h2 className="text-xl font-bold mb-4">Delete API</h2>
            <p>Are you sure you want to delete this API?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setShowDelete(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
              <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default APIManagement; 