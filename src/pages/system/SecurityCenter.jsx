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
    alert('Security event marked as resolved');
  };

  const filteredEvents =// ==================== COMPLETE SYSTEM ADMIN IMPLEMENTATION ====================
// This includes all the missing features from the sidebar navigation
