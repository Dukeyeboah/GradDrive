'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebar } from './admin-sidebar';
import Link from 'next/link';

export function AdminHeader() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-16 items-center justify-between px-6'>
        {mounted ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon' className='md:hidden'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-64 p-0'>
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        ) : (
          <Button variant='ghost' size='icon' className='md:hidden' disabled>
            <Menu className='h-5 w-5' />
          </Button>
        )}

        <div className='flex-1 md:hidden min-w-0'>
          <Link
            href='/admin/dashboard'
            className='flex items-center gap-2 min-w-0'
            aria-label='Grad Drive admin home'
          >
            <Image
              src='/images/logo.png'
              alt=''
              width={36}
              height={36}
              className='h-18 w-18 shrink-0 object-contain'
            />
            <Image
              src='/images/graddrive.png'
              alt='Grad Drive'
              width={120}
              height={32}
              className='h-6 w-auto max-w-[100px] object-contain object-left'
            />
            <span className='text-xs font-medium text-muted-foreground shrink-0'>
              Admin
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
