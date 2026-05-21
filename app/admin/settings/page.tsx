'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPlatformSettings,
  savePlatformSettings,
} from '@/lib/firebase/firestore';
import {
  CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
  CODE_DEFAULT_PASSKEY_FROM_EMAIL,
} from '@/lib/config/platform-settings-defaults';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passkeyAdminNotifyEmail, setPasskeyAdminNotifyEmail] = useState('');
  const [passkeyFromEmail, setPasskeyFromEmail] = useState('');

  const isAdmin =
    userData?.role === 'admin' || userData?.role === 'super admin';

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const s = await getPlatformSettings();
      if (cancelled) return;
      setPasskeyAdminNotifyEmail(
        s?.passkeyAdminNotifyEmail?.trim() ||
          CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
      );
      setPasskeyFromEmail(
        s?.passkeyFromEmail?.trim() || CODE_DEFAULT_PASSKEY_FROM_EMAIL,
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAdmin]);

  const handleSaveEmails = async () => {
    setSaving(true);
    try {
      const ok = await savePlatformSettings({
        passkeyAdminNotifyEmail: passkeyAdminNotifyEmail.trim(),
        passkeyFromEmail: passkeyFromEmail.trim(),
      });
      if (ok) {
        toast({ title: 'Saved', description: 'Email settings updated.' });
      } else {
        toast({
          title: 'Save failed',
          variant: 'destructive',
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className='flex min-h-[40vh] items-center justify-center gap-2 text-muted-foreground p-6'>
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
      <div className='space-y-2'>
        <h1 className='font-bold text-3xl md:text-4xl'>Settings</h1>
        <p className='text-muted-foreground'>
          Configure platform settings and passkey email delivery.
        </p>
      </div>

      <Card className='border-border bg-card shadow-sm'>
        <CardHeader>
          <CardTitle>Passkey &amp; email (Resend)</CardTitle>
          <CardDescription>
            These addresses are stored in Firestore (
            <code className='text-xs bg-muted px-1 py-0.5 rounded'>
              platformSettings/main
            </code>
            ). Defaults also live in code:{' '}
            <code className='text-xs bg-muted px-1 py-0.5 rounded'>
              lib/config/platform-settings-defaults.ts
            </code>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='passkey-admin-notify'>
              Admin notification email (new passkey requests)
            </Label>
            <Input
              id='passkey-admin-notify'
              type='email'
              value={passkeyAdminNotifyEmail}
              onChange={(e) => setPasskeyAdminNotifyEmail(e.target.value)}
              placeholder={CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL}
              className='font-mono text-sm'
            />
            <p className='text-xs text-muted-foreground'>
              Resend sends here when someone requests a passkey on the public
              site. Optional env override:{' '}
              <code className='bg-muted px-1 rounded'>PASSKEY_ADMIN_NOTIFY_EMAIL</code>.
            </p>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='passkey-from'>From address (Resend)</Label>
            <Input
              id='passkey-from'
              type='text'
              value={passkeyFromEmail}
              onChange={(e) => setPasskeyFromEmail(e.target.value)}
              placeholder={CODE_DEFAULT_PASSKEY_FROM_EMAIL}
              className='font-mono text-sm'
            />
            <p className='text-xs text-muted-foreground'>
              Must be a verified sender in Resend (e.g.{' '}
              <code className='bg-muted px-1 rounded'>Name &lt;you@domain.com&gt;</code>
              ). Trial:{' '}
              <code className='bg-muted px-1 rounded'>onboarding@resend.dev</code>.
              Optional env:{' '}
              <code className='bg-muted px-1 rounded'>PASSKEY_FROM_EMAIL</code>.
            </p>
          </div>
          <Button
            type='button'
            onClick={() => void handleSaveEmails()}
            disabled={saving}
            className='font-semibold'
          >
            {saving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin inline' />
                Saving…
              </>
            ) : (
              'Save email settings'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className='border-border bg-card shadow-sm'>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>General platform configuration</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='platform-name'>Platform Name</Label>
            <Input id='platform-name' defaultValue='Grad Drive' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='support-email'>Support Email</Label>
            <Input id='support-email' type='email' defaultValue='support@graddrive.com' />
          </div>
        </CardContent>
      </Card>

      <Card className='border-border bg-card shadow-sm'>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>User Registration</Label>
              <p className='text-sm text-muted-foreground'>Allow new users to sign up</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Photographer Applications</Label>
              <p className='text-sm text-muted-foreground'>
                Accept new photographer registrations
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Scholarship Applications</Label>
              <p className='text-sm text-muted-foreground'>
                Accept scholarship tour applications
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-end'>
        <Button variant='secondary'>Save other settings (coming soon)</Button>
      </div>
    </div>
  );
}
