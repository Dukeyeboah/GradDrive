'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Copy, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FOTOMATIC_PHOTOGRAPHERS_URL } from '@/lib/config/fotomatic';
import { resolveMemberAccessSettings } from '@/lib/config/resolve-member-access';
import { getPlatformSettings } from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export default function PhotographersPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(10);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const settings = await getPlatformSettings();
      if (cancelled) return;
      const resolved = resolveMemberAccessSettings(settings);
      setDiscountCode(resolved.fotomaticDiscountCode);
      setDiscountPercent(resolved.fotomaticDiscountPercent);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const copyDiscountCode = useCallback(async () => {
    if (!discountCode) return;
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      toast({
        title: 'Code copied',
        description: 'Paste it at checkout on Fotomatic.',
      });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Could not copy',
        description: 'Select the code and copy it manually.',
        variant: 'destructive',
      });
    }
  }, [discountCode, toast]);

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
            <p className='text-sm leading-relaxed text-muted-foreground text-pretty'>
              As a Grad Drive member, you get{' '}
              {loading ? (
                'a member discount'
              ) : (
                <span className='font-medium text-foreground'>
                  {discountPercent}% off
                </span>
              )}{' '}
              on Fotomatic bookings. Use the code below at checkout.
            </p>
          </CardHeader>
          <CardContent className='flex flex-col gap-4 pb-8'>
            <div className='rounded-xl border border-border/80 bg-muted/40 p-4'>
              <p className='text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2'>
                Member discount code
                {!loading && discountPercent > 0 ? (
                  <span className='normal-case font-normal ml-1'>
                    · {discountPercent}% off
                  </span>
                ) : null}
              </p>
              {loading ? (
                <div className='flex justify-center py-3'>
                  <Loader2 className='h-5 w-5 animate-spin text-muted-foreground' />
                </div>
              ) : (
                <div className='flex items-center gap-2'>
                  <code className='flex-1 truncate rounded-lg bg-background px-3 py-2 text-sm font-semibold tracking-wide text-foreground border border-border/60'>
                    {discountCode}
                  </code>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    className='shrink-0 gap-1.5 rounded-lg'
                    onClick={() => void copyDiscountCode()}
                    aria-label='Copy discount code'
                  >
                    {copied ? (
                      <>
                        <Check className='h-4 w-4' />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className='h-4 w-4' />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
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
