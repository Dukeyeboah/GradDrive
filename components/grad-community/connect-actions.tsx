'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, MessageCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  connectionPairId,
  getConnectUiState,
  getConversationForPair,
  sendConnectionRequest,
  type ConnectUiState,
} from '@/lib/firebase/community-messaging';

export function GradCommunityConnectActions({
  otherUid,
  otherDisplayName,
}: {
  otherUid: string;
  otherDisplayName?: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<ConnectUiState | 'loading'>('loading');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user?.uid) {
      setState('none');
      return;
    }
    setState('loading');
    const s = await getConnectUiState(user.uid, otherUid);
    setState(s);
  }, [user?.uid, otherUid]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleConnect = async () => {
    if (!user?.uid) return;
    setBusy(true);
    const result = await sendConnectionRequest(user.uid, otherUid);
    setBusy(false);
    if (!result.ok) {
      toast({
        title: 'Could not send request',
        description: result.error,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Connection request sent',
      description: `${otherDisplayName || 'This member'} will be notified.`,
    });
    await load();
  };

  const handleMessage = async () => {
    if (!user?.uid) return;
    const convId =
      (await getConversationForPair(user.uid, otherUid)) ??
      connectionPairId(user.uid, otherUid);
    router.push(`/dashboard/messages/${convId}`);
  };

  if (state === 'loading') {
    return (
      <Button variant='outline' size='sm' disabled className='rounded-xl gap-2'>
        <Loader2 className='h-4 w-4 animate-spin' />
        Loading…
      </Button>
    );
  }

  if (state === 'self') return null;

  if (state === 'connected') {
    return (
      <Button
        type='button'
        size='sm'
        className='rounded-xl gap-2 font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
        onClick={() => void handleMessage()}
      >
        <MessageCircle className='h-4 w-4' />
        Message
      </Button>
    );
  }

  if (state === 'outgoing_pending') {
    return (
      <Button variant='secondary' size='sm' disabled className='rounded-xl'>
        Request pending
      </Button>
    );
  }

  if (state === 'incoming_pending') {
    return (
      <Button asChild variant='secondary' size='sm' className='rounded-xl'>
        <Link href='/dashboard/notifications'>Respond to request</Link>
      </Button>
    );
  }

  return (
    <Button
      type='button'
      size='sm'
      className='rounded-xl gap-2 font-semibold'
      disabled={busy}
      onClick={() => void handleConnect()}
    >
      {busy ? (
        <Loader2 className='h-4 w-4 animate-spin' />
      ) : (
        <UserPlus className='h-4 w-4' />
      )}
      Connect
    </Button>
  );
}
