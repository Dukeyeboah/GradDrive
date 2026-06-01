'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  listMyConversations,
  type Conversation,
} from '@/lib/firebase/community-messaging';
import { getGradDriverPublicProfile } from '@/lib/firebase/firestore';

type ThreadRow = Conversation & { otherUid: string; otherName: string };

export default function MessagesPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      const convs = await listMyConversations(user.uid);
      const enriched: ThreadRow[] = [];
      for (const c of convs) {
        const otherUid =
          c.participantUids.find((id) => id !== user.uid) ?? '';
        const profile = otherUid
          ? await getGradDriverPublicProfile(otherUid)
          : null;
        enriched.push({
          ...c,
          otherUid,
          otherName: profile?.displayName || 'Member',
        });
      }
      setThreads(enriched);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className='w-full px-4 py-8 sm:px-6 lg:px-8 max-w-2xl mx-auto space-y-6'>
      <div className='space-y-2'>
        <div className='flex items-center gap-2'>
          <MessageSquare className='h-6 w-6 text-accent' />
          <h1 className='text-2xl font-bold tracking-tight'>Messages</h1>
        </div>
        <p className='text-muted-foreground text-sm'>
          Chats with members you are connected with in Grad Community.
        </p>
      </div>

      {loading ? (
        <div className='flex justify-center py-12'>
          <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
        </div>
      ) : threads.length === 0 ? (
        <div className='rounded-xl border border-dashed border-border px-6 py-12 text-center space-y-3'>
          <p className='text-sm text-muted-foreground'>
            No conversations yet. Connect with someone in{' '}
            <Link href='/dashboard/grad-drivers' className='text-accent underline'>
              Grad Community
            </Link>{' '}
            to start messaging.
          </p>
          <Button asChild variant='outline' className='rounded-xl'>
            <Link href='/dashboard/grad-drivers'>Browse directory</Link>
          </Button>
        </div>
      ) : (
        <ul className='space-y-2'>
          {threads.map((t) => (
            <li key={t.id}>
              <Link
                href={`/dashboard/messages/${t.id}`}
                className='flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:bg-muted/40 transition-colors'
              >
                <div className='min-w-0'>
                  <p className='font-medium truncate'>{t.otherName}</p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {t.lastMessageText?.trim() || 'No messages yet'}
                  </p>
                </div>
                {t.lastMessageAt?.toDate ? (
                  <span className='text-xs text-muted-foreground shrink-0'>
                    {format(t.lastMessageAt.toDate(), 'MMM d')}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
