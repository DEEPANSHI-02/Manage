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
            
            // Set token expiration (15 minutes from now)
            const expiresAt = Date.now() + 15 * 60 * 1000;
            localStorage.setItem('tokenExpiresAt', expiresAt);
            
            // Set the auth state
            set({
              user,
              token: access_token,
              isAuthenticated: true,
              loading: false,
              userRole,
              permissions,
              tokenExpiresAt: expiresAt // NEW
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
          permissions: [],
          tokenExpiresAt: null // NEW
        });
        localStorage.removeItem('tokenExpiresAt'); // NEW
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
       * Initialize authentication state from token - ENHANCED VERSION
       */
      initializeAuth: async () => {
        try {
          const { token } = get();
          // Check token expiration
          const expiresAt = Number(localStorage.getItem('tokenExpiresAt'));
          if (expiresAt && Date.now() > expiresAt) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false,
              userRole: null,
              permissions: [],
              tokenExpiresAt: null
            });
            localStorage.removeItem('tokenExpiresAt');
            toast.error('Session expired. Please log in again.');
            return;
          }
          if (!token) {
            console.log('🔍 No token found, skipping auth initialization');
            return;
          }
          
          console.log('🔄 Initializing auth from stored token...');
          set({ loading: true });
          
          const response = await mockApi.getCurrentUser(); // FIXED: Using mockApi
          
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
            console.log('❌ Token invalid, clearing auth state');
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
          console.log('❌ Auth initialization failed, clearing auth state:', error);
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            userRole: null,
            permissions: []
          });
        }
      },
      
      /**
       * Check if token is expired and auto-logout if so
       */
      checkTokenValidity: () => {
        const { tokenExpiresAt, isAuthenticated, logout } = get();
        const expiresAt = tokenExpiresAt || Number(localStorage.getItem('tokenExpiresAt'));
        if (isAuthenticated && expiresAt && Date.now() > expiresAt) {
          toast.error('Session expired. Please log in again.');
          logout();
          return false;
        }
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