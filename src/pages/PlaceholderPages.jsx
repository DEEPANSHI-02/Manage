import React from 'react';
import { 
  Building, 
  Users, 
  Shield, 
  Key, 
  FileText, 
  User,
  Settings,
  Construction
} from 'lucide-react';

/**
 * Placeholder component for pages under development
 */
const PlaceholderPage = ({ title, description, icon: Icon, features = [] }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="mt-1 text-sm text-gray-600">{description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-12 text-center">
          <Construction className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Coming Soon
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            This page is currently under development. We're working hard to bring you 
            comprehensive {title.toLowerCase()} functionality.
          </p>

          {/* Feature List */}
          {features.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Planned Features:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2"></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {feature.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              disabled
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Organization Management Page
 */
export const OrganizationManagement = () => {
  const features = [
    {
      name: "Hierarchical Structure",
      description: "Create and manage nested organizational structures"
    },
    {
      name: "Organization Profiles",
      description: "Detailed profiles with contact information and settings"
    },
    {
      name: "User Assignment",
      description: "Assign users to specific organizations"
    },
    {
      name: "Department Management",
      description: "Create and manage departments within organizations"
    }
  ];

  return (
    <PlaceholderPage
      title="Organization Management"
      description="Manage organizational structures and hierarchies"
      icon={Building}
      features={features}
    />
  );
};

/**
 * User Management Page
 */
export const UserManagement = () => {
  const features = [
    {
      name: "User CRUD Operations",
      description: "Create, read, update, and delete user accounts"
    },
    {
      name: "Role Assignment",
      description: "Assign and manage user roles and permissions"
    },
    {
      name: "Bulk Operations",
      description: "Import/export users and perform bulk actions"
    },
    {
      name: "User Activity Tracking",
      description: "Monitor user login and activity patterns"
    },
    {
      name: "Advanced Filtering",
      description: "Search and filter users by various criteria"
    },
    {
      name: "Profile Management",
      description: "Comprehensive user profile editing capabilities"
    }
  ];

  return (
    <PlaceholderPage
      title="User Management"
      description="Comprehensive user administration and management"
      icon={Users}
      features={features}
    />
  );
};

/**
 * Role Management Page
 */
export const RoleManagement = () => {
  const features = [
    {
      name: "Dynamic Role Creation",
      description: "Create custom roles with specific permissions"
    },
    {
      name: "Privilege Mapping",
      description: "Link roles to specific system privileges"
    },
    {
      name: "Role Hierarchy",
      description: "Create hierarchical role structures"
    },
    {
      name: "Role Templates",
      description: "Pre-defined role templates for common use cases"
    },
    {
      name: "Permission Matrix",
      description: "Visual permission matrix for role management"
    },
    {
      name: "Role Analytics",
      description: "Analytics on role usage and effectiveness"
    }
  ];

  return (
    <PlaceholderPage
      title="Role Management"
      description="Dynamic role creation and management"
      icon={Shield}
      features={features}
    />
  );
};

/**
 * Privilege Management Page
 */
export const PrivilegeManagement = () => {
  const features = [
    {
      name: "Granular Privileges",
      description: "Fine-grained control over system permissions"
    },
    {
      name: "Privilege Categories",
      description: "Organize privileges into logical categories"
    },
    {
      name: "Custom Privileges",
      description: "Create custom privileges for specific needs"
    },
    {
      name: "Privilege Inheritance",
      description: "Hierarchical privilege inheritance system"
    },
    {
      name: "Audit Trail",
      description: "Track privilege changes and assignments"
    },
    {
      name: "Privilege Testing",
      description: "Test privilege configurations before deployment"
    }
  ];

  return (
    <PlaceholderPage
      title="Privilege Management"
      description="Granular privilege control and management"
      icon={Key}
      features={features}
    />
  );
};

/**
 * Legal Entity Management Page
 */
export const LegalEntityManagement = () => {
  const features = [
    {
      name: "Entity Registration",
      description: "Register and manage legal entities"
    },
    {
      name: "Compliance Tracking",
      description: "Track compliance requirements and deadlines"
    },
    {
      name: "Document Management",
      description: "Store and manage legal documents"
    },
    {
      name: "Multi-jurisdiction Support",
      description: "Support for entities across different jurisdictions"
    },
    {
      name: "Entity Relationships",
      description: "Map relationships between legal entities"
    },
    {
      name: "Reporting",
      description: "Generate compliance and entity reports"
    }
  ];

  return (
    <PlaceholderPage
      title="Legal Entity Management"
      description="Legal entity registration and compliance"
      icon={FileText}
      features={features}
    />
  );
};

/**
 * Profile Page
 */
export const Profile = () => {
  const features = [
    {
      name: "Profile Editing",
      description: "Update personal information and preferences"
    },
    {
      name: "Security Settings",
      description: "Manage password and security preferences"
    },
    {
      name: "Notification Preferences",
      description: "Configure email and system notifications"
    },
    {
      name: "Activity History",
      description: "View recent account activity and changes"
    },
    {
      name: "Two-Factor Authentication",
      description: "Set up and manage 2FA settings"
    },
    {
      name: "API Access",
      description: "Manage API keys and access tokens"
    }
  ];

  return (
    <PlaceholderPage
      title="User Profile"
      description="Manage your account settings and preferences"
      icon={User}
      features={features}
    />
  );
};

/**
 * Settings Page
 */
export const SettingsPage = () => {
  const features = [
    {
      name: "System Configuration",
      description: "Configure global system settings"
    },
    {
      name: "Tenant Settings",
      description: "Manage tenant-specific configurations"
    },
    {
      name: "Security Policies",
      description: "Configure password and security policies"
    },
    {
      name: "Integration Settings",
      description: "Manage third-party integrations"
    },
    {
      name: "Backup & Recovery",
      description: "Configure backup and recovery settings"
    },
    {
      name: "Audit Configuration",
      description: "Configure audit logging and retention"
    }
  ];

  return (
    <PlaceholderPage
      title="System Settings"
      description="Configure system-wide settings and preferences"
      icon={Settings}
      features={features}
    />
  );
};