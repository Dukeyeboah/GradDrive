'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { DASHBOARD_SEARCH_ROUTES } from '@/lib/config/user-dashboard';
import { useDashboardSearch } from '@/contexts/DashboardSearchContext';

/** Hidden until the header search icon toggles it open. */
export function DashboardSearchBar() {
  const router = useRouter();
  const { searchForcedOpen, setSearchForcedOpen } = useDashboardSearch();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const visible = searchForcedOpen;

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    }
  }, [visible]);

  const resolveSearch = (raw: string) => {
    const q = raw.trim().toLowerCase();
    if (!q) return '/dashboard/ebooks';
    for (const { keywords, href } of DASHBOARD_SEARCH_ROUTES) {
      if (keywords.some((k) => q.includes(k))) return href;
    }
    return '/dashboard';
  };

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    router.push(resolveSearch(query));
    setQuery('');
    setSearchForcedOpen(false);
  };

  return (
    <div
      className={cn(
        'border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85',
        'transition-all duration-300 ease-out',
        visible
          ? 'pointer-events-auto max-h-20 opacity-100'
          : 'pointer-events-none max-h-0 overflow-hidden border-transparent opacity-0',
      )}
      aria-hidden={!visible}
    >
      <form
        onSubmit={onSearch}
        className='mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8'
      >
        <div className='relative w-full'>
          <Search className='pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search resources, tools, and more...'
            className='h-11 w-full rounded-xl border-border bg-muted/40 pl-10 pr-10 text-sm'
            aria-label='Search dashboard'
            tabIndex={visible ? 0 : -1}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full'
            onClick={() => setSearchForcedOpen(false)}
            aria-label='Close search'
            tabIndex={visible ? 0 : -1}
          >
            <X className='h-4 w-4' />
          </Button>
        </div>
      </form>
    </div>
  );
}
