import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import UserPortal from './UserPortal';

/**
 * UserPortal Wrapper Component
 * Handles URL-based section switching for the UserPortal
 * This ensures that direct navigation to specific sections works correctly
 */
const UserPortalWrapper = () => {
  const location = useLocation();

  // Function to determine the active section based on URL
  const getActiveSectionFromURL = () => {
    const path = location.pathname;
    
    // Map URLs to UserPortal sections
    const urlSectionMap = {
      '/dashboard': 'overview',
      '/my-profile': 'profile',
      '/profile': 'profile', // Legacy route support
      '/my-organization': 'organization',
      '/legal-entities': 'legal-entities',
      '/activity': 'activity',
      '/security': 'security',
      '/my-settings': 'preferences',
      '/settings': 'preferences' // Legacy route support
    };

    return urlSectionMap[path] || 'overview';
  };

  // Log the current section for debugging
  useEffect(() => {
    const activeSection = getActiveSectionFromURL();
    console.log('UserPortal - Active section from URL:', activeSection, 'Path:', location.pathname);
  }, [location.pathname]);

  return <UserPortal />;
};

export default UserPortalWrapper;