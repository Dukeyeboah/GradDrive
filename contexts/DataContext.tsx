'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAnalytics, getAllUsers, getDownloadBreakdown, type AnalyticsData } from '@/lib/firebase/firestore';
import { useAuth } from './AuthContext';

interface DataContextType {
  analytics: AnalyticsData | null;
  users: any[] | null;
  downloadBreakdown: {
    posters: any[];
    ebooks: any[];
    capDesigns: any[];
  } | null;
  loading: boolean;
  refreshAnalytics: () => Promise<void>;
  refreshUsers: () => Promise<void>;
  refreshDownloadBreakdown: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  analytics: null,
  users: null,
  downloadBreakdown: null,
  loading: true,
  refreshAnalytics: async () => {},
  refreshUsers: async () => {},
  refreshDownloadBreakdown: async () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, userData } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<any[] | null>(null);
  const [downloadBreakdown, setDownloadBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const refreshAnalytics = useCallback(async () => {
    // Only fetch analytics if user is authenticated and is admin
    if (!user || !userData || (userData.role !== 'admin' && userData.role !== 'super admin')) {
      return;
    }
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      // Silently handle permission errors - user might not have admin role set yet
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        console.warn('Analytics: Permission denied - user may not have admin role yet');
        return;
      }
      console.error('Error refreshing analytics:', error);
    }
  }, [user, userData]);

  const refreshUsers = useCallback(async () => {
    // Only fetch users if user is authenticated and is admin
    if (!user || !userData || (userData.role !== 'admin' && userData.role !== 'super admin')) {
      return;
    }
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error: any) {
      // Silently handle permission errors - user might not have admin role set yet
      if (error?.code === 'permission-denied' || error?.message?.includes('permission')) {
        console.warn('Users: Permission denied - user may not have admin role yet');
        return;
      }
      console.error('Error refreshing users:', error);
    }
  }, [user, userData]);

  const refreshDownloadBreakdown = useCallback(async () => {
    // Only fetch download breakdown if user is authenticated and is admin
    if (!user || !userData || (userData.role !== 'admin' && userData.role !== 'super admin')) {
      return;
    }
    try {
      const data = await getDownloadBreakdown();
      setDownloadBreakdown(data);
    } catch (error) {
      console.error('Error refreshing download breakdown:', error);
    }
  }, [user, userData]);

  // Initial load - only fetch if user is authenticated and is admin
  useEffect(() => {
    const loadInitialData = async () => {
      // Only load data if user is authenticated and is admin
      if (!user || !userData || (userData.role !== 'admin' && userData.role !== 'super admin')) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await Promise.all([
          refreshAnalytics(),
          refreshUsers(),
          refreshDownloadBreakdown(),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [user, userData, refreshAnalytics, refreshUsers, refreshDownloadBreakdown]);

  return (
    <DataContext.Provider
      value={{
        analytics,
        users,
        downloadBreakdown,
        loading,
        refreshAnalytics,
        refreshUsers,
        refreshDownloadBreakdown,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}




