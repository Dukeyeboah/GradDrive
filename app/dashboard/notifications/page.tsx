'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Bell, Check, ChevronDown, Loader2, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import {
  listIncomingConnectionRequests,
  respondConnectionRequest,
  type ConnectionRequest,
} from '@/lib/firebase/community-messaging';
import { getGradDriverPublicProfile } from '@/lib/firebase/firestore';

type RequestRow = ConnectionRequest & {
  fromDisplayName?: string;
};

export default function UserNotificationsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const requests = await listIncomingConnectionRequests(user.uid);
      const enriched = await Promise.all(
        requests.map(async (r) => {
          const profile = await getGradDriverPublicProfile(r.fromUid);
          return {
            ...r,
            fromDisplayName: profile?.displayName || undefined,
          };
        }),
      );
      setRows(enriched);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void load();
  }, [load]);

  const respond = async (requestId: string, accept: boolean) => {
    if (!user?.uid) return;
    setBusyId(requestId);
    try {
      const result = await respondConnectionRequest(requestId, user.uid, accept);
      if (!result.ok) {
        toast({
          title: accept ? 'Could not accept' : 'Could not decline',
          description: result.error,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: accept ? 'Connected' : 'Request declined',
        description: accept
          ? 'You can message them from Messages.'
          : 'They were not notified beyond this action.',
      });
      await load();
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center text-muted-foreground'>
        <Loader2 className='h-6 w-6 animate-spin' />
      </div>
    );
  }

  return (
    <div className='w-full px-4 py-8 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6'>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <Bell className='h-6 w-6 text-accent' />
          <h1 className='text-2xl font-bold tracking-tight'>Notifications</h1>
        </div>
        <p className='text-muted-foreground text-sm'>
          Connection requests from other Grad Community members. Approve to open
          messaging; decline if you do not know them.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className='rounded-xl border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground'>
          No pending notifications.
        </div>
      ) : (
        <div className='space-y-3'>
          {rows.map((r) => (
            <Collapsible
              key={r.id}
              defaultOpen={false}
              className='group rounded-xl border border-border bg-card overflow-hidden'
            >
              <CollapsibleTrigger className='flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40'>
                <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-180' />
                <div className='flex-1 min-w-0'>
                  <p className='font-medium truncate'>
                    {r.fromDisplayName || 'A member'} wants to connect
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {r.createdAt?.toDate
                      ? format(r.createdAt.toDate(), 'MMM d, yyyy h:mm a')
                      : 'Recently'}
                  </p>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className='border-t border-border px-4 py-4 space-y-3'>
                <p className='text-sm text-muted-foreground'>
                  If you accept, you can message each other in{' '}
                  <Link href='/dashboard/messages' className='text-accent underline'>
                    Messages
                  </Link>
                  .
                </p>
                <div className='flex flex-wrap gap-2'>
                  <Button
                    type='button'
                    size='sm'
                    className='gap-1.5 rounded-lg bg-accent text-accent-foreground'
                    disabled={busyId === r.id}
                    onClick={() => void respond(r.id, true)}
                  >
                    {busyId === r.id ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      <Check className='h-4 w-4' />
                    )}
                    Accept
                  </Button>
                  <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    className='gap-1.5 rounded-lg'
                    disabled={busyId === r.id}
                    onClick={() => void respond(r.id, false)}
                  >
                    <X className='h-4 w-4' />
                    Decline
                  </Button>
                  <Button asChild size='sm' variant='ghost' className='rounded-lg'>
                    <Link href={`/dashboard/grad-drivers/${r.fromUid}`}>
                      View profile
                    </Link>
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      )}
    </div>
  );
}
