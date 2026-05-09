'use client';

import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BookmarksPage() {
  return (
    <div className='flex flex-col items-center w-full py-10 px-4'>
      <div className='container max-w-lg text-center space-y-4'>
        <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15 text-accent'>
          <Bookmark className='h-7 w-7' strokeWidth={1.75} />
        </div>
        <h1 className='text-2xl font-bold tracking-tight text-foreground'>
          Bookmarks
        </h1>
        <p className='text-muted-foreground leading-relaxed'>
          Save your favorite Grad Drive resources here soon. For now, browse
          posters, eBooks, and more from the dashboard.
        </p>
        <div className='flex flex-col sm:flex-row gap-3 justify-center pt-2'>
          <Button asChild className='rounded-xl font-semibold bg-accent text-accent-foreground'>
            <Link href='/dashboard/posters'>Posters &amp; artwork</Link>
          </Button>
          <Button asChild variant='outline' className='rounded-xl font-semibold'>
            <Link href='/dashboard/ebooks'>eBooks</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
