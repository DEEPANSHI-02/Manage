// src/pages/roles/RoleManagement.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Shield, 
  Key,
  Users,
  Settings,
  Eye,
  Link,
  Unlink,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const RoleManagement = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivilegeModal, setShowPrivilegeModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [privLoading, setPrivLoading] = useState(false);
  const [rolePrivileges, setRolePrivileges] = useState([]);

  useEffect(() => {
    loadRoles();
    loadPrivileges();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await mockApi.getRoles(user.tenant_id);
      if (response.success) {
        setRoles(response.data);
      }
    } catch (error) {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const loadPrivileges = async () => {
    try {
      const response = await mockApi.getPrivileges(user.tenant_id);
      if (response.success) {
        setPrivileges(response.data);
      }
    } catch (error) {
      console.error('Failed to load privileges:', error);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (showPrivilegeModal && selectedRole) {
      setPrivLoading(true);
      mockApi.getRolePrivileges(selectedRole.id)
        .then(res => setRolePrivileges(res.data ? res.data.map(p => p.id) : []))
        .finally(() => setPrivLoading(false));
    }
  }, [showPrivilegeModal, selectedRole]);

  const handleCreateRole = async (form) => {
    setCreateLoading(true);
    try {
      await mockApi.createRole(user.tenant_id, form);
      setShowCreateModal(false);
      loadRoles();
      toast.success('Role created');
    } catch {
      toast.error('Failed to create role');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditRole = async (form) => {
    setEditLoading(true);
    try {
      await mockApi.updateRole(selectedRole.id, form);
      setShowEditModal(false);
      setSelectedRole(null);
      loadRoles();
      toast.success('Role updated');
    } catch {
      toast.error('Failed to update role');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteRole = async () => {
    setDeleteLoading(true);
    try {
      await mockApi.deleteRole(selectedRole.id);
      setShowDeleteModal(false);
      setSelectedRole(null);
      loadRoles();
      toast.success('Role deleted');
    } catch {
      toast.error('Failed to delete role');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSavePrivileges = async (privIds) => {
    setPrivLoading(true);
    try {
      await mockApi.updateRolePrivileges(selectedRole.id, privIds);
      setShowPrivilegeModal(false);
      setSelectedRole(null);
      toast.success('Privileges updated');
    } catch {
      toast.error('Failed to update privileges');
    } finally {
      setPrivLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Create and manage user roles with specific privileges
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredRoles.length} of {roles.length} roles
            </div>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">
                      Created {new Date(role.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {role.description}
              </p>
              
              {/* Role Statistics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.floor(Math.random() * 20) + 1}
                  </div>
                  <div className="text-xs text-gray-500">Users</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.floor(Math.random() * 10) + 3}
                  </div>
                  <div className="text-xs text-gray-500">Privileges</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setShowPrivilegeModal(true);
                  }}
                  className="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Key className="h-4 w-4 inline mr-1" />
                  Privileges
                </button>
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setShowEditModal(true);
                  }}
                  className="flex-1 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Edit className="h-4 w-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setShowDeleteModal(true);
                  }}
                  className="bg-white py-2 px-3 border border-red-300 rounded-md shadow-sm text-sm leading-4 font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRoles.length === 0 && (
        <div className="text-center py-12 bg-white shadow rounded-lg">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Try adjusting your search criteria' 
              : 'Get started by creating a new role'
            }
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Role
              </button>
            </div>
          )}
        </div>
      )}

      {/* Role Templates */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Role Templates</h2>
          <p className="mt-1 text-sm text-gray-600">
            Create roles from predefined templates
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Department Manager',
                description: 'Manage users within specific department',
                privileges: ['user.read', 'user.update', 'organization.read'],
                icon: Users
              },
              {
                name: 'HR Specialist',
                description: 'Human resources focused permissions',
                privileges: ['user.create', 'user.read', 'user.update', 'organization.read'],
                icon: Settings
              },
              {
                name: 'Auditor',
                description: 'Read-only access for auditing purposes',
                privileges: ['user.read', 'role.read', 'organization.read', 'audit.access'],
                icon: Eye
              },
              {
                name: 'Project Lead',
                description: 'Limited management for project teams',
                privileges: ['user.read', 'user.update', 'organization.read'],
                icon: Shield
              }
            ].map((template, index) => (
              <div
                key={index}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 hover:bg-green-50 cursor-pointer transition-colors"
                onClick={() => {
                  // Pre-fill create modal with template data
                  setSelectedRole(template);
                  setShowCreateModal(true);
                }}
              >
                <template.icon className="h-8 w-8 text-gray-400 mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-2">{template.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{template.description}</p>
                <div className="space-y-1">
                  {template.privileges.slice(0, 3).map((privilege) => (
                    <span key={privilege} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                      {privilege}
                    </span>
                  ))}
                  {template.privileges.length > 3 && (
                    <span className="text-xs text-gray-500">+{template.privileges.length - 3} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals would go here */}
      <RoleModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onSave={handleCreateRole} loading={createLoading} title="Create Role" />
      <RoleModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} onSave={handleEditRole} initialData={selectedRole} loading={editLoading} title="Edit Role" />
      <DeleteRoleModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onDelete={handleDeleteRole} role={selectedRole} loading={deleteLoading} />
      <PrivilegeManagementModal isOpen={showPrivilegeModal} onClose={() => setShowPrivilegeModal(false)} role={selectedRole} privileges={privileges} assigned={rolePrivileges} onSave={handleSavePrivileges} loading={privLoading} />
    </div>
  );
};

const RoleModal = ({ isOpen, onClose, onSave, initialData, loading, title }) => {
  const [form, setForm] = useState(initialData || { name: '', description: '' });
  const [error, setError] = useState('');
  useEffect(() => { setForm(initialData || { name: '', description: '' }); setError(''); }, [initialData, isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={e => { e.preventDefault(); if (!form.name.trim()) return setError('Name is required'); onSave(form); }} className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-4 relative">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-700">{title}</h2>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2 mt-1" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded px-3 py-2 mt-1" rows={3} />
        </div>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div className="flex gap-2 justify-end mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
};

const DeleteRoleModal = ({ isOpen, onClose, onDelete, role, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md space-y-4 relative">
        <h2 className="text-lg font-bold mb-2 text-red-700 flex items-center gap-2"><Trash2 className="h-5 w-5 text-red-600" /> Delete Role</h2>
        <p>Are you sure you want to delete the role <span className="font-semibold">{role?.name}</span>?</p>
        <div className="flex gap-2 justify-end mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button type="button" onClick={onDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700" disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
        </div>
      </div>
    </div>
  );
};

const PrivilegeManagementModal = ({ isOpen, onClose, role, privileges, assigned, onSave, loading }) => {
  const [selected, setSelected] = useState(assigned || []);
  useEffect(() => { setSelected(assigned || []); }, [assigned, isOpen]);
  if (!isOpen || !role) return null;
  const toggle = (privId) => setSelected(sel => sel.includes(privId) ? sel.filter(id => id !== privId) : [...sel, privId]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg space-y-4 relative">
        <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-green-700"><Key className="h-5 w-5 text-green-600" /> Manage Privileges for {role.name}</h2>
        <div className="max-h-64 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-2">
          {privileges.map(priv => (
            <label key={priv.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={selected.includes(priv.id)} onChange={() => toggle(priv.id)} />
              <span>{priv.name}</span>
              <span className="text-xs text-gray-400">({priv.category})</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
          <button type="button" onClick={() => onSave(selected)} className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default RoleManagement;