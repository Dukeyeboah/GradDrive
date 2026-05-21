'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, UserRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  listVisibleGradDriverProfiles,
  type GradDriverPublicProfile,
} from '@/lib/firebase/firestore';

function interestSnippet(text: string | null | undefined, max = 72) {
  if (!text?.trim()) return null;
  const t = text.trim();
  return t.length <= max ? t : `${t.slice(0, max)}…`;
}

export default function GradDriversDirectoryPage() {
  const [profiles, setProfiles] = useState<GradDriverPublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const list = await listVisibleGradDriverProfiles();
      if (!cancelled) {
        setProfiles(list);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return profiles;
    return profiles.filter((p) => {
      const hay = [
        p.displayName,
        p.collegeName,
        p.collegeGroup,
        p.major,
        p.graduationYear,
        p.interests,
        p.bio,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [profiles, q]);

  return (
    <div className='w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10'>
      <div className='mx-auto max-w-6xl space-y-8'>
        <div className='space-y-3 text-center sm:text-left'>
          <h1 className='text-3xl font-bold tracking-tight text-balance md:text-4xl'>
            Grad Drivers
          </h1>
          <p className='text-lg text-muted-foreground text-pretty max-w-2xl mx-auto sm:mx-0'>
            Discover other members by school, graduation year, and interests. Open a
            profile to learn more and connect.
          </p>
        </div>

        <div className='relative max-w-md'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            type='search'
            placeholder='Search by name, school, year, interests…'
            className='pl-9 rounded-xl border-border'
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label='Search grad drivers'
          />
        </div>

        {loading ? (
          <p className='text-sm text-muted-foreground'>Loading directory…</p>
        ) : filtered.length === 0 ? (
          <Card className='border-dashed border-border bg-card/60'>
            <CardHeader>
              <CardTitle>No profiles match</CardTitle>
              <CardDescription>
                Try a different search, or encourage friends to complete their Grad
                Drivers profile under Settings.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <ul className='grid gap-5 sm:grid-cols-2 xl:grid-cols-3'>
            {filtered.map((p) => (
              <li key={p.uid}>
                <Card className='h-full overflow-hidden border-border/80 shadow-sm transition-shadow hover:shadow-md'>
                  <CardContent className='p-0'>
                    <div className='flex flex-col gap-4 p-5'>
                      <div className='flex items-start gap-4'>
                        <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border bg-muted'>
                          {p.photoURL ? (
                            <img
                              src={p.photoURL}
                              alt=''
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                              <UserRound className='h-8 w-8' strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <div className='min-w-0 flex-1 space-y-1'>
                          <p className='font-semibold text-foreground truncate'>
                            {p.displayName || 'Grad Driver'}
                          </p>
                          <p className='text-sm text-muted-foreground line-clamp-2'>
                            {[p.collegeName, p.graduationYear && `’${String(p.graduationYear).slice(-2)}`]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                          {interestSnippet(p.interests) && (
                            <p className='text-xs text-muted-foreground line-clamp-2'>
                              {interestSnippet(p.interests)}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        asChild
                        variant='secondary'
                        className='w-full rounded-xl font-semibold'
                      >
                        <Link href={`/dashboard/grad-drivers/${p.uid}`}>
                          View full profile
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
