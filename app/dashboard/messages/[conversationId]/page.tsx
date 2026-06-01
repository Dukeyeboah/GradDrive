'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  sendChatMessage,
  subscribeChatMessages,
  type ChatMessage,
} from '@/lib/firebase/community-messaging';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getGradDriverPublicProfile } from '@/lib/firebase/firestore';

export default function ConversationPage() {
  const params = useParams();
  const conversationId =
    typeof params?.conversationId === 'string' ? params.conversationId : '';
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [otherName, setOtherName] = useState('Member');
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId || !user?.uid) return;
    let cancelled = false;
    (async () => {
      const snap = await getDoc(doc(db, 'conversations', conversationId));
      if (!snap.exists()) {
        if (!cancelled) setAllowed(false);
        return;
      }
      const participants = snap.data()?.participantUids as string[] | undefined;
      if (!participants?.includes(user.uid)) {
        if (!cancelled) setAllowed(false);
        return;
      }
      const otherUid = participants.find((id) => id !== user.uid) ?? '';
      const profile = otherUid
        ? await getGradDriverPublicProfile(otherUid)
        : null;
      if (!cancelled) {
        setOtherName(profile?.displayName || 'Member');
        setAllowed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [conversationId, user?.uid]);

  useEffect(() => {
    if (!conversationId || allowed !== true) return;
    const unsub = subscribeChatMessages(conversationId, setMessages);
    return () => unsub();
  }, [conversationId, allowed]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !conversationId) return;
    setSending(true);
    const result = await sendChatMessage(conversationId, user.uid, text);
    setSending(false);
    if (!result.ok) {
      toast({
        title: 'Send failed',
        description: result.error,
        variant: 'destructive',
      });
      return;
    }
    setText('');
  };

  if (allowed === null) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center'>
        <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
      </div>
    );
  }

  if (allowed === false) {
    return (
      <div className='px-4 py-12 text-center space-y-4'>
        <p className='text-muted-foreground'>This conversation is not available.</p>
        <Button asChild variant='outline' className='rounded-xl'>
          <Link href='/dashboard/messages'>Back to Messages</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] max-w-2xl mx-auto w-full'>
      <div className='flex items-center gap-2 border-b border-border px-4 py-3 shrink-0'>
        <Button asChild variant='ghost' size='icon' className='shrink-0'>
          <Link href='/dashboard/messages' aria-label='Back'>
            <ArrowLeft className='h-5 w-5' />
          </Link>
        </Button>
        <h1 className='font-semibold truncate'>{otherName}</h1>
      </div>

      <div className='flex-1 overflow-y-auto px-4 py-4 space-y-3'>
        {messages.length === 0 ? (
          <p className='text-center text-sm text-muted-foreground py-8'>
            Say hello — your messages stay between you and {otherName}.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderUid === user?.uid;
            return (
              <div
                key={m.id}
                className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    mine
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className='whitespace-pre-wrap break-words'>{m.text}</p>
                  {m.createdAt?.toDate ? (
                    <p
                      className={`text-[10px] mt-1 ${mine ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}
                    >
                      {format(m.createdAt.toDate(), 'h:mm a')}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => void onSend(e)}
        className='flex gap-2 border-t border-border p-3 shrink-0'
      >
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Type a message…'
          className='rounded-xl'
          autoComplete='off'
        />
        <Button
          type='submit'
          size='icon'
          className='shrink-0 rounded-xl'
          disabled={sending || !text.trim()}
          aria-label='Send'
        >
          {sending ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <Send className='h-4 w-4' />
          )}
        </Button>
      </form>
    </div>
  );
}
