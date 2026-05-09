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
import { FOTOMATIC_PHOTOGRAPHERS_URL } from '@/lib/config/fotomatic';

/**
 * In-app photographer directory removed; bookings happen on Fotomatic.
 * Legacy implementation lived here before the Fotomatic split — see git history if needed.
 */
export default function PhotographersPage() {
  return (
    <div className='w-full px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-lg'>
        <Card className='overflow-hidden rounded-2xl border-border/80 shadow-md transition-all duration-300 hover:shadow-lg'>
          <CardHeader className='space-y-4 text-center pb-2'>
            <div className='mx-auto flex items-center justify-center gap-3 pt-2'>
              <Image
                src='/fotomaticImages/fotomaticLogo.png'
                alt=''
                width={48}
                height={48}
                className='h-12 w-12 object-contain'
              />
              <Image
                src='/fotomaticImages/fotomatic.png'
                alt='Fotomatic'
                width={160}
                height={40}
                className='h-8 w-auto max-w-[140px] object-contain object-left'
              />
            </div>
            <CardTitle className='text-xl md:text-2xl font-bold tracking-tight'>
              Book photographers on Fotomatic
            </CardTitle>
            <CardDescription className='text-base leading-relaxed text-pretty'>
              Graduation shoots are booked through{' '}
              <span className='font-medium text-foreground'>Fotomatic</span>—our
              partner network for trusted photographers. Open Fotomatic to browse
              availability, packages, and book your session.
            </CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 pb-8'>
            <Button
              asChild
              size='lg'
              className='w-full rounded-xl gap-2 font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
            >
              <Link
                href={FOTOMATIC_PHOTOGRAPHERS_URL}
                target='_blank'
                rel='noopener noreferrer'
              >
                <ExternalLink className='h-4 w-4' />
                Go to Fotomatic
              </Link>
            </Button>
            <p className='text-center text-xs text-muted-foreground'>
              You&apos;ll leave Grad Drive and open{' '}
              <span className='font-medium'>fotomatic.app</span> in a new tab.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
