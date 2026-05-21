'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FOTOMATIC_APP_URL, FOTOMATIC_PHOTOGRAPHERS_URL } from '@/lib/config/fotomatic';

/**
 * Graduation photography is managed on Fotomatic. This page is the admin hub
 * link; there is no in-app photographer directory to maintain here anymore.
 */
export default function AdminPhotographersHubPage() {
  return (
    <div className='p-6 space-y-6 max-w-2xl'>
      <div className='space-y-2'>
        <h1 className='font-bold text-3xl md:text-4xl tracking-tight'>
          Photography &amp; Fotomatic
        </h1>
        <p className='text-muted-foreground leading-relaxed'>
          Photographer listings, packages, and bookings live on{' '}
          <span className='font-medium text-foreground'>Fotomatic</span> — a
          separate product. Grad Drive links members to Fotomatic from the user
          dashboard; you manage photographers and the marketplace there.
        </p>
      </div>

      <Card className='border-border bg-card shadow-sm overflow-hidden'>
        <CardHeader className='space-y-4 pb-2'>
          <div className='flex items-center gap-3'>
            <Image
              src='/fotomaticImages/fotomaticLogo.png'
              alt=''
              width={40}
              height={40}
              className='h-10 w-10 object-contain'
            />
            <Image
              src='/fotomaticImages/fotomatic.png'
              alt='Fotomatic'
              width={140}
              height={36}
              className='h-8 w-auto max-w-[160px] object-contain object-left'
            />
          </div>
          <CardTitle className='text-xl'>Open Fotomatic</CardTitle>
          <CardDescription className='text-base leading-relaxed'>
            Administer photographers, availability, and bookings on{' '}
            <span className='font-medium text-foreground'>fotomatic.app</span>.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-3 pb-8'>
          <Button
            asChild
            size='lg'
            className='w-full sm:w-auto rounded-xl gap-2 font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
          >
            <Link
              href={FOTOMATIC_PHOTOGRAPHERS_URL}
              target='_blank'
              rel='noopener noreferrer'
            >
              <ExternalLink className='h-4 w-4' />
              Fotomatic photographers
            </Link>
          </Button>
          <Button variant='outline' asChild className='w-full sm:w-auto rounded-xl'>
            <Link href={FOTOMATIC_APP_URL} target='_blank' rel='noopener noreferrer'>
              <ExternalLink className='h-4 w-4' />
              Fotomatic home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
