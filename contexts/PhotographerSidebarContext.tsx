'use client';

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

interface PhotographerSidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  openProfileModal: () => void;
  setOpenProfileModal: (fn: () => void) => void;
}

const PhotographerSidebarContext = createContext<PhotographerSidebarContextType | undefined>(undefined);

export function PhotographerSidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsedState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const openProfileModalFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setMounted(true);
    // Load from localStorage
    const saved = localStorage.getItem('photographerSidebarCollapsed');
    if (saved !== null) {
      setIsCollapsedState(saved === 'true');
    }
  }, []);

  const setIsCollapsed = (collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    if (mounted) {
      localStorage.setItem('photographerSidebarCollapsed', collapsed.toString());
    }
  };

  const openProfileModal = useCallback(() => {
    if (openProfileModalFnRef.current) {
      openProfileModalFnRef.current();
    }
  }, []);

  const setOpenProfileModal = useCallback((fn: () => void) => {
    openProfileModalFnRef.current = fn;
  }, []);

  return (
    <PhotographerSidebarContext.Provider value={{ isCollapsed, setIsCollapsed, openProfileModal, setOpenProfileModal }}>
      {children}
    </PhotographerSidebarContext.Provider>
  );
}

export function usePhotographerSidebar() {
  const context = useContext(PhotographerSidebarContext);
  if (context === undefined) {
    throw new Error('usePhotographerSidebar must be used within PhotographerSidebarProvider');
  }
  return context;
}

