// src/services/analyticsApi.js
const analyticsApi = {
  async getSystemAnalytics() {
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/analytics/system', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}` // Add auth if needed
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        totalUsers: data.totalUsers || 1247,
        userGrowth: data.userGrowth || '+12%',
        activeSessions: data.activeSessions || 342,
        sessionGrowth: data.sessionGrowth || '+8%',
        totalOrganizations: data.totalOrganizations || 15,
        orgGrowth: data.orgGrowth || '+2',
        monthlyGrowth: data.monthlyGrowth || 15.2,
        growthChange: data.growthChange || '+2.4%',
        userGrowthData: {
          labels: data.userGrowthData?.labels || [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ],
          values: data.userGrowthData?.values || [
            120, 189, 234, 298, 345, 423, 512, 634, 745, 856, 987, 1247
          ]
        },
        roleDistribution: {
          labels: data.roleDistribution?.labels || [
            'System Admin', 'Tenant Admin', 'Manager', 'User', 'Guest'
          ],
          values: data.roleDistribution?.values || [15, 45, 125, 756, 87]
        },
        activityData: data.activityData || [
          { day: 'Mon', hour: 9, intensity: 0.8 },
          { day: 'Mon', hour: 10, intensity: 0.9 },
          { day: 'Mon', hour: 14, intensity: 0.7 },
          { day: 'Tue', hour: 9, intensity: 0.6 },
          { day: 'Tue', hour: 10, intensity: 0.8 },
          { day: 'Wed', hour: 11, intensity: 0.9 },
          { day: 'Thu', hour: 15, intensity: 0.7 },
          { day: 'Fri', hour: 10, intensity: 0.5 }
        ],
        engagementData: {
          labels: data.engagementData?.labels || [
            'TechCorp', 'Global Ent', 'Innovation Hub', 'StartupCo', 'Enterprise Inc'
          ],
          values: data.engagementData?.values || [85, 72, 68, 91, 76]
        },
        organizationMetrics: data.organizationMetrics || [
          { name: 'Engineering Teams', users: 245, utilization: 85 },
          { name: 'Sales & Marketing', users: 132, utilization: 72 },
          { name: 'Human Resources', users: 45, utilization: 91 },
          { name: 'Finance Operations', users: 78, utilization: 76 },
          { name: 'IT Operations', users: 89, utilization: 88 }
        ]
      };
    } catch (error) {
      console.error('Error fetching system analytics:', error);
      // Return mock data as fallback
      return this.getMockSystemAnalytics();
    }
  },

  async getTenantAnalytics(tenantId) {
    try {
      const response = await fetch(`/api/analytics/tenant/${tenantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        totalUsers: data.totalUsers || 82,
        userGrowth: data.userGrowth || '+12%',
        activeSessions: data.activeSessions || 76,
        sessionGrowth: data.sessionGrowth || '+8%',
        totalOrganizations: data.totalOrganizations || 4,
        orgGrowth: data.orgGrowth || '+1',
        monthlyGrowth: data.monthlyGrowth || 12.5,
        growthChange: data.growthChange || '+2.1%',
        userGrowthData: {
          labels: data.userGrowthData?.labels || [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'
          ],
          values: data.userGrowthData?.values || [45, 52, 61, 68, 75, 82]
        },
        roleDistribution: {
          labels: data.roleDistribution?.labels || [
            'Managers', 'Developers', 'HR Staff', 'Sales Team', 'Support'
          ],
          values: data.roleDistribution?.values || [25, 35, 12, 8, 2]
        },
        activityData: data.activityData || [
          { day: 'Mon', hour: 9, intensity: 0.8 },
          { day: 'Mon', hour: 10, intensity: 0.9 },
          { day: 'Tue', hour: 14, intensity: 0.7 },
          { day: 'Wed', hour: 11, intensity: 0.6 },
          { day: 'Thu', hour: 15, intensity: 0.8 },
          { day: 'Fri', hour: 10, intensity: 0.5 }
        ],
        engagementData: {
          labels: data.engagementData?.labels || [
            'Engineering', 'Sales', 'Marketing', 'HR', 'Finance'
          ],
          values: data.engagementData?.values || [85, 72, 68, 91, 76]
        },
        organizationMetrics: data.organizationMetrics || [
          { name: 'Engineering Division', users: 35, utilization: 85 },
          { name: 'Sales & Marketing', users: 28, utilization: 72 },
          { name: 'Human Resources', users: 12, utilization: 91 },
          { name: 'Finance & Admin', users: 7, utilization: 76 }
        ]
      };
    } catch (error) {
      console.error('Error fetching tenant analytics:', error);
      return this.getMockTenantAnalytics();
    }
  },

  // Enhanced mock data generators
  getMockSystemAnalytics() {
    return {
      totalUsers: 1247,
      userGrowth: '+12%',
      activeSessions: 342,
      sessionGrowth: '+8%',
      totalOrganizations: 15,
      orgGrowth: '+2',
      monthlyGrowth: 15.2,
      growthChange: '+2.4%',
      userGrowthData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        values: [120, 189, 234, 298, 345, 423, 512, 634, 745, 856, 987, 1247]
      },
      roleDistribution: {
        labels: ['System Admin', 'Tenant Admin', 'Manager', 'User', 'Guest'],
        values: [15, 45, 125, 756, 87]
      },
      activityData: [
        { day: 'Mon', hour: 8, intensity: 0.6 },
        { day: 'Mon', hour: 9, intensity: 0.8 },
        { day: 'Mon', hour: 10, intensity: 0.9 },
        { day: 'Mon', hour: 11, intensity: 0.7 },
        { day: 'Mon', hour: 14, intensity: 0.7 },
        { day: 'Mon', hour: 15, intensity: 0.8 },
        { day: 'Mon', hour: 16, intensity: 0.6 },
        { day: 'Tue', hour: 9, intensity: 0.6 },
        { day: 'Tue', hour: 10, intensity: 0.8 },
        { day: 'Tue', hour: 11, intensity: 0.9 },
        { day: 'Tue', hour: 14, intensity: 0.5 },
        { day: 'Tue', hour: 15, intensity: 0.7 },
        { day: 'Wed', hour: 9, intensity: 0.8 },
        { day: 'Wed', hour: 10, intensity: 0.9 },
        { day: 'Wed', hour: 11, intensity: 0.9 },
        { day: 'Wed', hour: 14, intensity: 0.8 },
        { day: 'Wed', hour: 15, intensity: 0.7 },
        { day: 'Thu', hour: 9, intensity: 0.7 },
        { day: 'Thu', hour: 10, intensity: 0.8 },
        { day: 'Thu', hour: 15, intensity: 0.7 },
        { day: 'Thu', hour: 16, intensity: 0.6 },
        { day: 'Fri', hour: 9, intensity: 0.6 },
        { day: 'Fri', hour: 10, intensity: 0.5 },
        { day: 'Fri', hour: 11, intensity: 0.7 },
        { day: 'Fri', hour: 14, intensity: 0.4 }
      ],
      engagementData: {
        labels: ['TechCorp', 'Global Ent', 'Innovation Hub', 'StartupCo', 'Enterprise Inc'],
        values: [85, 72, 68, 91, 76]
      },
      organizationMetrics: [
        { name: 'Engineering Teams', users: 245, utilization: 85 },
        { name: 'Sales & Marketing', users: 132, utilization: 72 },
        { name: 'Human Resources', users: 45, utilization: 91 },
        { name: 'Finance Operations', users: 78, utilization: 76 },
        { name: 'IT Operations', users: 89, utilization: 88 }
      ]
    };
  },

  getMockTenantAnalytics() {
    return {
      totalUsers: 82,
      userGrowth: '+12%',
      activeSessions: 76,
      sessionGrowth: '+8%',
      totalOrganizations: 4,
      orgGrowth: '+1',
      monthlyGrowth: 12.5,
      growthChange: '+2.1%',
      userGrowthData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        values: [45, 52, 61, 68, 75, 82]
      },
      roleDistribution: {
        labels: ['Managers', 'Developers', 'HR Staff', 'Sales Team', 'Support'],
        values: [25, 35, 12, 8, 2]
      },
      activityData: [
        { day: 'Mon', hour: 9, intensity: 0.8 },
        { day: 'Mon', hour: 10, intensity: 0.9 },
        { day: 'Mon', hour: 14, intensity: 0.7 },
        { day: 'Mon', hour: 15, intensity: 0.8 },
        { day: 'Tue', hour: 9, intensity: 0.6 },
        { day: 'Tue', hour: 10, intensity: 0.8 },
        { day: 'Tue', hour: 11, intensity: 0.7 },
        { day: 'Wed', hour: 10, intensity: 0.9 },
        { day: 'Wed', hour: 11, intensity: 0.9 },
        { day: 'Wed', hour: 14, intensity: 0.6 },
        { day: 'Thu', hour: 9, intensity: 0.7 },
        { day: 'Thu', hour: 15, intensity: 0.7 },
        { day: 'Fri', hour: 10, intensity: 0.5 },
        { day: 'Fri', hour: 11, intensity: 0.6 }
      ],
      engagementData: {
        labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
        values: [85, 72, 68, 91, 76]
      },
      organizationMetrics: [
        { name: 'Engineering Division', users: 35, utilization: 85 },
        { name: 'Sales & Marketing', users: 28, utilization: 72 },
        { name: 'Human Resources', users: 12, utilization: 91 },
        { name: 'Finance & Admin', users: 7, utilization: 76 }
      ]
    };
  },

  // Utility method to generate random analytics data for testing
  generateRandomAnalytics(type = 'system') {
    const baseData = type === 'system' ? this.getMockSystemAnalytics() : this.getMockTenantAnalytics();
    
    // Add some randomness to simulate real-time updates
    return {
      ...baseData,
      totalUsers: baseData.totalUsers + Math.floor(Math.random() * 10),
      activeSessions: baseData.activeSessions + Math.floor(Math.random() * 20),
      monthlyGrowth: baseData.monthlyGrowth + (Math.random() * 2 - 1), // +/- 1%
      userGrowthData: {
        ...baseData.userGrowthData,
        values: baseData.userGrowthData.values.map(val => val + Math.floor(Math.random() * 50))
      }
    };
  }
};

export default analyticsApi;