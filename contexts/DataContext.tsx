'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { getAnalytics, getAllUsers, getDownloadBreakdown, type AnalyticsData } from '@/lib/firebase/firestore';

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
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [users, setUsers] = useState<any[] | null>(null);
  const [downloadBreakdown, setDownloadBreakdown] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const refreshAnalytics = useCallback(async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  }, []);

  const refreshUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  }, []);

  const refreshDownloadBreakdown = useCallback(async () => {
    try {
      const data = await getDownloadBreakdown();
      setDownloadBreakdown(data);
    } catch (error) {
      console.error('Error refreshing download breakdown:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
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
  }, [refreshAnalytics, refreshUsers, refreshDownloadBreakdown]);

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

