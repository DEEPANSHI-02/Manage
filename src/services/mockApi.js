// src/services/mockApi.js - CORRECT STRUCTURE
import { mockData } from './mockData';

class CompleteMockApiService {
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
    await this.delay();
    
    const { email, password } = credentials;
    const user = mockData.users.find(u => u.email === email && u.password === password);
    
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
      throw new Error('User not authenticated');
    }
    
    return {
      success: true,
      data: {
        ...this.currentUser,
        roles: mockData.userRoles.filter(ur => ur.user_id === this.currentUser.id)
          .map(ur => mockData.roles.find(r => r.id === ur.role_id))
          .filter(Boolean),
        privileges: []
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

  // ==================== ORGANIZATION MANAGEMENT APIs ====================
  async getOrganizations(tenantId, filters = {}) {
    await this.delay();
    
    let organizations = mockData.organizations.filter(org => org.tenant_id === tenantId);
    
    if (filters.name) {
      organizations = organizations.filter(org => 
        org.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: organizations,
      message: 'Organizations retrieved successfully',
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

  // ==================== OTHER EXISTING METHODS ====================
  // Include all your existing methods from the original mockApi.js
  // (getTenants, createTenant, createOrganization, etc.)
  
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

  async createOrganization(tenantId, orgData) {
    await this.delay();
    
    const newOrganization = {
      id: this.generateId(),
      tenant_id: tenantId,
      ...orgData,
      active: true,
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

  async getUsers(tenantId, filters = {}) {
    await this.delay();
    
    let users = mockData.users.filter(user => user.tenant_id === tenantId);
    
    if (filters.email) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    return {
      success: true,
      data: users.map(user => ({ ...user, password: undefined })),
      message: 'Users retrieved successfully',
      trace_id: this.generateId()
    };
  }

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
}

// Export BOTH for backward compatibility
export const mockApi = new CompleteMockApiService();
export const completeMockApi = new CompleteMockApiService();

// Default export
export default new CompleteMockApiService();