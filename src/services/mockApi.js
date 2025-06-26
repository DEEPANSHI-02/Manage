// src/services/mockApi.js - FIXED VERSION
import { mockData } from './mockData';

class MockApiService {
  constructor() {
    this.baseDelay = 800;
    this.currentUser = null;
  }

  delay(ms = this.baseDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // ==================== AUTHENTICATION APIs ====================
  async login(credentials) {
    await this.delay(500); // Shorter delay for login
    
    const { email, password } = credentials;
    
    // Find user by email and password
    const user = mockData.users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    this.currentUser = user;
    
    return {
      success: true,
      data: {
        access_token: `mock_token_${this.generateId()}`,
        refresh_token: `mock_refresh_${this.generateId()}`,
        token_type: 'bearer',
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        user_id: user.id,
        tenant_id: user.tenant_id,
        organization_id: user.organization_id,
        tenant_region_url: 'https://api.example.com'
      },
      message: 'Login successful',
      trace_id: this.generateId()
    };
  }

  async getCurrentUser() {
    await this.delay(300);
    
    if (!this.currentUser) {
      // If no current user, try to find admin user for demo
      this.currentUser = mockData.users.find(u => u.email === 'admin@techcorp.com');
    }
    
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get user roles
    const userRoleAssignments = mockData.userRoles.filter(ur => ur.user_id === this.currentUser.id);
    const userRoles = userRoleAssignments.map(ur => 
      mockData.roles.find(r => r.id === ur.role_id)
    ).filter(Boolean);
    
    // Get user privileges through roles
    const userPrivileges = [];
    userRoles.forEach(role => {
      const rolePrivilegeAssignments = mockData.rolePrivileges.filter(rp => rp.role_id === role.id);
      const rolePrivileges = rolePrivilegeAssignments.map(rp => 
        mockData.privileges.find(p => p.id === rp.privilege_id)
      ).filter(Boolean);
      userPrivileges.push(...rolePrivileges);
    });
    
    return {
      success: true,
      data: {
        ...this.currentUser,
        roles: userRoles,
        privileges: userPrivileges
      },
      message: 'User profile retrieved',
      trace_id: this.generateId()
    };
  }

  async updateCurrentUser(profileData) {
    await this.delay();
    
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userIndex = mockData.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex !== -1) {
      mockData.users[userIndex] = { ...mockData.users[userIndex], ...profileData };
      this.currentUser = mockData.users[userIndex];
    }
    
    return {
      success: true,
      data: this.currentUser,
      message: 'Profile updated successfully',
      trace_id: this.generateId()
    };
  }

  // ==================== TENANT MANAGEMENT APIs ====================
  async getTenants() {
    await this.delay();
    return {
      success: true,
      data: mockData.tenants,
      message: 'Tenants retrieved successfully',
      trace_id: this.generateId()
    };
  }

