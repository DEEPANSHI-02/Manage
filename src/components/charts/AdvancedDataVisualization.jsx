// src/components/charts/AdvancedDataVisualization.jsx
// Replace the mock Chart.js implementation with this real Chart.js version

import React, { useEffect, useRef, useState } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Users, Building } from 'lucide-react';

// Real Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

// Enhanced Dashboard Analytics Component
const AdvancedAnalyticsDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={data.totalUsers}
          change={data.userGrowth}
          trend="up"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="Active Sessions"
          value={data.activeSessions}
          change={data.sessionGrowth}
          trend="up"
          icon={Activity}
          color="green"
        />
        <MetricCard
          title="Organizations"
          value={data.totalOrganizations}
          change={data.orgGrowth}
          trend="stable"
          icon={Building}
          color="purple"
        />
        <MetricCard
          title="Monthly Growth"
          value={`${data.monthlyGrowth}%`}
          change={data.growthChange}
          trend="up"
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UserGrowthChart data={data.userGrowthData} />
        <RoleDistributionChart data={data.roleDistribution} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityHeatmap data={data.activityData} />
        <UserEngagementChart data={data.engagementData} />
        <OrganizationMetrics data={data.organizationMetrics} />
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, change, trend, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-blue-600',
    green: 'bg-green-500 text-green-600',
    purple: 'bg-purple-500 text-purple-600',
    orange: 'bg-orange-500 text-orange-600'
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-opacity-10 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${trendClasses[trend]}`}>
            {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {change}
          </span>
          <span className="text-sm text-gray-500 ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

// User Growth Chart Component with Real Chart.js
const UserGrowthChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Total Users',
        data: data.values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        border: {
          display: false
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">User Growth Trend</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last 12 months</span>
          <BarChart3 className="h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="relative h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

// Role Distribution Chart Component with Real Chart.js
const RoleDistributionChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6'
        ],
        borderWidth: 0,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#3b82f6',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Role Distribution</h3>
        <PieChart className="h-4 w-4 text-gray-400" />
      </div>
      <div className="relative h-64">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.labels.map((label, index) => (
          <div key={label} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index]
              }}
            />
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-xs text-gray-400 ml-auto">{data.values[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Activity Heatmap Component (Enhanced)
const ActivityHeatmap = ({ data }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getIntensity = (day, hour) => {
    const activity = data.find(d => d.day === day && d.hour === hour);
    return activity ? activity.intensity : 0;
  };

  const getColor = (intensity) => {
    if (intensity === 0) return 'rgba(229, 231, 235, 1)'; // gray-200
    const opacity = Math.max(0.1, intensity);
    return `rgba(59, 130, 246, ${opacity})`;
  };

  const getTooltipText = (day, hour, intensity) => {
    const timeString = hour === 0 ? '12:00 AM' : 
                     hour < 12 ? `${hour}:00 AM` : 
                     hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
    return `${day} ${timeString} - Activity: ${(intensity * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Activity Heatmap</h3>
        <Activity className="h-4 w-4 text-gray-400" />
      </div>
      <div className="space-y-1">
        {days.map(day => (
          <div key={day} className="flex items-center space-x-1">
            <div className="w-8 text-xs text-gray-500 text-right">{day}</div>
            <div className="flex space-x-1">
              {hours.map(hour => {
                const intensity = getIntensity(day, hour);
                return (
                  <div
                    key={hour}
                    className="w-3 h-3 rounded-sm cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all"
                    style={{ backgroundColor: getColor(intensity) }}
                    title={getTooltipText(day, hour, intensity)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex space-x-1">
          {[0.1, 0.3, 0.5, 0.7, 0.9].map(opacity => (
            <div
              key={opacity}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// User Engagement Chart Component with Real Chart.js
const UserEngagementChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Engagement Score',
        data: data.values,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10b981',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#10b981',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Score: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        border: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        border: {
          display: false
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">User Engagement</h3>
        <TrendingUp className="h-4 w-4 text-gray-400" />
      </div>
      <div className="relative h-48">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

// Organization Metrics Component (Enhanced)
const OrganizationMetrics = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Organization Metrics</h3>
        <Building className="h-4 w-4 text-gray-400" />
      </div>
      <div className="space-y-4">
        {data.map((org, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">{org.name}</span>
              <span className="text-sm text-gray-500">{org.users} users</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${org.utilization}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 min-w-[3rem] font-medium">{org.utilization}%</span>
            </div>
            <div className="text-xs text-gray-400">
              Utilization: {org.utilization >= 90 ? 'Excellent' : org.utilization >= 75 ? 'Good' : org.utilization >= 50 ? 'Average' : 'Low'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sample data for demo (unchanged)
const sampleData = {
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
    labels: ['Admin', 'Manager', 'User', 'Viewer', 'Guest'],
    values: [45, 125, 756, 234, 87]
  },
  activityData: [
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
    labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
    values: [85, 72, 68, 91, 76]
  },
  organizationMetrics: [
    { name: 'Engineering', users: 45, utilization: 85 },
    { name: 'Sales & Marketing', users: 32, utilization: 72 },
    { name: 'Human Resources', users: 12, utilization: 91 },
    { name: 'Finance', users: 18, utilization: 76 },
    { name: 'Operations', users: 28, utilization: 68 }
  ]
};

// Main Demo Component
const DataVisualizationDemo = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics Dashboard</h1>
        <p className="text-gray-600">Real-time insights and data visualization</p>
      </div>
      <AdvancedAnalyticsDashboard data={sampleData} />
    </div>
  );
};

export default AdvancedAnalyticsDashboard;