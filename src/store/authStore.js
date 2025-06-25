import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { completeMockApi } from '../services/mockApi';
import toast from 'react-hot-toast';

/**
 * Enhanced Authentication Store with Role-Based Access
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
      
      /**
       * Login function with role detection based on demo credentials
       */
      login: async (credentials) => {
        try {
          set({ loading: true });
          
          const response = await mockApi.login(credentials);
          
          if (response.success) {
            const { access_token, user_id, name, email, tenant_id, organization_id } = response.data;
            
            // Get user details including roles
            const userDetailsResponse = await mockApi.getCurrentUser();
            const userDetails = userDetailsResponse.data;
            
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
              toast.success('Welcome System Administrator!');
            } else if (cleanEmail === 'sarah.manager@techcorp.com') {
              userRole = 'tenant_admin';
              permissions = ['tenant.manage', 'user.manage', 'organization.manage', 'role.manage'];
              console.log('✅ Assigned role: tenant_admin');
              toast.success('Welcome Tenant Administrator!');
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
            
            set({
              user,
              token: access_token,
              isAuthenticated: true,
              loading: false,
              userRole,
              permissions
            });
            
            return { success: true };
          } else {
            throw new Error(response.message || 'Login failed');
          }
        } catch (error) {
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
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          userRole: null,
          permissions: []
        });
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
       * Check if user is system admin
       */
      isSystemAdmin: () => {
        const { userRole } = get();
        return userRole === 'system_admin';
      },
      
      /**
       * Check if user is tenant admin
       */
      isTenantAdmin: () => {
        const { userRole } = get();
        return userRole === 'tenant_admin';
      },
      
      /**
       * Check if user is regular user
       */
      isRegularUser: () => {
        const { userRole } = get();
        return userRole === 'user';
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
       * Initialize authentication state from token
       */
      initializeAuth: async () => {
        try {
          const { token } = get();
          if (!token) return;
          
          set({ loading: true });
          
          const response = await mockApi.getCurrentUser();
          
          if (response.success) {
            // Re-determine role based on stored user data
            const user = response.data;
            let userRole = 'user';
            let permissions = [];
            
            console.log('=== INIT AUTH ROLE DETECTION ===');
            console.log('User email from response:', user.email);
            
            // Clean email to handle any whitespace issues
            const cleanEmail = user.email?.trim()?.toLowerCase();
            console.log('Clean email:', cleanEmail);
            
            if (cleanEmail === 'admin@techcorp.com') {
              userRole = 'system_admin';
              permissions = ['all'];
              console.log('✅ InitAuth - Assigned role: system_admin');
            } else if (cleanEmail === 'sarah.manager@techcorp.com') {
              userRole = 'tenant_admin';
              permissions = ['tenant.manage', 'user.manage', 'organization.manage', 'role.manage'];
              console.log('✅ InitAuth - Assigned role: tenant_admin');
            } else {
              userRole = 'user';
              permissions = ['user.read', 'profile.update'];
              console.log('✅ InitAuth - Assigned role: user');
            }
            
            console.log('InitAuth Final userRole:', userRole);
            
            set({
              user: response.data,
              isAuthenticated: true,
              loading: false,
              userRole,
              permissions
            });
          } else {
            // Token is invalid, clear auth state
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
              userRole: null,
              permissions: []
            });
          }
        } catch (error) {
          // Token is invalid, clear auth state
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            userRole: null,
            permissions: []
          });
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userRole: state.userRole,
        permissions: state.permissions
      }),
    }
  )
);

export default useAuthStore;