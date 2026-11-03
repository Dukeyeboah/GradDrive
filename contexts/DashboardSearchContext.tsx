'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type DashboardSearchContextValue = {
  searchForcedOpen: boolean;
  setSearchForcedOpen: (open: boolean) => void;
  toggleSearch: () => void;
};

const DashboardSearchContext = createContext<DashboardSearchContextValue | null>(
  null,
);

export function DashboardSearchProvider({ children }: { children: ReactNode }) {
  const [searchForcedOpen, setSearchForcedOpen] = useState(false);

  const toggleSearch = useCallback(() => {
    setSearchForcedOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ searchForcedOpen, setSearchForcedOpen, toggleSearch }),
    [searchForcedOpen, toggleSearch],
  );

  return (
    <DashboardSearchContext.Provider value={value}>
      {children}
    </DashboardSearchContext.Provider>
  );
}

export function useDashboardSearch() {
  const ctx = useContext(DashboardSearchContext);
  if (!ctx) {
    throw new Error(
      'useDashboardSearch must be used within DashboardSearchProvider',
    );
  }
  return ctx;
}
