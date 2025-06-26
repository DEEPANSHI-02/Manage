// src/services/tenantApiService.js
import { mockApi } from './mockApi';

/**
 * Comprehensive Tenant API Service
 * Handles complete tenant setup including organizations, users, roles, and settings
 */
class TenantApiService {
  
  /**
   * Create a complete tenant setup from onboarding wizard data
   * @param {Object} tenantData - Complete tenant data from wizard
   * @returns {Promise<Object>} Created tenant with all associated entities
   */
  async createCompleteTenant(tenantData) {
    try {
      // Step 1: Create the main tenant
      const tenant = await this.createTenant(tenantData.tenant);
      
      // Step 2: Create organizations within the tenant
      const organizations = await this.createOrganizations(tenant.id, tenantData.organizations);
      
      // Step 3: Create roles for the tenant
      const roles = await this.createRoles(tenant.id, tenantData.roles);
      
      // Step 4: Create users and assign to organizations/roles
      const users = await this.createUsers(tenant.id, tenantData.users, organizations, roles);
      
      // Step 5: Apply tenant settings
      const settings = await this.applyTenantSettings(tenant.id, tenantData.settings);
      
      // Step 6: Create audit log entry
      await this.createAuditLogEntry(tenant.id, 'tenant_created', {
        tenant_name: tenant.name,
        organizations_count: organizations.length,
        users_count: users.length,
        roles_count: roles.filter(r => r.selected).length
      });
      
      return {
        tenant,
        organizations,
        users,
        roles: roles.filter(r => r.selected),
        settings,
        summary: {
          tenant_id: tenant.id,
          tenant_name: tenant.name,
          total_organizations: organizations.length,
          total_users: users.length,
          total_roles: roles.filter(r => r.selected).length,
          setup_completed_at: new Date().toISOString()
        }
      };
      
    } catch (error) {
      console.error('Error in createCompleteTenant:', error);
      throw new Error(`Failed to create tenant: ${error.message}`);
    }
  }

  /**
   * Create the main tenant entity
   */
  async createTenant(tenantData) {
    const tenant = {
      id: `tenant_${Date.now()}`,
      name: tenantData.name,
      industry: tenantData.industry,
      description: tenantData.description,
      email: tenantData.email,
      phone: tenantData.phone,
      website: tenantData.website,
      active: true,
      plan: 'Standard', // Default plan
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'active',
      onboarding_completed: true
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return tenant;
  }

  /**
   * Create organizations for the tenant
   */
  async createOrganizations(tenantId, organizationsData) {
    const createdOrganizations = [];
    
    for (const orgData of organizationsData) {
      const organization = {
        id: `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenant_id: tenantId,
        name: orgData.name,
        industry: orgData.industry,
        description: orgData.description,
        email: orgData.email,
        parent_id: orgData.parent_id,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_count: 0 // Will be updated when users are created
      };
      
      createdOrganizations.push(organization);
      
      // Small delay between creations
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return createdOrganizations;
  }

  /**
   * Create roles for the tenant
   */
  async createRoles(tenantId, rolesData) {
    const createdRoles = [];
    
    for (const roleData of rolesData) {
      if (roleData.selected) {
        const role = {
          id: `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tenant_id: tenantId,
          name: roleData.name,
          description: roleData.description,
          custom: roleData.custom || false,
          permissions: this.getDefaultPermissions(roleData.name),
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_count: 0
        };
        
        createdRoles.push({ ...roleData, ...role });
      } else {
        createdRoles.push(roleData);
      }
      
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return createdRoles;
  }

  /**
   * Create users and assign them to organizations and roles
   */
  async createUsers(tenantId, usersData, organizations, roles) {
    const createdUsers = [];
    
    for (const userData of usersData) {
      // Find organization if specified
      const organization = organizations.find(org => org.id === userData.organization_id);
      
      // Find appropriate role
      const userRole = roles.find(role => 
        role.selected && (
          (userData.is_admin && role.name === 'Administrator') ||
          (!userData.is_admin && role.name !== 'Administrator')
        )
      ) || roles.find(role => role.selected);

      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenant_id: tenantId,
        organization_id: organization?.id || null,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        job_title: userData.job_title,
        phone: userData.phone || '',
        role_id: userRole?.id || null,
        role_name: userRole?.name || 'User',
        is_admin: userData.is_admin,
        active: true,
        email_verified: true,
        password_reset_required: false,
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Don't store actual passwords - this would be handled securely by auth service
        password_set: true
      };
      
      createdUsers.push(user);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return createdUsers;
  }

  /**
   * Apply tenant settings and preferences
   */
  async applyTenantSettings(tenantId, settingsData) {
    const tenantSettings = {
      tenant_id: tenantId,
      general: {
        theme: settingsData.theme,
        language: settingsData.language,
        timezone: settingsData.timezone,
        notifications: settingsData.notifications
      },
      security: {
        password_policy: settingsData.security.password_policy,
        session_timeout: settingsData.security.session_timeout,
        two_factor_required: settingsData.security.two_factor_required
      },
      features: {
        advanced_analytics: true,
        bulk_operations: true,
        api_access: true,
        custom_integrations: false
      },
      applied_at: new Date().toISOString()
    };

    await new Promise(resolve => setTimeout(resolve, 200));
    
    return tenantSettings;
  }

  /**
   * Create audit log entry for tenant creation
   */
  async createAuditLogEntry(tenantId, action, details) {
    const auditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      tenant_id: tenantId,
      action: action,
      actor: 'System Administrator',
      actor_type: 'system_admin',
      resource_type: 'tenant',
      resource_id: tenantId,
      details: details,
      ip_address: '0.0.0.0', // Would be actual IP in real implementation
      user_agent: 'Tenant Onboarding Wizard',
      timestamp: new Date().toISOString()
    };

    // In real implementation, this would be sent to audit service
    console.log('Audit Log Entry:', auditEntry);
    
    return auditEntry;
  }

