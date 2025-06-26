import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Eye,
  Lock,
  Unlock,
  Activity,
  Clock,
  MapPin,
  Computer,
  Search,
  Filter,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const SecurityCenter = () => {
  const [securityEvents, setSecurityEvents] = useState([
    {
      id: 'sec-1',
      type: 'failed_login',
      severity: 'medium',
      title: 'Multiple Failed Login Attempts',
      description: 'User attempted login 5 times with invalid credentials',
      userId: 'user-4',
      userName: 'David Williams',
      tenantId: 'tenant-2',
      tenantName: 'Global Enterprises',
      ipAddress: '203.0.113.42',
      userAgent: 'Chrome 91.0.4472.124',
      location: 'New York, NY',
      timestamp: '2024-06-26T10:15:00Z',
      status: 'investigating'
    },
    {
      id: 'sec-2',
      type: 'suspicious_api',
      severity: 'high',
      title: 'Unusual API Activity',
      description: 'API requests from new geographic location with high frequency',
      tenantId: 'tenant-1',
      tenantName: 'TechCorp Solutions',
      ipAddress: '198.51.100.15',
      location: 'Unknown Location',
      requestCount: 500,
      timestamp: '2024-06-26T09:45:00Z',
      status: 'resolved'
    },
    {
      id: 'sec-3',
      type: 'privilege_escalation',
      severity: 'critical',
      title: 'Privilege Escalation Attempt',
      description: 'User attempted to access admin-only endpoints without proper authorization',
      userId: 'user-3',
      userName: 'Mike Chen',
      tenantId: 'tenant-1',
      tenantName: 'TechCorp Solutions',
      endpoint: '/admin/system/config',
      ipAddress: '192.168.1.102',
      location: 'San Jose, CA',
      timestamp: '2024-06-26T08:30:00Z',
      status: 'blocked'
    },
    {
      id: 'sec-4',
      type: 'brute_force',
      severity: 'high',
      title: 'Brute Force Attack Detected',
      description: 'Rapid login attempts from multiple IP addresses targeting admin accounts',
      targetAccounts: ['admin@techcorp.com', 'sarah.manager@techcorp.com'],
      ipAddresses: ['203.0.113.15', '203.0.113.16', '203.0.113.17'],
      attemptCount: 150,
      timestamp: '2024-06-26T07:20:00Z',
      status: 'blocked'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const getSeverityBadge = (severity) => {
    const badges = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    };
    return badges[severity] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      investigating: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      blocked: 'bg-red-100 text-red-800',
      monitoring: 'bg-blue-100 text-blue-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'blocked':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'investigating':
        return <Eye className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'failed_login':
        return <Lock className="h-4 w-4" />;
      case 'suspicious_api':
        return <Activity className="h-4 w-4" />;
      case 'privilege_escalation':
        return <Shield className="h-4 w-4" />;
      case 'brute_force':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleResolveEvent = (eventId) => {
    setSecurityEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: 'resolved' }
          : event
      )
    );
    toast.success('Security event marked as resolved');
  };

  // Summary stats
  const summary = {
    total: securityEvents.length,
    critical: securityEvents.filter(e => e.severity === 'critical').length,
    high: securityEvents.filter(e => e.severity === 'high').length,
    resolved: securityEvents.filter(e => e.status === 'resolved').length,
  };
  const [modalEvent, setModalEvent] = useState(null);

  // Filtering logic
  const filteredEvents = securityEvents.filter(event => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.userName && event.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.tenantName && event.tenantName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeverity = severityFilter === 'all' || event.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesType = typeFilter === 'all' || event.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesStatus && matchesType;
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Shield className="h-6 w-6 mr-2 text-blue-600" />
        Security Center
      </h1>
      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <Shield className="h-6 w-6 text-blue-500 mr-3" />
          <div>
            <div className="text-lg font-bold">{summary.total}</div>
            <div className="text-gray-500 text-sm">Total Events</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
          <div>
            <div className="text-lg font-bold">{summary.critical}</div>
            <div className="text-gray-500 text-sm">Critical</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <AlertTriangle className="h-6 w-6 text-orange-500 mr-3" />
          <div>
            <div className="text-lg font-bold">{summary.high}</div>
            <div className="text-gray-500 text-sm">High</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex items-center">
          <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
          <div>
            <div className="text-lg font-bold">{summary.resolved}</div>
            <div className="text-gray-500 text-sm">Resolved</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          onClick={() => {
            setSearchTerm('');
            setSeverityFilter('all');
            setStatusFilter('all');
            setTypeFilter('all');
          }}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset Filters
        </button>
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-1 rounded w-64"
        />
        <select
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Statuses</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
          <option value="blocked">Blocked</option>
          <option value="monitoring">Monitoring</option>
        </select>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">All Types</option>
          <option value="failed_login">Failed Login</option>
          <option value="suspicious_api">Suspicious API</option>
          <option value="privilege_escalation">Privilege Escalation</option>
          <option value="brute_force">Brute Force</option>
        </select>
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Tenant</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Severity</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">No security events found.</td>
              </tr>
            ) : (
              filteredEvents.map(event => (
                <tr key={event.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 flex items-center space-x-2">
                    {getTypeIcon(event.type)}
                    <span className="capitalize">{event.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-2">{event.title}</td>
                  <td className="px-4 py-2">{event.tenantName || '-'}</td>
                  <td className="px-4 py-2">{event.userName || '-'}</td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getSeverityBadge(event.severity)}`}>
                      {getSeverityIcon(event.severity)}
                      <span className="ml-1 capitalize">{event.severity}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(event.status)}`}>
                      {getStatusIcon(event.status)}
                      <span className="ml-1 capitalize">{event.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-2">{formatTimeAgo(event.timestamp)}</td>
                  <td className="px-4 py-2">
                    {event.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveEvent(event.id)}
                        className="text-green-600 hover:underline mr-2"
                      >
                        Mark Resolved
                      </button>
                    )}
                    <button
                      onClick={() => setModalEvent(event)}
                      className="text-blue-600 hover:underline"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Event Details Modal */}
      {modalEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h2 className="text-xl font-bold mb-4">{modalEvent.title}</h2>
            <div className="mb-2"><b>Type:</b> {modalEvent.type}</div>
            <div className="mb-2"><b>Severity:</b> {modalEvent.severity}</div>
            <div className="mb-2"><b>Status:</b> {modalEvent.status}</div>
            <div className="mb-2"><b>User:</b> {modalEvent.userName || '-'}</div>
            <div className="mb-2"><b>Tenant:</b> {modalEvent.tenantName || '-'}</div>
            <div className="mb-2"><b>Description:</b> {modalEvent.description}</div>
            <div className="mb-2"><b>Time:</b> {new Date(modalEvent.timestamp).toLocaleString()}</div>
            <div className="flex justify-end mt-4">
              <button onClick={() => setModalEvent(null)} className="px-3 py-1 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecurityCenter;
