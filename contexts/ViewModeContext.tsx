'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ViewMode = 'admin' | 'user' | 'photographer-admin';

interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isAdminViewingAsUser: boolean;
  isAdminViewingAsPhotographer: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('admin');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    const saved = typeof window !== 'undefined' ? localStorage.getItem('adminViewMode') : null;
    if (saved === 'user' || saved === 'admin' || saved === 'photographer-admin') {
      setViewModeState(saved as ViewMode);
    }
  }, []);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('adminViewMode', mode);
    }
  };

  const isAdminViewingAsUser = viewMode === 'user';
  const isAdminViewingAsPhotographer = viewMode === 'photographer-admin';

  return (
    <ViewModeContext.Provider
      value={{ viewMode, setViewMode, isAdminViewingAsUser, isAdminViewingAsPhotographer }}
    >
      {children}
    </ViewModeContext.Provider>
  );
}

export function useViewMode() {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
}

