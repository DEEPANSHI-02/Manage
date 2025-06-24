import { mockData } from './mockData';

/**
 * Mock API Service
 * Simulates real API calls with realistic delays and responses
 */
class MockApiService {
  constructor() {
    this.baseDelay = 800; // Base delay for API calls
    this.currentUser = null;
  }

  /**
   * Simulate network delay
   */
  delay(ms = this.baseDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Generate UUID
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Authentication API
   */
  async login(credentials) {
    await this.delay();
    
    const { email, password, tenant_id } = credentials;
    
    // Find user in mock data
    const user = mockData.users.find(u => 
      u.email === email && u.password === password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Check if tenant_id matches (if provided)
    if (tenant_id && user.tenant_id !== tenant_id) {
      throw new Error('Invalid tenant');
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

  /**
   * Get current user profile
   */
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
        privileges: [] // Will be populated based on roles
      },
      message: 'User profile retrieved',
      trace_id: this.generateId()
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    await this.delay();
    
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Update user in mock data
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

  /**
   * Tenant Management API
   */
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

  async getTenant(id) {
    await this.delay();
    
    const tenant = mockData.tenants.find(t => t.id === id);
    
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    
    return {
      success: true,
      data: tenant,
      message: 'Tenant retrieved successfully',
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

  /**
   * Organization Management API
   */
  async getOrganizations(tenantId, filters = {}) {
    await this.delay();
    
    let organizations = mockData.organizations.filter(org => org.tenant_id === tenantId);
    
    // Apply filters
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

  /**
   * User Management API
   */
  async getUsers(tenantId, filters = {}) {
    await this.delay();
    
    let users = mockData.users.filter(user => user.tenant_id === tenantId);
    
    // Apply filters
    if (filters.email) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    if (filters.active !== undefined) {
      users = users.filter(user => user.active === filters.active);
    }
    
    return {
      success: true,
      data: users.map(user => ({
        ...user,
        password: undefined // Don't return passwords
      })),
      message: 'Users retrieved successfully',
      trace_id: this.generateId()
    };
  }

  async createUser(tenantId, userData) {
    await this.delay();
    
    // Check if email already exists
    const existingUser = mockData.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }
    
    const newUser = {
      id: this.generateId(),
      tenant_id: tenantId,
      ...userData,
      password: 'password123', // Default password
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockData.users.push(newUser);
    
    return {
      success: true,
      data: {
        ...newUser,
        password: undefined
      },
      message: 'User created successfully',
      trace_id: this.generateId()
    };
  }

  /**
   * Role Management API
   */
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

  async createRole(tenantId, roleData) {
    await this.delay();
    
    const newRole = {
      id: this.generateId(),
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

  /**
   * Privilege Management API
   */
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

  /**
   * Legal Entity Management API
   */
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
}

// Export singleton instance
export const mockApi = new MockApiService();