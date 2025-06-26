import React, { useEffect, useState } from 'react';
import { mockApi } from '../../services/mockApi';
import { useAuth } from '../../hooks/useAuth';
import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const priorityColors = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
};

const typeIcons = {
  system: <Bell className="h-5 w-5 text-green-600" />,
  info: <Info className="h-5 w-5 text-blue-600" />,
  alert: <AlertCircle className="h-5 w-5 text-red-600" />,
  success: <CheckCircle className="h-5 w-5 text-green-600" />,
};

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line
  }, [user?.id]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Use mockApi or mockData for notifications
      const res = await mockApi.getUserNotifications?.(user?.id, false);
      setNotifications(res?.data || []);
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  if (loading) return <LoadingSpinner message="Loading notifications..." />;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-green-700"><Bell className="h-7 w-7 text-green-600" /> Notifications</h1>
        <div className="flex gap-2">
          <button onClick={markAllRead} className="px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 text-sm">Mark all read</button>
          <button onClick={clearAll} className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 text-sm flex items-center"><Trash2 className="h-4 w-4 mr-1" />Clear all</button>
        </div>
      </div>
      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <Bell className="mx-auto h-10 w-10 text-gray-300 mb-2" />
          <div>No notifications found.</div>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((n, i) => (
            <li key={i} className={`py-4 flex items-start gap-4 ${n.read ? 'bg-gray-50' : 'bg-green-50'}`}>
              <div className="mt-1">{typeIcons[n.type] || <Bell className="h-5 w-5 text-gray-400" />}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${priorityColors[n.priority] || 'text-gray-700'}`}>{n.title}</span>
                  {!n.read && <span className="ml-2 px-2 py-0.5 rounded bg-green-200 text-green-800 text-xs">New</span>}
                </div>
                <div className="text-sm text-gray-700 mt-1">{n.message}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(n.timestamp).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
