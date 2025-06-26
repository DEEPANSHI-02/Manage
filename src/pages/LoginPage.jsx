import React, { useState }  from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom'; // ADDED: Missing import
import { Eye, EyeOff, LogIn, Building, Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
// Add this import at the top of LoginPage.jsx
import { mockApi } from '../services/mockApi';

/**
 * Login Page Component
 * Handles user authentication with email/password
 */
const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate(); // ADDED: Missing navigate hook
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  /**
   * Handle form submission - FIXED VERSION
   */
   const onSubmit = async (data) => {
    try {
      clearErrors();
      console.log('🚀 Login form submitted with:', { ...data, password: '***' });
      
      const result = await login({
        email: data.email,
        password: data.password,
        tenant_id: data.tenant_id || undefined,
        rememberMe
      });

      console.log('📋 Login result:', result);

      if (result.success) {
        console.log('✅ Login successful, navigating to dashboard...');
        
        // FIXED: Added proper navigation
        navigate('/dashboard', { replace: true });
        
      } else {
        console.log('❌ Login failed:', result.error);
        setError('root', {
          type: 'manual',
          message: result.error || 'Login failed'
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('root', {
        type: 'manual',
        message: error.message || 'An unexpected error occurred'
      });
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your User Management System
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`
                    block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    ${errors.email ? 'border-red-300' : 'border-gray-300'}
                  `}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={`
                    block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                    ${errors.password ? 'border-red-300' : 'border-gray-300'}
                  `}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Tenant ID Field (Optional) */}
            <div>
              <label htmlFor="tenant_id" className="block text-sm font-medium text-gray-700">
                Tenant ID <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="mt-1">
                <input
                  id="tenant_id"
                  type="text"
                  placeholder="Enter tenant ID if required"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
                           focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  {...register('tenant_id')}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  group relative w-full flex justify-center py-2 px-4 border border-transparent
                  text-sm font-medium rounded-md text-white
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }
                  transition duration-150 ease-in-out
                `}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign in
                  </div>
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Admin:</strong> admin@techcorp.com / admin123</p>
              <p><strong>Manager:</strong> sarah.manager@techcorp.com / manager123</p>
              <p><strong>User:</strong> mike.developer@techcorp.com / user123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>User Management System v1.0</p>
          <p className="mt-1">© 2024 TechCorp Solutions. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;