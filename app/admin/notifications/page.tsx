'use client';

import { useCallback, useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Bell,
  ChevronDown,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPasskeyRequests,
  type PasskeyRequest,
} from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

function formatTs(t: PasskeyRequest['createdAt']) {
  if (!t?.toDate) return '—';
  try {
    return format(t.toDate(), 'MMM d, yyyy h:mm a');
  } catch {
    return '—';
  }
}

export default function AdminNotificationsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<PasskeyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectMessage, setRejectMessage] = useState('');

  const isAdmin =
    userData?.role === 'admin' || userData?.role === 'super admin';

  const pendingCount = rows.filter((r) => r.status === 'pending').length;

  const load = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const data = await getPasskeyRequests();
      setRows(data);
    } catch {
      toast({
        title: 'Error',
        description: 'Could not load notifications.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin, toast]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    void load();
  }, [authLoading, isAdmin, load]);

  const callApprove = async (requestId: string) => {
    if (!user) return;
    setBusyId(requestId);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/passkey-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'approve', requestId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: 'Approve failed',
          description:
            typeof data?.error === 'string' ? data.error : res.statusText,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Approved',
        description:
          'The requester was emailed their passkey and sign-up instructions.',
      });
      await load();
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  const openReject = (requestId: string) => {
    setRejectTargetId(requestId);
    setRejectMessage('');
    setRejectOpen(true);
  };

  const confirmReject = async () => {
    if (!user || !rejectTargetId) return;
    const msg = rejectMessage.trim();
    if (msg.length < 10) {
      toast({
        title: 'Message too short',
        description: 'Please write at least 10 characters for the requester.',
        variant: 'destructive',
      });
      return;
    }
    setBusyId(rejectTargetId);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/passkey-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: 'reject',
          requestId: rejectTargetId,
          rejectMessage: msg,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast({
          title: 'Decline failed',
          description:
            typeof data?.error === 'string' ? data.error : res.statusText,
          variant: 'destructive',
        });
        return;
      }
      toast({
        title: 'Request declined',
        description: 'The requester was emailed with your message.',
      });
      setRejectOpen(false);
      setRejectTargetId(null);
      await load();
    } catch {
      toast({ title: 'Network error', variant: 'destructive' });
    } finally {
      setBusyId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground'>
        <Loader2 className='h-6 w-6 animate-spin' />
        Loading…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className='p-6'>
        <p className='text-muted-foreground'>Admin access required.</p>
      </div>
    );
  }

  return (
    <div className='p-6 space-y-6 max-w-3xl'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <div className='flex items-center gap-2'>
            <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent'>
              <Bell className='h-5 w-5' strokeWidth={1.75} />
            </div>
            <h1 className='font-bold text-3xl md:text-4xl tracking-tight'>
              Notifications
            </h1>
            {pendingCount > 0 ? (
              <Badge variant='default' className='rounded-full px-2.5'>
                {pendingCount} pending
              </Badge>
            ) : null}
          </div>
          <p className='text-muted-foreground mt-2 max-w-xl'>
            Passkey access requests from the public site. Each thread shows who
            asked, where they study, and their graduation year. Approve to email
            the passkey and instructions, or decline with a message they will
            receive by email.
          </p>
        </div>
        <Button
          type='button'
          variant='outline'
          className='gap-2 shrink-0'
          onClick={() => void load()}
        >
          <RefreshCw className='h-4 w-4' />
          Refresh
        </Button>
      </div>

      <div className='space-y-3'>
        {rows.length === 0 ? (
          <div className='rounded-xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center text-muted-foreground text-sm'>
            No passkey requests yet.
          </div>
        ) : (
          rows.map((r) => (
            <Collapsible
              key={r.id}
              defaultOpen={r.status === 'pending'}
              className='group rounded-xl border border-border bg-card shadow-sm overflow-hidden'
            >
              <CollapsibleTrigger className='flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors'>
                <ChevronDown className='h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180' />
                <div className='min-w-0 flex-1'>
                  <p className='font-medium truncate'>
                    {r.displayName || r.email}{' '}
                    <span className='text-muted-foreground font-normal'>
                      · {r.email}
                    </span>
                  </p>
                  <p className='text-xs text-muted-foreground truncate'>
                    {r.collegeName || '—'} · Class of {r.graduationYear || '—'} ·{' '}
                    {formatTs(r.createdAt)}
                  </p>
                </div>
                <Badge
                  variant={
                    r.status === 'sent'
                      ? 'default'
                      : r.status === 'rejected'
                        ? 'secondary'
                        : 'outline'
                  }
                  className='shrink-0 capitalize'
                >
                  {r.status === 'sent' ? 'approved' : r.status}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className='border-t border-border px-4 py-4 space-y-4 text-sm'>
                  <dl className='grid gap-2 sm:grid-cols-2'>
                    <div>
                      <dt className='text-muted-foreground text-xs uppercase tracking-wide'>
                        Name
                      </dt>
                      <dd className='font-medium'>{r.displayName || '—'}</dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground text-xs uppercase tracking-wide'>
                        Email
                      </dt>
                      <dd className='font-mono text-xs break-all'>{r.email}</dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground text-xs uppercase tracking-wide'>
                        College / university
                      </dt>
                      <dd>{r.collegeName || '—'}</dd>
                    </div>
                    <div>
                      <dt className='text-muted-foreground text-xs uppercase tracking-wide'>
                        Graduation year
                      </dt>
                      <dd>{r.graduationYear || '—'}</dd>
                    </div>
                  </dl>
                  {r.status === 'rejected' && r.rejectMessage ? (
                    <div className='rounded-lg bg-muted/50 p-3 text-xs'>
                      <p className='font-medium text-foreground mb-1'>
                        Decline message sent
                      </p>
                      <p className='text-muted-foreground whitespace-pre-wrap'>
                        {r.rejectMessage}
                      </p>
                    </div>
                  ) : null}
                  {r.status === 'pending' ? (
                    <div className='flex flex-wrap gap-2 pt-1'>
                      <Button
                        type='button'
                        size='sm'
                        className='gap-1.5 font-semibold bg-accent text-accent-foreground hover:bg-accent/90'
                        disabled={busyId === r.id}
                        onClick={() => void callApprove(r.id)}
                      >
                        {busyId === r.id ? (
                          <Loader2 className='h-4 w-4 animate-spin' />
                        ) : (
                          <CheckCircle2 className='h-4 w-4' />
                        )}
                        Approve &amp; email passkey
                      </Button>
                      <Button
                        type='button'
                        size='sm'
                        variant='outline'
                        className='gap-1.5'
                        disabled={busyId === r.id}
                        onClick={() => openReject(r.id)}
                      >
                        <XCircle className='h-4 w-4' />
                        Decline &amp; email
                      </Button>
                    </div>
                  ) : (
                    <p className='text-xs text-muted-foreground'>
                      {r.status === 'sent'
                        ? 'Passkey and instructions were emailed to the requester.'
                        : 'This request was declined.'}
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </div>

      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent className='max-w-lg'>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline this request?</AlertDialogTitle>
            <AlertDialogDescription>
              The requester will receive an email with the message below. Be
              clear and professional (minimum 10 characters).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='space-y-2 py-2'>
            <Label htmlFor='reject-msg'>Message to requester</Label>
            <Textarea
              id='reject-msg'
              rows={5}
              placeholder='e.g. We could not verify this email against our eligible customer list. Please submit again using the email tied to your House of Stole order.'
              value={rejectMessage}
              onChange={(e) => setRejectMessage(e.target.value)}
              className='resize-none'
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!busyId}>Cancel</AlertDialogCancel>
            <Button
              type='button'
              variant='destructive'
              disabled={
                !!busyId || rejectMessage.trim().length < 10 || !rejectTargetId
              }
              onClick={() => void confirmReject()}
            >
              {busyId ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                'Send decline email'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
