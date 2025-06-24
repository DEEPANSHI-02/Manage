import React from 'react';

/**
 * Loading Spinner Component
 * Displays a centered loading animation
 */
const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div 
          className={`
            animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 mx-auto
            ${sizeClasses[size]}
          `}
        ></div>
        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;