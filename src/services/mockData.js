/**
 * Complete Mock Data for User Management System
 * Contains realistic sample data for all entities with proper relationships
 */

// Utility function to generate consistent UUIDs
const generateId = (prefix = '') => 
  `${prefix}${Math.random().toString(36).substr(2, 9)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 4)}-${Math.random().toString(36).substr(2, 12)}`;

// Pre-defined IDs for consistent relationships
const TENANT_1_ID = 'tenant-tech-corp-2024-001';
const TENANT_2_ID = 'tenant-global-ent-2024-002';
const TENANT_3_ID = 'tenant-startup-hub-2024-003';

const ORG_1_ID = 'org-engineering-div-001';
const ORG_2_ID = 'org-sales-marketing-002';
const ORG_3_ID = 'org-consulting-services-003';
const ORG_4_ID = 'org-hr-operations-004';
const ORG_5_ID = 'org-finance-admin-005';

const ROLE_ADMIN_ID = 'role-system-admin-001';
const ROLE_MANAGER_ID = 'role-manager-002';
const ROLE_USER_ID = 'role-standard-user-003';
const ROLE_VIEWER_ID = 'role-viewer-004';
const ROLE_HR_ID = 'role-hr-specialist-005';

const USER_1_ID = 'user-john-admin-001';
const USER_2_ID = 'user-sarah-manager-002';
const USER_3_ID = 'user-mike-dev-003';
const USER_4_ID = 'user-lisa-sales-004';
const USER_5_ID = 'user-david-consultant-005';
const USER_6_ID = 'user-emma-hr-006';

const PRIV_USER_CREATE = 'priv-user-create-001';
const PRIV_USER_READ = 'priv-user-read-002';
const PRIV_USER_UPDATE = 'priv-user-update-003';
const PRIV_USER_DELETE = 'priv-user-delete-004';
const PRIV_TENANT_MANAGE = 'priv-tenant-manage-005';
const PRIV_ROLE_MANAGE = 'priv-role-manage-006';
const PRIV_ORG_MANAGE = 'priv-org-manage-007';

