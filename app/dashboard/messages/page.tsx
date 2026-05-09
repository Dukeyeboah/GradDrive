'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MessagesPage() {
  return (
    <div className='flex flex-col items-center w-full py-10 px-4'>
      <div className='container max-w-lg text-center space-y-4'>
        <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent'>
          <MessageSquare className='h-7 w-7' strokeWidth={1.75} />
        </div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          Messages
        </h1>
        <p className='text-muted-foreground leading-relaxed'>
          You don&apos;t have any messages yet. Updates from Grad Drive will
          appear here when available.
        </p>
        <Button asChild variant='outline' className='rounded-xl font-semibold'>
          <Link href='/dashboard'>Back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