  /**
   * Get default permissions for a role
   */
  getDefaultPermissions(roleName) {
    const permissionSets = {
      'Administrator': [
        'user.create', 'user.read', 'user.update', 'user.delete',
        'role.create', 'role.read', 'role.update', 'role.delete',
        'organization.create', 'organization.read', 'organization.update', 'organization.delete',
        'tenant.read', 'tenant.update',
        'settings.read', 'settings.update',
        'reports.read', 'reports.create'
      ],
      'Manager': [
        'user.read', 'user.update',
        'role.read',
        'organization.read', 'organization.update',
        'reports.read'
      ],
      'User': [
        'user.read',
        'organization.read'
      ],
      'HR Specialist': [
        'user.create', 'user.read', 'user.update',
        'role.read',
        'organization.read',
        'reports.read'
      ],
      'Developer': [
        'user.read',
        'organization.read',
        'api.read'
      ]
    };

    return permissionSets[roleName] || permissionSets['User'];
  }

  /**
   * Validate tenant data before creation
   */
  validateTenantData(tenantData) {
    const errors = [];

    // Validate tenant info
    if (!tenantData.tenant?.name) {
      errors.push('Tenant name is required');
    }
    if (!tenantData.tenant?.industry) {
      errors.push('Tenant industry is required');
    }
    if (!tenantData.tenant?.email) {
      errors.push('Tenant email is required');
    }

    // Validate organizations
    if (!tenantData.organizations || tenantData.organizations.length === 0) {
      errors.push('At least one organization is required');
    } else {
      tenantData.organizations.forEach((org, index) => {
        if (!org.name) {
          errors.push(`Organization ${index + 1} name is required`);
        }
        if (!org.email) {
          errors.push(`Organization ${index + 1} email is required`);
        }
      });
    }

    // Validate users
    if (!tenantData.users || tenantData.users.length === 0) {
      errors.push('At least one user is required');
    } else {
      tenantData.users.forEach((user, index) => {
        if (!user.first_name) {
          errors.push(`User ${index + 1} first name is required`);
        }
        if (!user.last_name) {
          errors.push(`User ${index + 1} last name is required`);
        }
        if (!user.email) {
          errors.push(`User ${index + 1} email is required`);
        }
        if (!user.password) {
          errors.push(`User ${index + 1} password is required`);
        }
      });
    }

    // Validate roles
    const selectedRoles = tenantData.roles?.filter(role => role.selected) || [];
    if (selectedRoles.length === 0) {
      errors.push('At least one role must be selected');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get tenant setup progress
   */
  async getTenantSetupProgress(tenantId) {
    // In real implementation, this would query the database
    const progress = {
      tenant_id: tenantId,
      steps: {
        tenant_created: true,
        organizations_created: true,
        users_created: true,
        roles_assigned: true,
        settings_applied: true
      },
      completion_percentage: 100,
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      status: 'completed'
    };

    return progress;
  }

  /**
   * Update tenant after creation
   */
  async updateTenant(tenantId, updates) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const updatedTenant = {
      id: tenantId,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await this.createAuditLogEntry(tenantId, 'tenant_updated', {
      updated_fields: Object.keys(updates),
      tenant_id: tenantId
    });

    return updatedTenant;
  }

  /**
   * Delete tenant and all associated data
   */
  async deleteTenant(tenantId) {
    try {
      // In real implementation, this would:
      // 1. Delete all users
      // 2. Delete all organizations
      // 3. Delete all roles
      // 4. Delete tenant settings
      // 5. Create audit log
      // 6. Delete the tenant

      await this.createAuditLogEntry(tenantId, 'tenant_deleted', {
        tenant_id: tenantId,
        deleted_at: new Date().toISOString()
      });

      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true, message: 'Tenant deleted successfully' };
      
    } catch (error) {
      throw new Error(`Failed to delete tenant: ${error.message}`);
    }
  }

  /**
   * Activate/Deactivate tenant
   */
  async toggleTenantStatus(tenantId, active = true) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    await this.createAuditLogEntry(tenantId, active ? 'tenant_activated' : 'tenant_deactivated', {
      tenant_id: tenantId,
      new_status: active ? 'active' : 'inactive'
    });

    return {
      tenant_id: tenantId,
      active,
      updated_at: new Date().toISOString()
    };
  }

  /**
   * Get tenant statistics
   */
  async getTenantStats() {
    // Mock implementation - would be real API calls
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      total_tenants: 4,
      active_tenants: 3,
      inactive_tenants: 1,
      total_users: 361,
      total_organizations: 15,
      total_roles: 12,
      avg_users_per_tenant: 90,
      latest_tenant_created: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      growth_rate: 12.5 // percentage
    };
  }

  /**
   * Generate tenant setup report
   */
  async generateSetupReport(tenantId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return {
      tenant_id: tenantId,
      report_type: 'setup_summary',
      generated_at: new Date().toISOString(),
      data: {
        setup_duration: '5 minutes',
        steps_completed: 5,
        total_steps: 5,
        success_rate: '100%',
        components_created: {
          organizations: 2,
          users: 3,
          roles: 3,
          settings_configured: true
        }
      }
    };
  }
}

// Export singleton instance
export const tenantApiService = new TenantApiService();
export default tenantApiService;