export const mockData = {
  // ==================== TENANTS ====================
  tenants: [
    {
      id: TENANT_1_ID,
      name: "TechCorp Solutions",
      description: "Leading technology solutions provider specializing in enterprise software development and digital transformation",
      email: "admin@techcorp.com",
      phone: "+1-555-0123",
      website: "https://techcorp.com",
      logo_url: "https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=TC",
      industry: "Technology",
      annual_revenue: "$50M - $100M",
      employee_count: 250,
      active: true,
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: TENANT_2_ID,
      name: "Global Enterprises",
      description: "International business solutions and strategic consulting services for Fortune 500 companies",
      email: "contact@globalent.com",
      phone: "+1-555-0456",
      website: "https://globalent.com",
      logo_url: "https://via.placeholder.com/100x100/059669/FFFFFF?text=GE",
      industry: "Consulting",
      annual_revenue: "$100M+",
      employee_count: 500,
      active: true,
      created_at: "2024-02-01T09:15:00.000Z",
      updated_at: "2024-06-18T11:45:00.000Z"
    },
    {
      id: TENANT_3_ID,
      name: "Innovation Startup Hub",
      description: "Accelerating early-stage startups with mentorship, funding, and operational support",
      email: "hello@startupHub.com",
      phone: "+1-555-0789",
      website: "https://innovationstartup.com",
      logo_url: "https://via.placeholder.com/100x100/DC2626/FFFFFF?text=ISH",
      industry: "Venture Capital",
      annual_revenue: "$10M - $25M",
      employee_count: 45,
      active: true,
      created_at: "2024-03-10T10:00:00.000Z",
      updated_at: "2024-06-15T16:30:00.000Z"
    }
  ],

  // ==================== ORGANIZATIONS ====================
  organizations: [
    {
      id: ORG_1_ID,
      tenant_id: TENANT_1_ID,
      name: "Engineering Division",
      description: "Product development, software engineering, and technical innovation teams",
      organization_type: "DIVISION",
      email: "engineering@techcorp.com",
      phone: "+1-555-0123",
      website: "https://techcorp.com/engineering",
      logo_url: "https://via.placeholder.com/80x80/3B82F6/FFFFFF?text=ENG",
      industry: "Technology",
      annual_revenue: "$25M",
      employee_count: 120,
      active: true,
      organization_profile: "Leading engineering excellence through innovative solutions and cutting-edge technology",
      created_at: "2024-01-20T10:00:00.000Z",
      updated_at: "2024-06-15T16:30:00.000Z"
    },
    {
      id: ORG_2_ID,
      tenant_id: TENANT_1_ID,
      name: "Sales & Marketing",
      description: "Customer acquisition, revenue growth, and brand management division",
      organization_type: "DEPARTMENT",
      email: "sales@techcorp.com",
      phone: "+1-555-0124",
      website: "https://techcorp.com/sales",
      logo_url: "https://via.placeholder.com/80x80/10B981/FFFFFF?text=SM",
      industry: "Technology",
      annual_revenue: "$15M",
      employee_count: 80,
      active: true,
      organization_profile: "Driving growth through customer success and strategic market expansion",
      created_at: "2024-01-22T11:30:00.000Z",
      updated_at: "2024-06-12T09:15:00.000Z"
    },
    {
      id: ORG_3_ID,
      tenant_id: TENANT_2_ID,
      name: "Consulting Services",
      description: "Strategic consulting and advisory services for enterprise transformation",
      organization_type: "DIVISION",
      email: "consulting@globalent.com",
      phone: "+1-555-0457",
      website: "https://globalent.com/consulting",
      logo_url: "https://via.placeholder.com/80x80/8B5CF6/FFFFFF?text=CS",
      industry: "Consulting",
      annual_revenue: "$40M",
      employee_count: 200,
      active: true,
      organization_profile: "Strategic advisory and implementation services for digital transformation",
      created_at: "2024-02-05T14:00:00.000Z",
      updated_at: "2024-06-10T13:20:00.000Z"
    },
    {
      id: ORG_4_ID,
      tenant_id: TENANT_1_ID,
      name: "Human Resources",
      description: "Talent acquisition, employee development, and organizational culture",
      organization_type: "DEPARTMENT",
      email: "hr@techcorp.com",
      phone: "+1-555-0125",
      website: "https://techcorp.com/careers",
      logo_url: "https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=HR",
      industry: "Technology",
      annual_revenue: "$5M",
      employee_count: 25,
      active: true,
      organization_profile: "Building exceptional teams and fostering inclusive workplace culture",
      created_at: "2024-01-25T12:00:00.000Z",
      updated_at: "2024-06-08T14:45:00.000Z"
    },
    {
      id: ORG_5_ID,
      tenant_id: TENANT_3_ID,
      name: "Startup Acceleration Program",
      description: "Comprehensive startup support including mentorship, funding, and resources",
      organization_type: "PROGRAM",
      email: "accelerator@startupHub.com",
      phone: "+1-555-0790",
      website: "https://innovationstartup.com/accelerator",
      logo_url: "https://via.placeholder.com/80x80/EF4444/FFFFFF?text=SAP",
      industry: "Venture Capital",
      annual_revenue: "$8M",
      employee_count: 30,
      active: true,
      organization_profile: "Accelerating the next generation of innovative startups",
      created_at: "2024-03-15T09:30:00.000Z",
      updated_at: "2024-06-05T11:20:00.000Z"
    }
  ],

  // ==================== ROLES ====================
  roles: [
    {
      id: ROLE_ADMIN_ID,
      tenant_id: TENANT_1_ID,
      name: "System Administrator",
      description: "Full system access with all administrative privileges and user management capabilities",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: ROLE_MANAGER_ID,
      tenant_id: TENANT_1_ID,
      name: "Manager",
      description: "Management access with team oversight and moderate administrative privileges",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: ROLE_USER_ID,
      tenant_id: TENANT_1_ID,
      name: "Standard User",
      description: "Basic user access with standard functionality and limited administrative privileges",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: ROLE_VIEWER_ID,
      tenant_id: TENANT_1_ID,
      name: "Viewer",
      description: "Read-only access to system information with no modification privileges",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: ROLE_HR_ID,
      tenant_id: TENANT_1_ID,
      name: "HR Specialist",
      description: "Human resources focused role with employee management and organizational privileges",
      created_at: "2024-01-25T08:30:00.000Z",
      updated_at: "2024-06-18T10:15:00.000Z"
    }
  ],

  // ==================== PRIVILEGES ====================
  privileges: [
    {
      id: PRIV_USER_CREATE,
      tenant_id: TENANT_1_ID,
      name: "user.create",
      description: "Create new users and manage user accounts",
      category: "User Management",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: PRIV_USER_READ,
      tenant_id: TENANT_1_ID,
      name: "user.read",
      description: "View user information and profiles",
      category: "User Management",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: PRIV_USER_UPDATE,
      tenant_id: TENANT_1_ID,
      name: "user.update",
      description: "Update user information and modify profiles",
      category: "User Management",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: PRIV_USER_DELETE,
      tenant_id: TENANT_1_ID,
      name: "user.delete",
      description: "Delete users and deactivate accounts",
      category: "User Management",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: PRIV_TENANT_MANAGE,
      tenant_id: TENANT_1_ID,
      name: "tenant.manage",
      description: "Manage tenant settings and configurations",
      category: "Tenant Management",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: PRIV_ROLE_MANAGE,
      tenant_id: TENANT_1_ID,
      name: "role.manage",
      description: "Manage roles and assign permissions",
      category: "Role Management",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: PRIV_ORG_MANAGE,
      tenant_id: TENANT_1_ID,
      name: "organization.manage",
      description: "Manage organizational structures and hierarchies",
      category: "Organization Management",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: generateId('priv-'),
      tenant_id: TENANT_1_ID,
      name: "reports.view",
      description: "View system reports and analytics",
      category: "Reporting",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: generateId('priv-'),
      tenant_id: TENANT_1_ID,
      name: "audit.access",
      description: "Access audit logs and system monitoring",
      category: "Security",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: generateId('priv-'),
      tenant_id: TENANT_1_ID,
      name: "system.configure",
      description: "Configure system-wide settings and preferences",
      category: "System Administration",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    }
  ],

  // ==================== USERS ====================
  users: [
    {
      id: USER_1_ID,
      tenant_id: TENANT_1_ID,
      organization_id: ORG_1_ID,
      email: "admin@techcorp.com",
      password: "admin123", // In real app, this would be hashed
      first_name: "John",
      last_name: "Administrator",
      phone: "+1-555-0100",
      job_title: "System Administrator",
      department: "IT Operations",
      active: true,
      last_login: "2024-06-24T09:30:00.000Z",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: USER_2_ID,
      tenant_id: TENANT_1_ID,
      organization_id: ORG_1_ID,
      email: "sarah.manager@techcorp.com",
      password: "manager123",
      first_name: "Sarah",
      last_name: "Johnson",
      phone: "+1-555-0101",
      job_title: "Engineering Manager",
      department: "Software Development",
      active: true,
      last_login: "2024-06-24T08:15:00.000Z",
      created_at: "2024-01-20T09:15:00.000Z",
      updated_at: "2024-06-18T10:30:00.000Z"
    },
    {
      id: USER_3_ID,
      tenant_id: TENANT_1_ID,
      organization_id: ORG_1_ID,
      email: "mike.developer@techcorp.com",
      password: "user123",
      first_name: "Mike",
      last_name: "Chen",
      phone: "+1-555-0102",
      job_title: "Senior Software Developer",
      department: "Product Engineering",
      active: true,
      last_login: "2024-06-24T07:45:00.000Z",
      created_at: "2024-02-01T10:00:00.000Z",
      updated_at: "2024-06-15T14:45:00.000Z"
    },
    {
      id: USER_4_ID,
      tenant_id: TENANT_1_ID,
      organization_id: ORG_2_ID,
      email: "lisa.sales@techcorp.com",
      password: "user123",
      first_name: "Lisa",
      last_name: "Rodriguez",
      phone: "+1-555-0103",
      job_title: "Sales Director",
      department: "Business Development",
      active: true,
      last_login: "2024-06-23T16:20:00.000Z",
      created_at: "2024-02-10T11:30:00.000Z",
      updated_at: "2024-06-12T16:20:00.000Z"
    },
    {
      id: USER_5_ID,
      tenant_id: TENANT_2_ID,
      organization_id: ORG_3_ID,
      email: "david.consultant@globalent.com",
      password: "consultant123",
      first_name: "David",
      last_name: "Williams",
      phone: "+1-555-0458",
      job_title: "Senior Consultant",
      department: "Strategic Consulting",
      active: true,
      last_login: "2024-06-23T14:30:00.000Z",
      created_at: "2024-02-15T12:00:00.000Z",
      updated_at: "2024-06-10T15:10:00.000Z"
    },
    {
      id: USER_6_ID,
      tenant_id: TENANT_1_ID,
      organization_id: ORG_4_ID,
      email: "emma.hr@techcorp.com",
      password: "hr123",
      first_name: "Emma",
      last_name: "Thompson",
      phone: "+1-555-0126",
      job_title: "HR Specialist",
      department: "Human Resources",
      active: true,
      last_login: "2024-06-24T10:00:00.000Z",
      created_at: "2024-02-20T13:30:00.000Z",
      updated_at: "2024-06-08T12:45:00.000Z"
    }
  ],

  // ==================== USER ROLE ASSIGNMENTS ====================
  userRoles: [
    {
      id: generateId('userrole-'),
      user_id: USER_1_ID,
      role_id: ROLE_ADMIN_ID,
      assigned_by: USER_1_ID,
      assigned_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('userrole-'),
      user_id: USER_2_ID,
      role_id: ROLE_MANAGER_ID,
      assigned_by: USER_1_ID,
      assigned_at: "2024-01-20T09:15:00.000Z"
    },
    {
      id: generateId('userrole-'),
      user_id: USER_3_ID,
      role_id: ROLE_USER_ID,
      assigned_by: USER_2_ID,
      assigned_at: "2024-02-01T10:00:00.000Z"
    },
    {
      id: generateId('userrole-'),
      user_id: USER_4_ID,
      role_id: ROLE_USER_ID,
      assigned_by: USER_2_ID,
      assigned_at: "2024-02-10T11:30:00.000Z"
    },
    {
      id: generateId('userrole-'),
      user_id: USER_5_ID,
      role_id: ROLE_MANAGER_ID,
      assigned_by: USER_1_ID,
      assigned_at: "2024-02-15T12:00:00.000Z"
    },
    {
      id: generateId('userrole-'),
      user_id: USER_6_ID,
      role_id: ROLE_HR_ID,
      assigned_by: USER_1_ID,
      assigned_at: "2024-02-20T13:30:00.000Z"
    }
  ],

  // ==================== ROLE PRIVILEGE MAPPINGS ====================
  rolePrivileges: [
    // Admin role - gets all privileges
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_ADMIN_ID,
      privilege_id: PRIV_USER_CREATE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_ADMIN_ID,
      privilege_id: PRIV_USER_READ,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_ADMIN_ID,
      privilege_id: PRIV_USER_UPDATE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_ADMIN_ID,
      privilege_id: PRIV_USER_DELETE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_ADMIN_ID,
      privilege_id: PRIV_TENANT_MANAGE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_ADMIN_ID,
      privilege_id: PRIV_ROLE_MANAGE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_ADMIN_ID,
      privilege_id: PRIV_ORG_MANAGE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },

    // Manager role - gets read/update privileges
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_MANAGER_ID,
      privilege_id: PRIV_USER_READ,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_MANAGER_ID,
      privilege_id: PRIV_USER_UPDATE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_MANAGER_ID,
      privilege_id: PRIV_ORG_MANAGE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },

    // User role - gets read privileges only
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_USER_ID,
      privilege_id: PRIV_USER_READ,
      granted_by: USER_1_ID,
      granted_at: "2024-01-15T08:30:00.000Z"
    },

    // HR role - gets user management privileges
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_HR_ID,
      privilege_id: PRIV_USER_CREATE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-25T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_HR_ID,
      privilege_id: PRIV_USER_READ,
      granted_by: USER_1_ID,
      granted_at: "2024-01-25T08:30:00.000Z"
    },
    {
      id: generateId('roleprivs-'),
      role_id: ROLE_HR_ID,
      privilege_id: PRIV_USER_UPDATE,
      granted_by: USER_1_ID,
      granted_at: "2024-01-25T08:30:00.000Z"
    }
  ],

  // ==================== LEGAL ENTITIES ====================
  legalEntities: [
    {
      id: generateId('legal-'),
      tenant_id: TENANT_1_ID,
      name: "TechCorp Solutions LLC",
      entity_type: "Limited Liability Company",
      registration_number: "LLC-2024-001-TC",
      tax_id: "12-3456789",
      registration_country: "United States",
      registration_state: "Delaware",
      address: {
        street: "123 Technology Drive",
        suite: "Suite 400",
        city: "San Francisco",
        state: "CA",
        postal_code: "94105",
        country: "United States"
      },
      contact_email: "legal@techcorp.com",
      contact_phone: "+1-555-0123",
      status: "ACTIVE",
      incorporation_date: "2024-01-01",
      industry: "Software Development",
      business_description: "Enterprise software solutions and digital transformation services",
      authorized_shares: 10000000,
      issued_shares: 5000000,
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: generateId('legal-'),
      tenant_id: TENANT_1_ID,
      name: "TechCorp International Inc.",
      entity_type: "Corporation",
      registration_number: "CORP-2024-002-TCI",
      tax_id: "98-7654321",
      registration_country: "United States",
      registration_state: "California",
      address: {
        street: "456 Innovation Boulevard",
        suite: "Floor 12",
        city: "Palo Alto",
        state: "CA",
        postal_code: "94301",
        country: "United States"
      },
      contact_email: "international@techcorp.com",
      contact_phone: "+1-555-0124",
      status: "ACTIVE",
      incorporation_date: "2024-03-15",
      industry: "International Consulting",
      business_description: "International business expansion and consulting services",
      authorized_shares: 5000000,
      issued_shares: 3000000,
      created_at: "2024-03-20T10:15:00.000Z",
      updated_at: "2024-06-18T11:30:00.000Z"
    },
    {
      id: generateId('legal-'),
      tenant_id: TENANT_2_ID,
      name: "Global Enterprises Corp",
      entity_type: "Corporation",
      registration_number: "CORP-2024-003-GEC",
      tax_id: "11-2233445",
      registration_country: "United States",
      registration_state: "New York",
      address: {
        street: "789 Business Plaza",
        suite: "Penthouse",
        city: "New York",
        state: "NY",
        postal_code: "10001",
        country: "United States"
      },
      contact_email: "legal@globalent.com",
      contact_phone: "+1-555-0456",
      status: "ACTIVE",
      incorporation_date: "2024-01-10",
      industry: "Management Consulting",
      business_description: "Strategic consulting and business transformation services",
      authorized_shares: 15000000,
      issued_shares: 8000000,
      created_at: "2024-02-01T09:15:00.000Z",
      updated_at: "2024-06-15T14:45:00.000Z"
    },
    {
      id: generateId('legal-'),
      tenant_id: TENANT_3_ID,
      name: "Innovation Startup Hub LLC",
      entity_type: "Limited Liability Company",
      registration_number: "LLC-2024-004-ISH",
      tax_id: "55-9988776",
      registration_country: "United States",
      registration_state: "California",
      address: {
        street: "321 Startup Avenue",
        suite: "Building C",
        city: "Mountain View",
        state: "CA",
        postal_code: "94041",
        country: "United States"
      },
      contact_email: "legal@startupHub.com",
      contact_phone: "+1-555-0789",
      status: "ACTIVE",
      incorporation_date: "2024-03-01",
      industry: "Venture Capital",
      business_description: "Startup acceleration and venture capital services",
      authorized_shares: 2000000,
      issued_shares: 1000000,
      created_at: "2024-03-10T10:00:00.000Z",
      updated_at: "2024-06-15T16:30:00.000Z"
    }
  ],

  // ==================== TENANT SETTINGS ====================
  tenantSettings: [
    {
      id: generateId('settings-'),
      tenant_id: TENANT_1_ID,
      settings: {
        theme: "light",
        language: "en",
        timezone: "America/Los_Angeles",
        date_format: "MM/DD/YYYY",
        time_format: "12h",
        notifications: {
          email: true,
          push: true,
          sms: false,
          desktop: true
        },
        security: {
          password_policy: {
            min_length: 8,
            require_uppercase: true,
            require_lowercase: true,
            require_numbers: true,
            require_symbols: false,
            max_age_days: 90
          },
          session_timeout: 3600, // 1 hour in seconds
          max_login_attempts: 5,
          lockout_duration: 900, // 15 minutes in seconds
          two_factor_required: false
        },
        branding: {
          logo_url: "https://via.placeholder.com/200x60/4F46E5/FFFFFF?text=TechCorp",
          primary_color: "#4F46E5",
          secondary_color: "#10B981",
          company_name: "TechCorp Solutions"
        },
        features: {
          audit_logging: true,
          advanced_reporting: true,
          api_access: true,
          bulk_operations: true,
          custom_fields: false
        }
      },
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: generateId('settings-'),
      tenant_id: TENANT_2_ID,
      settings: {
        theme: "dark",
        language: "en",
        timezone: "America/New_York",
        date_format: "DD/MM/YYYY",
        time_format: "24h",
        notifications: {
          email: true,
          push: false,
          sms: true,
          desktop: false
        },
        security: {
          password_policy: {
            min_length: 12,
            require_uppercase: true,
            require_lowercase: true,
            require_numbers: true,
            require_symbols: true,
            max_age_days: 60
          },
          session_timeout: 1800, // 30 minutes
          max_login_attempts: 3,
          lockout_duration: 1800, // 30 minutes
          two_factor_required: true
        },
        branding: {
          logo_url: "https://via.placeholder.com/200x60/059669/FFFFFF?text=GlobalEnt",
          primary_color: "#059669",
          secondary_color: "#DC2626",
          company_name: "Global Enterprises"
        },
        features: {
          audit_logging: true,
          advanced_reporting: true,
          api_access: true,
          bulk_operations: true,
          custom_fields: true
        }
      },
      created_at: "2024-02-01T09:15:00.000Z",
      updated_at: "2024-06-18T11:45:00.000Z"
    }
  ],

  // ==================== AUDIT LOGS ====================
  auditLogs: [
    {
      id: generateId('audit-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_1_ID,
      action: "USER_LOGIN",
      resource_type: "Authentication",
      resource_id: USER_1_ID,
      details: {
        ip_address: "192.168.1.100",
        user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        success: true,
        method: "email_password"
      },
      timestamp: "2024-06-24T09:30:00.000Z"
    },
    {
      id: generateId('audit-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_1_ID,
      action: "USER_CREATED",
      resource_type: "User",
      resource_id: USER_6_ID,
      details: {
        created_user_email: "emma.hr@techcorp.com",
        assigned_role: "HR Specialist",
        organization: "Human Resources"
      },
      timestamp: "2024-02-20T13:30:00.000Z"
    },
    {
      id: generateId('audit-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_2_ID,
      action: "ROLE_ASSIGNED",
      resource_type: "UserRole",
      resource_id: generateId('userrole-'),
      details: {
        target_user: "mike.developer@techcorp.com",
        role_assigned: "Standard User",
        previous_role: null
      },
      timestamp: "2024-02-01T10:00:00.000Z"
    },
    {
      id: generateId('audit-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_1_ID,
      action: "ORGANIZATION_UPDATED",
      resource_type: "Organization",
      resource_id: ORG_1_ID,
      details: {
        organization_name: "Engineering Division",
        fields_updated: ["description", "employee_count"],
        previous_values: {
          description: "Product development and engineering teams",
          employee_count: 115
        },
        new_values: {
          description: "Product development, software engineering, and technical innovation teams",
          employee_count: 120
        }
      },
      timestamp: "2024-06-15T16:30:00.000Z"
    },
    {
      id: generateId('audit-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_4_ID,
      action: "USER_PROFILE_UPDATED",
      resource_type: "User",
      resource_id: USER_4_ID,
      details: {
        fields_updated: ["phone", "job_title"],
        previous_values: {
          phone: "+1-555-0103",
          job_title: "Sales Manager"
        },
        new_values: {
          phone: "+1-555-0103",
          job_title: "Sales Director"
        }
      },
      timestamp: "2024-06-12T16:20:00.000Z"
    }
  ],

  // ==================== SYSTEM NOTIFICATIONS ====================
  notifications: [
    {
      id: generateId('notif-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_1_ID,
      type: "SECURITY_ALERT",
      title: "New Login from Unrecognized Device",
      message: "A new login was detected from an unrecognized device in San Francisco, CA",
      read: false,
      priority: "HIGH",
      data: {
        ip_address: "203.0.113.42",
        location: "San Francisco, CA",
        device: "Chrome on Windows"
      },
      created_at: "2024-06-24T09:15:00.000Z"
    },
    {
      id: generateId('notif-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_2_ID,
      type: "TASK_ASSIGNMENT",
      title: "New User Account Requires Approval",
      message: "A new user account for emma.hr@techcorp.com requires your approval",
      read: true,
      priority: "MEDIUM",
      data: {
        user_email: "emma.hr@techcorp.com",
        requested_role: "HR Specialist",
        requested_by: "john.admin@techcorp.com"
      },
      created_at: "2024-06-20T14:30:00.000Z"
    },
    {
      id: generateId('notif-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_1_ID,
      type: "SYSTEM_UPDATE",
      title: "System Maintenance Scheduled",
      message: "Scheduled maintenance window on June 30th from 2:00 AM to 4:00 AM PST",
      read: true,
      priority: "LOW",
      data: {
        maintenance_start: "2024-06-30T02:00:00.000Z",
        maintenance_end: "2024-06-30T04:00:00.000Z",
        affected_services: ["Authentication", "User Management", "Reporting"]
      },
      created_at: "2024-06-18T16:00:00.000Z"
    },
    {
      id: generateId('notif-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_6_ID,
      type: "WELCOME",
      title: "Welcome to TechCorp Solutions",
      message: "Your account has been successfully created. Please complete your profile setup.",
      read: false,
      priority: "MEDIUM",
      data: {
        setup_url: "/profile/setup",
        assigned_role: "HR Specialist"
      },
      created_at: "2024-02-20T13:30:00.000Z"
    }
  ],

  // ==================== SYSTEM METRICS ====================
  systemMetrics: [
    {
      id: generateId('metric-'),
      tenant_id: TENANT_1_ID,
      metric_type: "USER_ACTIVITY",
      metric_name: "daily_active_users",
      value: 45,
      unit: "count",
      period: "daily",
      timestamp: "2024-06-24T00:00:00.000Z"
    },
    {
      id: generateId('metric-'),
      tenant_id: TENANT_1_ID,
      metric_type: "USER_ACTIVITY",
      metric_name: "weekly_active_users",
      value: 180,
      unit: "count",
      period: "weekly",
      timestamp: "2024-06-24T00:00:00.000Z"
    },
    {
      id: generateId('metric-'),
      tenant_id: TENANT_1_ID,
      metric_type: "SYSTEM_PERFORMANCE",
      metric_name: "average_response_time",
      value: 245,
      unit: "milliseconds",
      period: "hourly",
      timestamp: "2024-06-24T10:00:00.000Z"
    },
    {
      id: generateId('metric-'),
      tenant_id: TENANT_1_ID,
      metric_type: "SECURITY",
      metric_name: "failed_login_attempts",
      value: 12,
      unit: "count",
      period: "daily",
      timestamp: "2024-06-24T00:00:00.000Z"
    },
    {
      id: generateId('metric-'),
      tenant_id: TENANT_1_ID,
      metric_type: "USAGE",
      metric_name: "api_requests",
      value: 15420,
      unit: "count",
      period: "daily",
      timestamp: "2024-06-24T00:00:00.000Z"
    }
  ],

  // ==================== API KEYS ====================
  apiKeys: [
    {
      id: generateId('apikey-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_1_ID,
      name: "Production Integration",
      key: "tc_live_" + generateId().substring(0, 32),
      permissions: ["user.read", "user.create", "organization.read"],
      status: "ACTIVE",
      last_used: "2024-06-24T08:30:00.000Z",
      expires_at: "2025-06-24T00:00:00.000Z",
      created_at: "2024-01-15T08:30:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: generateId('apikey-'),
      tenant_id: TENANT_1_ID,
      user_id: USER_2_ID,
      name: "Development Testing",
      key: "tc_test_" + generateId().substring(0, 32),
      permissions: ["user.read", "organization.read"],
      status: "ACTIVE",
      last_used: "2024-06-23T15:45:00.000Z",
      expires_at: "2024-12-31T23:59:59.000Z",
      created_at: "2024-03-01T10:00:00.000Z",
      updated_at: "2024-06-15T11:30:00.000Z"
    }
  ],

  // ==================== INTEGRATIONS ====================
  integrations: [
    {
      id: generateId('integration-'),
      tenant_id: TENANT_1_ID,
      name: "Slack Notifications",
      provider: "SLACK",
      status: "ACTIVE",
      configuration: {
        webhook_url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
        channel: "#user-management",
        events: ["user.created", "user.deactivated", "role.assigned"]
      },
      last_sync: "2024-06-24T09:00:00.000Z",
      created_at: "2024-02-01T10:00:00.000Z",
      updated_at: "2024-06-20T14:22:00.000Z"
    },
    {
      id: generateId('integration-'),
      tenant_id: TENANT_1_ID,
      name: "Microsoft Active Directory",
      provider: "MICROSOFT_AD",
      status: "ACTIVE",
      configuration: {
        domain: "techcorp.local",
        server: "ad.techcorp.local",
        sync_interval: 3600,
        auto_create_users: true
      },
      last_sync: "2024-06-24T08:00:00.000Z",
      created_at: "2024-01-20T09:00:00.000Z",
      updated_at: "2024-06-18T16:30:00.000Z"
    }
  ]
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Get users by tenant ID
 */
export const getUsersByTenant = (tenantId) => {
  return mockData.users.filter(user => user.tenant_id === tenantId);
};

/**
 * Get user roles by user ID
 */
export const getUserRoles = (userId) => {
  const userRoleAssignments = mockData.userRoles.filter(ur => ur.user_id === userId);
  return userRoleAssignments.map(ur => 
    mockData.roles.find(role => role.id === ur.role_id)
  ).filter(Boolean);
};

/**
 * Get role privileges by role ID
 */
export const getRolePrivileges = (roleId) => {
  const rolePrivilegeAssignments = mockData.rolePrivileges.filter(rp => rp.role_id === roleId);
  return rolePrivilegeAssignments.map(rp => 
    mockData.privileges.find(privilege => privilege.id === rp.privilege_id)
  ).filter(Boolean);
};

/**
 * Get user privileges (through roles)
 */
export const getUserPrivileges = (userId) => {
  const userRoles = getUserRoles(userId);
  const privileges = [];
  
  userRoles.forEach(role => {
    const rolePrivileges = getRolePrivileges(role.id);
    privileges.push(...rolePrivileges);
  });
  
  // Remove duplicates
  return privileges.filter((privilege, index, self) => 
    index === self.findIndex(p => p.id === privilege.id)
  );
};

/**
 * Get organizations by tenant ID
 */
export const getOrganizationsByTenant = (tenantId) => {
  return mockData.organizations.filter(org => org.tenant_id === tenantId);
};

/**
 * Get legal entities by tenant ID
 */
export const getLegalEntitiesByTenant = (tenantId) => {
  return mockData.legalEntities.filter(entity => entity.tenant_id === tenantId);
};

/**
 * Get tenant settings by tenant ID
 */
export const getTenantSettings = (tenantId) => {
  return mockData.tenantSettings.find(settings => settings.tenant_id === tenantId);
};

/**
 * Get recent audit logs by tenant ID
 */
export const getRecentAuditLogs = (tenantId, limit = 10) => {
  return mockData.auditLogs
    .filter(log => log.tenant_id === tenantId)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, limit);
};

/**
 * Get notifications by user ID
 */
export const getUserNotifications = (userId, unreadOnly = false) => {
  return mockData.notifications
    .filter(notif => notif.user_id === userId && (!unreadOnly || !notif.read))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

/**
 * Check if user has specific privilege
 */
export const userHasPrivilege = (userId, privilegeName) => {
  const userPrivileges = getUserPrivileges(userId);
  return userPrivileges.some(privilege => privilege.name === privilegeName);
};

/**
 * Get system metrics by tenant ID and type
 */
export const getSystemMetrics = (tenantId, metricType = null) => {
  return mockData.systemMetrics
    .filter(metric => metric.tenant_id === tenantId && (!metricType || metric.metric_type === metricType))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

// Export default mock data
export default mockData;