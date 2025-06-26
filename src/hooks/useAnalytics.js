// src/hooks/useAnalytics.js
import { useState, useEffect, useCallback } from 'react';
import analyticsApi from '../services/analyticsApi';

export const useAnalytics = (type = 'system', tenantId = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      let analyticsData;
      if (type === 'system') {
        analyticsData = await analyticsApi.getSystemAnalytics();
      } else if (type === 'tenant' && tenantId) {
        analyticsData = await analyticsApi.getTenantAnalytics(tenantId);
      } else {
        throw new Error('Invalid analytics type or missing tenant ID');
      }
      
      setData(analyticsData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching analytics:', err);
      
      // Fallback to mock data on error
      if (type === 'system') {
        setData(analyticsApi.getMockSystemAnalytics());
      } else if (type === 'tenant') {
        setData(analyticsApi.getMockTenantAnalytics());
      }
    } finally {
      setLoading(false);
    }
  }, [type, tenantId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const refreshData = useCallback(async () => {
    await fetchAnalytics();
  }, [fetchAnalytics]);

  return { 
    data, 
    loading, 
    error, 
    refreshData,
    isSystemAnalytics: type === 'system',
    isTenantAnalytics: type === 'tenant'
  };
};