import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockApi } from '../services/mockApi'; // FIXED IMPORT
import toast from 'react-hot-toast';

/**
 * Enhanced Authentication Store with Role-Based Access - FIXED VERSION
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      userRole: null, // 'system_admin', 'tenant_admin', 'user'
      permissions: [],
      tokenExpiresAt: null, // NEW: expiration timestamp
      
      /**
       * Login function with role detection based on demo credentials - FIXED VERSION
       */
      login: async (credentials) => {
        try {
          set({ loading: true });
          
          console.log('🔐 Starting login process...');
          console.log('Credentials:', { ...credentials, password: '***' });
          
          const response = await mockApi.login(credentials); // FIXED: Using mockApi instead of completeMockApi
          
          if (response.success) {
            const { access_token, user_id, name, email, tenant_id, organization_id } = response.data;
            
            console.log('✅ Login API successful, getting user details...');
            
            // Get user details including roles
            const userDetailsResponse = await mockApi.getCurrentUser(); // FIXED: Using mockApi
            const userDetails = userDetailsResponse.data;
            
            console.log('✅ User details retrieved:', userDetails);
            
            // Determine user role based on email (matching demo credentials)
            let userRole = 'user'; // default
            let permissions = [];
            
            // Role detection based on demo credentials from LoginPage
            console.log('=== LOGIN ROLE DETECTION ===');
            console.log('Email received:', email);
            console.log('Email type:', typeof email);
            console.log('Email length:', email?.length);
            
            // Clean email to handle any whitespace issues
            const cleanEmail = email?.trim()?.toLowerCase();
            console.log('Clean email:', cleanEmail);
            
            if (cleanEmail === 'admin@techcorp.com') {
              userRole = 'system_admin';
              permissions = ['all']; // System admin has all permissions
              console.log('✅ Assigned role: system_admin');
            } else if (cleanEmail === 'sarah.manager@techcorp.com') {
              userRole = 'tenant_admin';
              permissions = ['tenant.manage', 'user.manage', 'organization.manage', 'role.manage'];
              console.log('✅ Assigned role: tenant_admin');
            } else if (cleanEmail === 'mike.developer@techcorp.com') {
              userRole = 'user';
              permissions = ['user.read', 'profile.update'];
              console.log('✅ Assigned role: user');
              toast.success('Welcome User!');
            } else {
              // Default role for any other users
              userRole = 'user';
              permissions = ['user.read', 'profile.update'];
              console.log('⚠️ Assigned role: user (default) for email:', cleanEmail);
              toast.success(`Welcome ${name}!`);
            }
            
            console.log('Final userRole:', userRole);
            console.log('Final permissions:', permissions);
            
            const user = {
              id: user_id,
              name,
              email,
              tenant_id,
              organization_id,
              roles: userDetails.roles || [],
              privileges: userDetails.privileges || []
            };
            
            // Always use localStorage for session persistence
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('userRole', userRole);
            localStorage.setItem('permissions', JSON.stringify(permissions));
            
            // Set the auth state
            set({
              user,
              token: access_token,
              isAuthenticated: true,
              loading: false,
              userRole,
              permissions
            });
            
            // Debug the final state
            console.log('=== AuthStore State After Login ===');
            console.log('userRole set to:', userRole);
            console.log('isAuthenticated:', true);
            console.log('user:', user);
            console.log('token set:', !!access_token);
            
            return { success: true };
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
          console.error('❌ Login error:', error);
          set({ loading: false });
          const errorMessage = error.response?.data?.message || error.message || 'Login failed';
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },
      
      /**
       * Logout function
       */
      logout: () => {
        console.log('🚪 Logging out...');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          userRole: null,
          permissions: []
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        localStorage.removeItem('permissions');
        toast.success('Logged out successfully');
      },
      
      /**
       * Check if user has specific permission
       */
      hasPermission: (permission) => {
        const { permissions, userRole } = get();
        if (userRole === 'system_admin') return true; // System admin has all permissions
        return permissions.includes(permission);
      },
      
      /**
       * Check if user is system admin - ENHANCED WITH DEBUGGING
       */
      isSystemAdmin: () => {
        const { userRole } = get();
        const result = userRole === 'system_admin';
        console.log('🔍 isSystemAdmin check:', { userRole, result });
        return result;
      },
      
      /**
       * Check if user is tenant admin - ENHANCED WITH DEBUGGING
       */
      isTenantAdmin: () => {
        const { userRole } = get();
        const result = userRole === 'tenant_admin';
        console.log('🔍 isTenantAdmin check:', { userRole, result });
        return result;
      },
      
      /**
       * Check if user is regular user - ENHANCED WITH DEBUGGING
       */
      isRegularUser: () => {
        const { userRole } = get();
        const result = userRole === 'user';
        console.log('🔍 isRegularUser check:', { userRole, result });
        return result;
      },
      
      /**
       * Get dashboard type based on role
       */
      getDashboardType: () => {
        const { userRole } = get();
        return userRole || 'user';
      },
      
      /**
       * Get user role display name
       */
      getRoleDisplayName: () => {
        const { userRole } = get();
        switch (userRole) {
          case 'system_admin':
            return 'System Administrator';
          case 'tenant_admin':
            return 'Tenant Administrator';
          case 'user':
            return 'User';
          default:
            return 'User';
        }
      },
      
      /**
       * Update user profile
       */
      updateProfile: async (profileData) => {
        try {
          set({ loading: true });
          
          const response = await mockApi.updateProfile(profileData);
          
          if (response.success) {
            const currentUser = get().user;
            const updatedUser = { ...currentUser, ...response.data };
            
            set({
              user: updatedUser,
              loading: false
            });
            
            toast.success('Profile updated successfully');
            return { success: true };
          } else {
            throw new Error(response.message || 'Profile update failed');
          }
        } catch (error) {
          set({ loading: false });
          const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },
      
      /**
       * Initialize authentication from localStorage
       */
      initializeAuth: () => {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        const userRole = localStorage.getItem('userRole');
        const permissions = JSON.parse(localStorage.getItem('permissions')) || [];
        if (token && user) {
          set({
            token,
            user,
            isAuthenticated: true,
            userRole,
            permissions
          });
        }
      },
      
      /**
       * Check token validity (always valid now)
       */
      checkTokenValidity: () => {
        // No-op: always valid until logout
        return true;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
        permissions: state.permissions,
        tokenExpiresAt: state.tokenExpiresAt // NEW
      }),
    }
  )
);

export default useAuthStore;