  async createTenant(tenantData) {
    await this.delay();
    
    const newTenant = {
      id: this.generateId(),
      ...tenantData,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockData.tenants.push(newTenant);
    
    return {
      success: true,
      data: newTenant,
      message: 'Tenant created successfully',
      trace_id: this.generateId()
    };
  }

  async updateTenant(id, tenantData) {
    await this.delay();
    
    const tenantIndex = mockData.tenants.findIndex(t => t.id === id);
    if (tenantIndex === -1) {
      throw new Error('Tenant not found');
    }
    
    mockData.tenants[tenantIndex] = {
      ...mockData.tenants[tenantIndex],
      ...tenantData,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: mockData.tenants[tenantIndex],
      message: 'Tenant updated successfully',
      trace_id: this.generateId()
    };
  }

  async deleteTenant(id) {
    await this.delay();
    const tenantIndex = mockData.tenants.findIndex(t => t.id === id);
    if (tenantIndex === -1) {
      throw new Error('Tenant not found');
    }
    mockData.tenants.splice(tenantIndex, 1);
    return {
      success: true,
      message: 'Tenant deleted successfully',
      trace_id: this.generateId()
    };
  }

  // ==================== ORGANIZATION MANAGEMENT APIs ====================
  async getOrganizations(tenantId, filters = {}) {
    await this.delay();
    
    let organizations = mockData.organizations.filter(org => org.tenant_id === tenantId);
    
    if (filters.name) {
      organizations = organizations.filter(org => 
        org.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    if (filters.industry) {
      organizations = organizations.filter(org => org.industry === filters.industry);
    }
    
    if (filters.active !== undefined) {
      organizations = organizations.filter(org => org.active === filters.active);
    }
    
    return {
      success: true,
      data: organizations,
      message: 'Organizations retrieved successfully',
      trace_id: this.generateId()
    };
  }

  async createOrganization(tenantId, orgData) {
    await this.delay();
    
    const newOrganization = {
      id: this.generateId(),
      tenant_id: tenantId,
      ...orgData,
      active: orgData.active !== undefined ? orgData.active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockData.organizations.push(newOrganization);
    
    return {
      success: true,
      data: newOrganization,
      message: 'Organization created successfully',
      trace_id: this.generateId()
    };
  }

  async updateOrganization(id, orgData) {
    await this.delay();
    
    const orgIndex = mockData.organizations.findIndex(org => org.id === id);
    if (orgIndex === -1) {
      throw new Error('Organization not found');
    }
    
    mockData.organizations[orgIndex] = {
      ...mockData.organizations[orgIndex],
      ...orgData,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: mockData.organizations[orgIndex],
      message: 'Organization updated successfully',
      trace_id: this.generateId()
    };
  }

  async deleteOrganization(id) {
    await this.delay();
    
    const orgIndex = mockData.organizations.findIndex(org => org.id === id);
    if (orgIndex === -1) {
      throw new Error('Organization not found');
    }
    
    mockData.organizations.splice(orgIndex, 1);
    
    return {
      success: true,
      message: 'Organization deleted successfully',
      trace_id: this.generateId()
    };
  }

  // ==================== USER MANAGEMENT APIs ====================
  async getUsers(tenantId, filters = {}) {
    await this.delay();
    
    let users = mockData.users.filter(user => user.tenant_id === tenantId);
    
    if (filters.email) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    if (filters.active !== undefined) {
      users = users.filter(user => user.active === filters.active);
    }
    
    // Remove password from response
    return {
      success: true,
      data: users.map(user => ({ ...user, password: undefined })),
      message: 'Users retrieved successfully',
      trace_id: this.generateId()
    };
  }

  // ==================== ROLE MANAGEMENT APIs ====================
  async getRoles(tenantId) {
    await this.delay();
    
    const roles = mockData.roles.filter(role => role.tenant_id === tenantId);
    
    return {
      success: true,
      data: roles,
      message: 'Roles retrieved successfully',
      trace_id: this.generateId()
    };
  }

  // ==================== PRIVILEGE MANAGEMENT APIs ====================
  async getPrivileges(tenantId) {
    await this.delay();
    
    const privileges = mockData.privileges.filter(privilege => privilege.tenant_id === tenantId);
    
    return {
      success: true,
      data: privileges,
      message: 'Privileges retrieved successfully',
      trace_id: this.generateId()
    };
  }

  // ==================== LEGAL ENTITIES APIs ====================
  async getLegalEntities(tenantId) {
    await this.delay();
    
    const legalEntities = mockData.legalEntities.filter(entity => entity.tenant_id === tenantId);
    
    return {
      success: true,
      data: legalEntities,
      message: 'Legal entities retrieved successfully',
      trace_id: this.generateId()
    };
  }

  async createLegalEntity(tenantId, entityData) {
    await this.delay();
    
    const newEntity = {
      id: this.generateId(),
      tenant_id: tenantId,
      ...entityData,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockData.legalEntities.push(newEntity);
    
    return {
      success: true,
      data: newEntity,
      message: 'Legal entity created successfully',
      trace_id: this.generateId()
    };
  }

  async updateLegalEntity(id, entityData) {
    await this.delay();
    
    const entityIndex = mockData.legalEntities.findIndex(e => e.id === id);
    if (entityIndex === -1) {
      throw new Error('Legal entity not found');
    }
    
    mockData.legalEntities[entityIndex] = {
      ...mockData.legalEntities[entityIndex],
      ...entityData,
      updated_at: new Date().toISOString()
    };
    
    return {
      success: true,
      data: mockData.legalEntities[entityIndex],
      message: 'Legal entity updated successfully',
      trace_id: this.generateId()
    };
  }

  // --- User Roles & Privileges Mock Endpoints ---
  async getUserRoles(userId) {
    // For demo, return User and Manager for userId 1, User for others
    return {
      data: userId === 1 ? [mockData.roles[0], mockData.roles[1]] : [mockData.roles[0]],
      status: 200
    };
  }

  async getUserPrivileges(userId) {
    // For demo, return all privileges for userId 1, some for others
    return {
      data: userId === 1 ? mockData.rolePrivileges.map(rp => mockData.privileges.find(p => p.id === rp.privilege_id)) : [mockData.rolePrivileges[0].privilege_id, mockData.rolePrivileges[1].privilege_id],
      status: 200
    };
  }

  async getAllRoles() {
    return { data: mockData.roles, status: 200 };
  }

  async requestRoleChange(userId, roleId, action) {
    // Simulate a delay and always succeed
    await new Promise(res => setTimeout(res, 500));
    return { status: 200, data: { success: true } };
  }

  // --- User Sessions Mock Endpoints ---
  async getUserSessions(userId) {
    // Return a list of mock sessions
    return {
      data: [
        { id: 'sess-1', device: 'Chrome on Windows', location: 'San Francisco, CA', lastActive: new Date().toISOString(), current: true },
        { id: 'sess-2', device: 'Safari on iPhone', location: 'New York, NY', lastActive: new Date(Date.now() - 3600000).toISOString(), current: false },
        { id: 'sess-3', device: 'Edge on Mac', location: 'London, UK', lastActive: new Date(Date.now() - 7200000).toISOString(), current: false }
      ],
      status: 200
    };
  }

  async terminateSession(userId, sessionId) {
    // Simulate a delay and always succeed
    await new Promise(res => setTimeout(res, 500));
    return { status: 200, data: { success: true } };
  }

  // --- Security Mock Endpoints ---
  async toggleTwoFactor(userId, enable) {
    // Simulate a delay and return the new state
    await new Promise(res => setTimeout(res, 500));
    return { status: 200, data: { enabled: enable } };
  }

  async changePassword(userId, currentPassword, newPassword) {
    // Simulate a delay and always succeed
    await new Promise(res => setTimeout(res, 500));
    return { status: 200, data: { success: true } };
  }

  // --- Preferences Mock Endpoint ---
  async savePreferences(userId, preferences) {
    // Simulate a delay and always succeed
    await new Promise(res => setTimeout(res, 500));
    return { status: 200, data: { success: true } };
  }

  // --- User Deactivation Mock Endpoint ---
  async deactivateUser(userId) {
    // Simulate a delay and always succeed
    await new Promise(res => setTimeout(res, 500));
    return { status: 200, data: { status: 'INACTIVE' } };
  }

  // --- Persistent Security Settings ---
  async getSecuritySettings(userId) {
    const settings = getPersisted('userSecuritySettings', {
      lastPasswordChange: new Date().toISOString(),
      twoFactorEnabled: false,
      sessionTimeout: 3600,
      loginHistory: [
        {
          id: 1,
          ip: '192.168.1.1',
          location: 'San Francisco, CA',
          device: 'Chrome on Windows',
          timestamp: new Date().toISOString(),
          success: true
        }
      ]
    });
    return { data: settings, status: 200 };
  }

  async saveSecuritySettings(userId, settings) {
    setPersisted('userSecuritySettings', settings);
    return { status: 200, data: { success: true } };
  }

  async createRole(tenantId, roleData) {
    await this.delay();
    const newRole = {
      id: this.generateId('role-'),
      tenant_id: tenantId,
      ...roleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.roles.push(newRole);
    return {
      success: true,
      data: newRole,
      message: 'Role created successfully',
      trace_id: this.generateId()
    };
  }

  async updateRole(roleId, roleData) {
    await this.delay();
    const idx = mockData.roles.findIndex(r => r.id === roleId);
    if (idx === -1) throw new Error('Role not found');
    mockData.roles[idx] = {
      ...mockData.roles[idx],
      ...roleData,
      updated_at: new Date().toISOString()
    };
    return {
      success: true,
      data: mockData.roles[idx],
      message: 'Role updated successfully',
      trace_id: this.generateId()
    };
  }

  async deleteRole(roleId) {
    await this.delay();
    const idx = mockData.roles.findIndex(r => r.id === roleId);
    if (idx === -1) throw new Error('Role not found');
    mockData.roles.splice(idx, 1);
    return {
      success: true,
      message: 'Role deleted successfully',
      trace_id: this.generateId()
    };
  }
}

// Create single instance
const mockApiInstance = new MockApiService();

// Export both for backward compatibility
export const mockApi = mockApiInstance;
export const completeMockApi = mockApiInstance;

// Default export
export default mockApiInstance;

// --- Persistent User Profile, Preferences, and Legal Entities ---
function getPersisted(key, fallback) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : fallback;
}
function setPersisted(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// User Profile
mockApi.getCurrentUser = async () => {
  const profile = getPersisted('userProfile', {
    id: 1,
    first_name: 'Mike',
    last_name: 'Developer',
    email: 'mike.developer@techcorp.com',
    job_title: 'Frontend Developer',
    department: 'Engineering',
    status: 'ACTIVE',
  });
  return { data: profile, status: 200, success: true };
};
mockApi.updateCurrentUser = async (updatedProfile) => {
  setPersisted('userProfile', updatedProfile);
  return { data: updatedProfile, status: 200, success: true };
};

// Preferences
mockApi.getPreferences = async (userId) => {
  const prefs = getPersisted('userPreferences', {
    theme: 'light',
    language: 'English',
    timezone: 'America/Los_Angeles',
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true
  });
  return { data: prefs, status: 200 };
};
mockApi.savePreferences = async (userId, preferences) => {
  setPersisted('userPreferences', preferences);
  return { status: 200, data: { success: true } };
};

// Legal Entities
mockApi.getLegalEntities = async (tenantId) => {
  const key = `legalEntities_${tenantId}`;
  const entities = getPersisted(key, []);
  return { data: entities, status: 200 };
};
mockApi.createLegalEntity = async (tenantId, entityData) => {
  const key = `legalEntities_${tenantId}`;
  const entities = getPersisted(key, []);
  const newEntity = { ...entityData, id: Date.now(), status: 'ACTIVE' };
  const updated = [...entities, newEntity];
  setPersisted(key, updated);
  return { data: newEntity, status: 200 };
};
mockApi.updateLegalEntity = async (entityId, entityData) => {
  // Find the correct tenant key
  const allKeys = Object.keys(localStorage).filter(k => k.startsWith('legalEntities_'));
  for (const key of allKeys) {
    const entities = getPersisted(key, []);
    const idx = entities.findIndex(e => e.id === entityId);
    if (idx !== -1) {
      entities[idx] = { ...entities[idx], ...entityData };
      setPersisted(key, entities);
      return { data: entities[idx], status: 200 };
    }
  }
  return { status: 404 };
};