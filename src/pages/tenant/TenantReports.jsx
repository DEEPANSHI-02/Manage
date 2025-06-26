// src/pages/tenant/TenantReports.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  Users,
  Building,
  Shield,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  PieChart,
  Activity,
  FileText,
  Clock
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const TenantReports = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [reportData, setReportData] = useState({
    userGrowth: [
      { month: 'Jan', users: 45, active: 42 },
      { month: 'Feb', users: 52, active: 48 },
      { month: 'Mar', users: 61, active: 55 },
      { month: 'Apr', users: 68, active: 62 },
      { month: 'May', users: 75, active: 69 },
      { month: 'Jun', users: 82, active: 76 }
    ],
    roleDistribution: [
      { role: 'Standard Users', count: 45, percentage: 55 },
      { role: 'Managers', count: 25, percentage: 30 },
      { role: 'Administrators', count: 8, percentage: 10 },
      { role: 'HR Specialists', count: 4, percentage: 5 }
    ],
    organizationMetrics: [
      { name: 'Engineering Division', users: 35, active: 33, growth: 12 },
      { name: 'Sales & Marketing', users: 28, active: 26, growth: 8 },
      { name: 'Human Resources', users: 12, active: 11, growth: 15 },
      { name: 'Finance & Admin', users: 7, active: 6, growth: 5 }
    ],
    activityMetrics: {
      totalLogins: 2847,
      averageSessionTime: '45 minutes',
      peakUsageHour: '10:00 AM',
      failedLogins: 23
    }
  });

  const generateReport = (type) => {
    // Mock report generation
    console.log(`Generating ${type} report for period: ${selectedPeriod}`);
    // In real implementation, this would trigger report generation
  };

  const exportReport = () => {
    // Export userGrowth as CSV
    const rows = [
      ['Month', 'Users', 'Active Users'],
      ...reportData.userGrowth.map(row => [row.month, row.users, row.active])
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user-growth-report.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
              <p className="mt-1 text-sm text-gray-600">
                Comprehensive tenant analytics and reporting dashboard
              </p>
            </div>
            <div className="flex space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={exportReport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">82</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="text-gray-500"> this month</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Users</dt>
                  <dd className="text-lg font-medium text-gray-900">76</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">92.7%</span>
              <span className="text-gray-500"> activity rate</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Organizations</dt>
                  <dd className="text-lg font-medium text-gray-900">4</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-green-600 font-medium">+1</span>
              <span className="text-gray-500"> this quarter</span>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Roles</dt>
                  <dd className="text-lg font-medium text-gray-900">8</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <span className="text-gray-600">Across all</span>
              <span className="text-gray-500"> departments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">User Growth Trend</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.userGrowth.map((data, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(data.users / 100) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 w-8">{data.users}</span>
                    </div>
                    <span className="text-xs text-gray-500">({data.active} active)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Role Distribution */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Role Distribution</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {reportData.roleDistribution.map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{role.role}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${role.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900 w-8">{role.count}</span>
                    <span className="text-xs text-gray-500 w-10">{role.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Organization Metrics */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Organization Performance</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Active Users
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Growth Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.organizationMetrics.map((org, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {org.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.users}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {org.active}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="text-green-600">+{org.growth}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {((org.active / org.users) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Reports */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Quick Report Generation</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => generateReport('user-activity')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Users className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">User Activity Report</span>
              <span className="text-xs text-gray-500 text-center mt-1">Login patterns and usage statistics</span>
            </button>

            <button
              onClick={() => generateReport('role-audit')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Shield className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Role Audit Report</span>
              <span className="text-xs text-gray-500 text-center mt-1">Role assignments and permissions</span>
            </button>

            <button
              onClick={() => generateReport('organization-summary')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <Building className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Organization Report</span>
              <span className="text-xs text-gray-500 text-center mt-1">Organizational structure analysis</span>
            </button>

            <button
              onClick={() => generateReport('compliance')}
              className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
            >
              <FileText className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm font-medium text-gray-900">Compliance Report</span>
              <span className="text-xs text-gray-500 text-center mt-1">Security and compliance status</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantReports;