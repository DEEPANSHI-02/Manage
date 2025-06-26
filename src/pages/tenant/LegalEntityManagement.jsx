import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Filter, Search, Building, FileText, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const defaultEntity = { name: '', entity_type: '', jurisdiction: '', compliance_status: 'Compliant' };
const entityTypes = ['Corporation', 'LLC', 'Partnership', 'Nonprofit', 'Trust', 'Other'];
const complianceStatuses = ['Compliant', 'Pending', 'Non-Compliant'];

const LegalEntityManagement = () => {
  const { tenantId } = useAuth();
  const [entities, setEntities] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editEntity, setEditEntity] = useState(null);
  const [form, setForm] = useState(defaultEntity);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [report, setReport] = useState({ compliant: 0, pending: 0, nonCompliant: 0 });

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    let data = entities;
    if (status) data = data.filter(e => e.compliance_status === status);
    if (search) data = data.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(data);
    setReport({
      compliant: entities.filter(e => e.compliance_status === 'Compliant').length,
      pending: entities.filter(e => e.compliance_status === 'Pending').length,
      nonCompliant: entities.filter(e => e.compliance_status === 'Non-Compliant').length
    });
  }, [entities, search, status]);

  const loadEntities = async () => {
    setLoading(true);
    try {
      const res = await mockApi.getLegalEntities(tenantId);
      setEntities(res.data || []);
    } catch (e) {
      setError('Failed to load legal entities');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditEntity(null);
    setForm(defaultEntity);
    setShowModal(true);
  };
  const openEdit = (entity) => {
    setEditEntity(entity);
    setForm(entity);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditEntity(null);
    setForm(defaultEntity);
    setError('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Name is required');
    if (!form.entity_type) return setError('Entity type is required');
    if (!form.jurisdiction) return setError('Jurisdiction is required');
    try {
      if (editEntity) {
        await mockApi.updateLegalEntity(editEntity.id, form);
      } else {
        await mockApi.createLegalEntity(tenantId, form);
      }
      closeModal();
      loadEntities();
    } catch {
      setError('Failed to save legal entity');
    }
  };

  const handleDelete = async (entity) => {
    if (!window.confirm(`Delete legal entity "${entity.name}"?`)) return;
    try {
      await mockApi.deleteLegalEntity(entity.id);
      loadEntities();
    } catch {
      alert('Failed to delete legal entity');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Building className="h-6 w-6" /> Legal Entity Management</h1>
        <button onClick={openCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"><Plus className="h-4 w-4 mr-1" />Add Legal Entity</button>
      </div>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search entities..." className="pl-8 pr-2 py-2 border rounded" />
        </div>
        <div className="relative">
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <select value={status} onChange={e => setStatus(e.target.value)} className="pl-8 pr-2 py-2 border rounded">
            <option value="">All Compliance Status</option>
            {complianceStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {/* Reporting Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-4 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <div>
            <div className="text-xs text-gray-500">Compliant</div>
            <div className="text-xl font-bold">{report.compliant}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-yellow-500" />
          <div>
            <div className="text-xs text-gray-500">Pending</div>
            <div className="text-xl font-bold">{report.pending}</div>
          </div>
        </div>
        <div className="bg-white rounded shadow p-4 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-red-500" />
          <div>
            <div className="text-xs text-gray-500">Non-Compliant</div>
            <div className="text-xl font-bold">{report.nonCompliant}</div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Jurisdiction</th>
              <th className="p-3 text-left">Compliance</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center"><LoadingSpinner size="small" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-gray-500">No legal entities found.</td></tr>
            ) : filtered.map(entity => (
              <tr key={entity.id} className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">{entity.name}</td>
                <td className="p-3">{entity.entity_type}</td>
                <td className="p-3">{entity.jurisdiction}</td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    entity.compliance_status === 'Compliant' ? 'bg-green-100 text-green-800' :
                    entity.compliance_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {entity.compliance_status}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button onClick={() => openEdit(entity)} className="text-blue-600 hover:underline flex items-center"><Edit className="h-4 w-4 mr-1" />Edit</button>
                  <button onClick={() => handleDelete(entity)} className="text-red-600 hover:underline flex items-center"><Trash2 className="h-4 w-4 mr-1" />Delete</button>
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
            <h2 className="text-lg font-bold mb-2 flex items-center gap-2">{editEntity ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />} {editEntity ? 'Edit Legal Entity' : 'Add Legal Entity'}</h2>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Entity Type</label>
              <select name="entity_type" value={form.entity_type} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required>
                <option value="">Select type</option>
                {entityTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Jurisdiction</label>
              <input name="jurisdiction" value={form.jurisdiction} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Compliance Status</label>
              <select name="compliance_status" value={form.compliance_status} onChange={handleChange} className="w-full border rounded px-3 py-2 mt-1" required>
                {complianceStatuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <div className="flex gap-2 justify-end mt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">{editEntity ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LegalEntityManagement; 