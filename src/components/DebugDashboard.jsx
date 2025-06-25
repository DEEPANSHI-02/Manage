import React from 'react';
import { useAuth } from '../hooks/useAuth';

/**
 * Debug component to check role detection
 */
const DebugDashboard = () => {
  const { user, userRole, isAuthenticated, permissions, isSystemAdmin, isTenantAdmin, isRegularUser } = useAuth();

  return (
    <div className="p-6 bg-white rounded-lg shadow max-w-4xl">
      <h1 className="text-2xl font-bold mb-4 text-red-600">🐛 DEBUG DASHBOARD INFO</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-3 bg-blue-50 rounded">
            <strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}
          </div>
          
          <div className="p-3 bg-blue-50 rounded">
            <strong>User Email:</strong> {user?.email || '❌ Not available'}
          </div>
          
          <div className="p-3 bg-blue-50 rounded">
            <strong>User Name:</strong> {user?.name || '❌ Not available'}
          </div>
          
          <div className="p-3 bg-yellow-50 rounded">
            <strong>Detected Role:</strong> 
            <span className="ml-2 font-mono text-lg">
              {userRole || '❌ Not detected'}
            </span>
          </div>
          
          <div className="p-3 bg-green-50 rounded">
            <strong>Role Checks:</strong>
            <div className="ml-4 mt-2 space-y-1">
              <div>System Admin: {isSystemAdmin() ? '✅' : '❌'}</div>
              <div>Tenant Admin: {isTenantAdmin() ? '✅' : '❌'}</div>
              <div>Regular User: {isRegularUser() ? '✅' : '❌'}</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 rounded">
            <strong>Permissions:</strong> 
            <div className="mt-2">
              {permissions?.length > 0 ? (
                <ul className="list-disc list-inside">
                  {permissions.map((perm, index) => (
                    <li key={index} className="text-sm">{perm}</li>
                  ))}
                </ul>
              ) : (
                '❌ None'
              )}
            </div>
          </div>
          
          <div className="p-3 bg-green-50 rounded">
            <strong>Expected Dashboard:</strong>
            <div className="mt-2 font-semibold">
              {userRole === 'system_admin' && '🔧 System Admin Dashboard (Blue Theme)'}
              {userRole === 'tenant_admin' && '🏢 Tenant Admin Dashboard (Green Theme)'} 
              {userRole === 'user' && '👤 User Dashboard (Default Theme)'}
              {!userRole && '❌ Unknown - Should default to User Dashboard'}
            </div>
          </div>
          
          <div className="p-3 bg-red-50 rounded">
            <strong>Debug Instructions:</strong>
            <div className="text-sm mt-2">
              1. Login with: sarah.manager@techcorp.com<br/>
              2. Expected Role: tenant_admin<br/>
              3. Expected Dashboard: Green-themed Tenant Admin<br/>
              4. If seeing User Dashboard, role detection failed
            </div>
          </div>
        </div>
      </div>
        
      <div className="mt-6 p-4 bg-gray-100 rounded">
        <strong>Full User Object:</strong>
        <pre className="text-xs mt-2 overflow-auto bg-white p-2 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <strong>Browser Console Logs:</strong>
        <div className="text-sm mt-2 text-gray-600">
          Check browser console (F12) for detailed role detection logs
        </div>
      </div>
    </div>
  );
};

export default DebugDashboard;