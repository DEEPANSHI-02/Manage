// ==================== ENHANCED MOCK API SERVICE ====================
// src/services/systemAdminMockApi.js

class SystemAdminMockApiService {
  constructor() {
    this.baseDelay = 500;
    
    // Enhanced system data with more comprehensive information
    this.systemData = {
      // Global tenant data
      globalTenants: [
        {
          id: 'tenant-1',
          name: 'TechCorp Solutions',
          industry: 'Technology',
          employees: 250,
          status: 'active',
          region: 'US-West',
          plan: 'Enterprise',
          monthlyRevenue: 125000,
          createdAt: '2024-01-15',
          lastActivity: '2024-06-26T10:30:00Z',
          features: ['API Access', 'Advanced Analytics', 'Custom Integrations'],
          contactEmail: 'admin@techcorp.com',
          contactPhone: '+1-555-0123'
        },
        {
          id: 'tenant-2',
          name: 'Global Enterprises',
          industry: 'Consulting',
          employees: 500,
          status: 'active',
          region: 'US-East',
          plan: 'Professional',
          monthlyRevenue: 85000,
          createdAt: '2024-02-01',
          lastActivity: '2024-06-26T09:15:00Z',
          features: ['Team Collaboration', 'Reporting Suite'],
          contactEmail: 'contact@globalent.com',
          contactPhone: '+1-555-0456'
        },
        {
          id: 'tenant-3',
          name: 'Innovation Hub',
          industry: 'Startup Accelerator',
          employees: 45,
          status: 'trial',
          region: 'US-West',
          plan: 'Startup',
          monthlyRevenue: 12000,
          createdAt: '2024-03-10',
          lastActivity: '2024-06-26T08:45:00Z',
          features: ['Basic Features'],
          contactEmail: 'hello@innovationhub.com',
          contactPhone: '+1-555-0789'
        }
      ],

      // Global users across all tenants
      globalUsers: [
        {
          id: 'user-1',
          name: 'John Administrator',
          email: 'admin@techcorp.com',
          tenantId: 'tenant-1',
          tenantName: 'TechCorp Solutions',
          role: 'System Administrator',
          status: 'active',
          lastLogin: '2024-06-26T10:30:00Z',
          department: 'IT Operations',
          location: 'San Francisco, CA',
          joinDate: '2024-01-15'
        },
        {
          id: 'user-2',
          name: 'Sarah Johnson',
          email: 'sarah.manager@techcorp.com',
          tenantId: 'tenant-1',
          tenantName: 'TechCorp Solutions',
          role: 'Manager',
          status: 'active',
          lastLogin: '2024-06-26T09:45:00Z',
          department: 'Engineering',
          location: 'San Francisco, CA',
          joinDate: '2024-01-20'
        },
        {
          id: 'user-3',
          name: 'Mike Chen',
          email: 'mike.dev@techcorp.com',
          tenantId: 'tenant-1',
          tenantName: 'TechCorp Solutions',
          role: 'Developer',
          status: 'active',
          lastLogin: '2024-06-26T08:30:00Z',
          department: 'Engineering',
          location: 'San Jose, CA',
          joinDate: '2024-02-01'
        },
        {
          id: 'user-4',
          name: 'David Williams',
          email: 'david@globalent.com',
          tenantId: 'tenant-2',
          tenantName: 'Global Enterprises',
          role: 'Consultant',
          status: 'active',
          lastLogin: '2024-06-26T07:15:00Z',
          department: 'Consulting',
          location: 'New York, NY',
          joinDate: '2024-02-15'
        },
        {
          id: 'user-5',
          name: 'Lisa Rodriguez',
          email: 'lisa@innovationhub.com',
          tenantId: 'tenant-3',
          tenantName: 'Innovation Hub',
          role: 'Program Manager',
          status: 'inactive',
          lastLogin: '2024-06-25T16:20:00Z',
          department: 'Operations',
          location: 'Austin, TX',
          joinDate: '2024-03-20'
        }
      ],

      // System organizations across tenants
      globalOrganizations: [
        {
          id: 'org-1',
          name: 'Engineering Division',
          tenantId: 'tenant-1',
          tenantName: 'TechCorp Solutions',
          type: 'Division',
          employees: 120,
          manager: 'Sarah Johnson',
          budget: 2500000,
          status: 'active'
        },
        {
          id: 'org-2',
          name: 'Sales & Marketing',
          tenantId: 'tenant-1',
          tenantName: 'TechCorp Solutions',
          type: 'Department',
          employees: 80,
          manager: 'Mike Peterson',
          budget: 1800000,
          status: 'active'
        },
        {
          id: 'org-3',
          name: 'Strategic Consulting',
          tenantId: 'tenant-2',
          tenantName: 'Global Enterprises',
          type: 'Division',
          employees: 200,
          manager: 'David Williams',
          budget: 3200000,
          status: 'active'
        },
        {
          id: 'org-4',
          name: 'Accelerator Program',
          tenantId: 'tenant-3',
          tenantName: 'Innovation Hub',
          type: 'Program',
          employees: 30,
          manager: 'Lisa Rodriguez',
          budget: 500000,
          status: 'active'
        }
      ],

      // System monitoring data
      systemServices: [
        {
          id: 'auth-service',
          name: 'Authentication Service',
          status: 'healthy',
          uptime: 99.9,
          responseTime: 45,
          lastCheck: '2024-06-26T10:30:00Z',
          endpoint: 'https://auth.api.system.com',
          version: '2.1.3',
          instances: 4,
          cpu: 25,
          memory: 68,
          requests24h: 125000
        },
        {
          id: 'user-api',
          name: 'User Management API',
          status: 'healthy',
          uptime: 99.8,
          responseTime: 67,
          lastCheck: '2024-06-26T10:29:00Z',
          endpoint: 'https://users.api.system.com',
          version: '1.8.2',
          instances: 3,
          cpu: 42,
          memory: 73,
          requests24h: 89000
        },
        {
          id: 'database',
          name: 'Database Cluster',
          status: 'warning',
          uptime: 99.5,
          responseTime: 120,
          lastCheck: '2024-06-26T10:28:00Z',
          endpoint: 'db-cluster.internal.com',
          version: 'PostgreSQL 14.2',
          instances: 6,
          cpu: 78,
          memory: 85,
          requests24h: 450000
        },
        {
          id: 'storage',
          name: 'File Storage',
          status: 'healthy',
          uptime: 100,
          responseTime: 23,
          lastCheck: '2024-06-26T10:30:00Z',
          endpoint: 'https://storage.system.com',
          version: '3.4.1',
          instances: 8,
          cpu: 15,
          memory: 45,
          requests24h: 67000
        },
        {
          id: 'notifications',
          name: 'Notification Service',
          status: 'healthy',
          uptime: 99.7,
          responseTime: 89,
          lastCheck: '2024-06-26T10:29:00Z',
          endpoint: 'https://notify.system.com',
          version: '1.5.4',
          instances: 2,
          cpu: 33,
          memory: 52,
          requests24h: 34000
        }
      ],

      // API management data
      apiKeys: [
        {
          id: 'api-1',
          name: 'TechCorp Production',
          tenantId: 'tenant-1',
          tenantName: 'TechCorp Solutions',
          key: 'tc_live_abcd1234....',
          status: 'active',
          permissions: ['users:read', 'users:write', 'orgs:read'],
          requestsToday: 12547,
          requestsMonth: 387000,
          rateLimit: 10000,
          lastUsed: '2024-06-26T10:15:00Z',
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'api-2',
          name: 'Global Enterprises API',
          tenantId: 'tenant-2',
          tenantName: 'Global Enterprises',
          key: 'ge_live_efgh5678....',
          status: 'active',
          permissions: ['users:read', 'reports:read'],
          requestsToday: 8934,
          requestsMonth: 234000,
          rateLimit: 5000,
          lastUsed: '2024-06-26T09:30:00Z',
          createdAt: '2024-02-01T00:00:00Z'
        },
        {
          id: 'api-3',
          name: 'Innovation Hub Dev',
          tenantId: 'tenant-3',
          tenantName: 'Innovation Hub',
          key: 'ih_test_ijkl9012....',
          status: 'suspended',
          permissions: ['users:read'],
          requestsToday: 0,
          requestsMonth: 15000,
          rateLimit: 1000,
          lastUsed: '2024-06-24T14:22:00Z',
          createdAt: '2024-03-10T00:00:00Z'
        }
      ],

      // Security center data
      securityEvents: [
        {
          id: 'sec-1',
          type: 'failed_login',
          severity: 'medium',
          title: 'Multiple Failed Login Attempts',
          description: 'User attempted login 5 times with invalid credentials',
          userId: 'user-4',
          tenantId: 'tenant-2',
          ipAddress: '203.0.113.42',
          userAgent: 'Chrome 91.0.4472.124',
          timestamp: '2024-06-26T10:15:00Z',
          status: 'investigating'
        },
        {
          id: 'sec-2',
          type: 'suspicious_api',
          severity: 'high',
          title: 'Unusual API Activity',
          description: 'API requests from new geographic location',
          tenantId: 'tenant-1',
          ipAddress: '198.51.100.15',
          requestCount: 500,
          timestamp: '2024-06-26T09:45:00Z',
          status: 'resolved'
        },
        {
          id: 'sec-3',
          type: 'privilege_escalation',
          severity: 'critical',
          title: 'Privilege Escalation Attempt',
          description: 'User attempted to access admin-only endpoints',
          userId: 'user-3',
          tenantId: 'tenant-1',
          endpoint: '/admin/system/config',
          timestamp: '2024-06-26T08:30:00Z',
          status: 'blocked'
        }
      ],

      // System configuration
      systemConfig: {
        general: {
          systemName: 'Enterprise User Management System',
          version: '2.4.1',
          environment: 'Production',
          region: 'us-west-2',
          timezone: 'UTC',
          maintenanceWindow: '02:00-04:00 UTC Sunday'
        },
        security: {
          sessionTimeout: 3600,
          maxLoginAttempts: 5,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSymbols: true,
            expiryDays: 90
          },
          twoFactorRequired: false,
          ipWhitelisting: false
        },
        performance: {
          rateLimiting: true,
          cacheEnabled: true,
          compressionEnabled: true,
          cdnEnabled: true,
          maxRequestSize: '10MB',
          timeoutSettings: {
            api: 30000,
            database: 10000,
            external: 60000
          }
        },
        features: {
          auditLogging: true,
          realTimeNotifications: true,
          advancedAnalytics: true,
          bulkOperations: true,
          apiAccess: true,
          customIntegrations: true
        }
      },

      // Global reports data
      reportsData: {
        tenantGrowth: [
          { month: 'Jan', tenants: 2, users: 180, revenue: 85000 },
          { month: 'Feb', tenants: 2, users: 220, revenue: 95000 },
          { month: 'Mar', tenants: 3, users: 250, revenue: 110000 },
          { month: 'Apr', tenants: 3, users: 290, revenue: 125000 },
          { month: 'May', tenants: 3, users: 320, revenue: 140000 },
          { month: 'Jun', tenants: 3, users: 350, revenue: 155000 }
        ],
        systemUsage: [
          { service: 'Authentication', requests: 125000, errors: 25, uptime: 99.9 },
          { service: 'User Management', requests: 89000, errors: 12, uptime: 99.8 },
          { service: 'Organizations', requests: 45000, errors: 8, uptime: 99.7 },
          { service: 'Reporting', requests: 23000, errors: 3, uptime: 99.9 },
          { service: 'API Gateway', requests: 450000, errors: 180, uptime: 99.5 }
        ],
        securityMetrics: {
          totalEvents: 1247,
          criticalEvents: 3,
          resolvedEvents: 1190,
          avgResolutionTime: '4.2 hours',
          topThreats: [
            { type: 'Failed Logins', count: 456 },
            { type: 'Suspicious API', count: 234 },
            { type: 'Privilege Escalation', count: 12 }
          ]
        }
      }
    };
  }

  delay(ms = this.baseDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==================== GLOBAL TENANTS API ====================
  async getGlobalTenants(filters = {}) {
    await this.delay();
    let tenants = [...this.systemData.globalTenants];
    
    if (filters.status) {
      tenants = tenants.filter(t => t.status === filters.status);
    }
    if (filters.region) {
      tenants = tenants.filter(t => t.region === filters.region);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      tenants = tenants.filter(t => 
        t.name.toLowerCase().includes(search) ||
        t.industry.toLowerCase().includes(search)
      );
    }
    
    return {
      success: true,
      data: tenants,
      total: tenants.length,
      message: 'Global tenants retrieved successfully'
    };
  }

  async createTenant(tenantData) {
    await this.delay(800);
    const newTenant = {
      id: `tenant-${Date.now()}`,
      ...tenantData,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    this.systemData.globalTenants.push(newTenant);
    
    return {
      success: true,
      data: newTenant,
      message: 'Tenant created successfully'
    };
  }

  async updateTenant(tenantId, updates) {
    await this.delay(600);
    const index = this.systemData.globalTenants.findIndex(t => t.id === tenantId);
    
    if (index === -1) {
      throw new Error('Tenant not found');
    }
    
    this.systemData.globalTenants[index] = {
      ...this.systemData.globalTenants[index],
      ...updates,
      lastActivity: new Date().toISOString()
    };
    
    return {
      success: true,
      data: this.systemData.globalTenants[index],
      message: 'Tenant updated successfully'
    };
  }

  async deleteTenant(tenantId) {
    await this.delay(400);
    const index = this.systemData.globalTenants.findIndex(t => t.id === tenantId);
    
    if (index === -1) {
      throw new Error('Tenant not found');
    }
    
    this.systemData.globalTenants.splice(index, 1);
    
    return {
      success: true,
      message: 'Tenant deleted successfully'
    };
  }

  // ==================== SYSTEM USERS API ====================
  async getSystemUsers(filters = {}) {
    await this.delay();
    let users = [...this.systemData.globalUsers];
    
    if (filters.tenantId) {
      users = users.filter(u => u.tenantId === filters.tenantId);
    }
    if (filters.status) {
      users = users.filter(u => u.status === filters.status);
    }
    if (filters.role) {
      users = users.filter(u => u.role.toLowerCase().includes(filters.role.toLowerCase()));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.department.toLowerCase().includes(search)
      );
    }
    
    return {
      success: true,
      data: users,
      total: users.length,
      message: 'System users retrieved successfully'
    };
  }

  async impersonateUser(userId) {
    await this.delay();
    const user = this.systemData.globalUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      data: {
        sessionToken: `impersonate_${userId}_${Date.now()}`,
        user: user,
        expiresIn: 3600
      },
      message: `Impersonation session started for ${user.name}`
    };
  }

  async resetUserPassword(userId) {
    await this.delay();
    const user = this.systemData.globalUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      data: {
        temporaryPassword: 'TempPass123!',
        resetToken: `reset_${userId}_${Date.now()}`,
        expiresIn: 3600
      },
      message: `Password reset for ${user.name}`
    };
  }

  // ==================== GLOBAL ORGANIZATIONS API ====================
  async getGlobalOrganizations(filters = {}) {
    await this.delay();
    let organizations = [...this.systemData.globalOrganizations];
    
    if (filters.tenantId) {
      organizations = organizations.filter(o => o.tenantId === filters.tenantId);
    }
    if (filters.type) {
      organizations = organizations.filter(o => o.type === filters.type);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      organizations = organizations.filter(o => 
        o.name.toLowerCase().includes(search) ||
        o.manager.toLowerCase().includes(search)
      );
    }
    
    return {
      success: true,
      data: organizations,
      total: organizations.length,
      message: 'Global organizations retrieved successfully'
    };
  }

  // ==================== SYSTEM MONITORING API ====================
  async getSystemServices() {
    await this.delay(300);
    
    // Simulate real-time updates
    const services = this.systemData.systemServices.map(service => ({
      ...service,
      lastCheck: new Date().toISOString(),
      responseTime: service.responseTime + Math.floor(Math.random() * 20) - 10,
      cpu: Math.max(0, Math.min(100, service.cpu + Math.floor(Math.random() * 10) - 5)),
      memory: Math.max(0, Math.min(100, service.memory + Math.floor(Math.random() * 8) - 4))
    }));
    
    return {
      success: true,
      data: services,
      message: 'System services status retrieved'
    };
  }

  async restartService(serviceId) {
    await this.delay(2000);
    const service = this.systemData.systemServices.find(s => s.id === serviceId);
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    // Simulate service restart
    service.status = 'healthy';
    service.uptime = 100;
    service.lastCheck = new Date().toISOString();
    
    return {
      success: true,
      message: `Service ${service.name} restarted successfully`
    };
  }

  // ==================== SYSTEM CONFIGURATION API ====================
  async getSystemConfiguration() {
    await this.delay();
    return {
      success: true,
      data: this.systemData.systemConfig,
      message: 'System configuration retrieved'
    };
  }

  async updateSystemConfiguration(section, updates) {
    await this.delay(800);
    
    if (!this.systemData.systemConfig[section]) {
      throw new Error('Configuration section not found');
    }
    
    this.systemData.systemConfig[section] = {
      ...this.systemData.systemConfig[section],
      ...updates
    };
    
    return {
      success: true,
      data: this.systemData.systemConfig[section],
      message: `${section} configuration updated successfully`
    };
  }

  // ==================== SECURITY CENTER API ====================
  async getSecurityEvents(filters = {}) {
    await this.delay();
    let events = [...this.systemData.securityEvents];
    
    if (filters.severity) {
      events = events.filter(e => e.severity === filters.severity);
    }
    if (filters.type) {
      events = events.filter(e => e.type === filters.type);
    }
    if (filters.status) {
      events = events.filter(e => e.status === filters.status);
    }
    
    return {
      success: true,
      data: events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
      total: events.length,
      message: 'Security events retrieved successfully'
    };
  }

  async resolveSecurityEvent(eventId, resolution) {
    await this.delay();
    const event = this.systemData.securityEvents.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Security event not found');
    }
    
    event.status = 'resolved';
    event.resolution = resolution;
    event.resolvedAt = new Date().toISOString();
    
    return {
      success: true,
      data: event,
      message: 'Security event resolved successfully'
    };
  }

  // ==================== API MANAGEMENT API ====================
  async getApiKeys(filters = {}) {
    await this.delay();
    let apiKeys = [...this.systemData.apiKeys];
    
    if (filters.tenantId) {
      apiKeys = apiKeys.filter(k => k.tenantId === filters.tenantId);
    }
    if (filters.status) {
      apiKeys = apiKeys.filter(k => k.status === filters.status);
    }
    
    return {
      success: true,
      data: apiKeys,
      total: apiKeys.length,
      message: 'API keys retrieved successfully'
    };
  }

  async suspendApiKey(keyId) {
    await this.delay();
    const apiKey = this.systemData.apiKeys.find(k => k.id === keyId);
    
    if (!apiKey) {
      throw new Error('API key not found');
    }
    
    apiKey.status = 'suspended';
    
    return {
      success: true,
      data: apiKey,
      message: 'API key suspended successfully'
    };
  }

  async activateApiKey(keyId) {
    await this.delay();
    const apiKey = this.systemData.apiKeys.find(k => k.id === keyId);
    
    if (!apiKey) {
      throw new Error('API key not found');
    }
    
    apiKey.status = 'active';
    
    return {
      success: true,
      data: apiKey,
      message: 'API key activated successfully'
    };
  }

  // ==================== GLOBAL REPORTS API ====================
  async getGlobalReports(reportType) {
    await this.delay(1000);
    
    const reportData = {
      tenant_growth: this.systemData.reportsData.tenantGrowth,
      system_usage: this.systemData.reportsData.systemUsage,
      security_metrics: this.systemData.reportsData.securityMetrics
    };
    
    return {
      success: true,
      data: reportData[reportType] || reportData,
      message: 'Report data retrieved successfully'
    };
  }

  async generateReport(reportType, parameters) {
    await this.delay(2000);
    
    return {
      success: true,
      data: {
        reportId: `report_${Date.now()}`,
        type: reportType,
        parameters,
        status: 'completed',
        downloadUrl: `/api/reports/download/report_${Date.now()}.pdf`,
        generatedAt: new Date().toISOString()
      },
      message: 'Report generated successfully'
    };
  }

  // ==================== API MANAGEMENT CRUD ====================
  async getApis() {
    await this.delay();
    return {
      success: true,
      data: this.systemData.apis || [],
      message: 'APIs retrieved successfully'
    };
  }

  async createApi(apiData) {
    await this.delay();
    if (!this.systemData.apis) this.systemData.apis = [];
    const newApi = { ...apiData, id: 'api_' + Date.now() };
    this.systemData.apis.push(newApi);
    return {
      success: true,
      data: newApi,
      message: 'API created successfully'
    };
  }

  async updateApi(apiId, updates) {
    await this.delay();
    if (!this.systemData.apis) this.systemData.apis = [];
    const idx = this.systemData.apis.findIndex(a => a.id === apiId);
    if (idx === -1) throw new Error('API not found');
    this.systemData.apis[idx] = { ...this.systemData.apis[idx], ...updates };
    return {
      success: true,
      data: this.systemData.apis[idx],
      message: 'API updated successfully'
    };
  }

  async deleteApi(apiId) {
    await this.delay();
    if (!this.systemData.apis) this.systemData.apis = [];
    const idx = this.systemData.apis.findIndex(a => a.id === apiId);
    if (idx === -1) throw new Error('API not found');
    const deleted = this.systemData.apis.splice(idx, 1)[0];
    return {
      success: true,
      data: deleted,
      message: 'API deleted successfully'
    };
  }

  // ==================== GLOBAL REPORTS LIST ====================
  async listReports(filter = '') {
    await this.delay();
    if (!this.systemData.globalReports) this.systemData.globalReports = [
      { id: 'report-1', name: 'Tenant Growth', type: 'tenant_growth', createdAt: new Date(), description: 'Monthly tenant growth', data: { tenants: 3, users: 350 } },
      { id: 'report-2', name: 'System Usage', type: 'system_usage', createdAt: new Date(), description: 'System usage stats', data: { requests: 450000, errors: 180 } }
    ];
    let reports = this.systemData.globalReports;
    if (filter) reports = reports.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()));
    return {
      success: true,
      data: reports,
      message: 'Reports retrieved successfully'
    };
  }
}

// Create and export the service instance
const systemAdminMockApi = new SystemAdminMockApiService();
export default systemAdminMockApi;