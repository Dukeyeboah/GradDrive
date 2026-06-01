'use client';

import { useEffect, useState } from 'react';
import { Loader2, Lock, Percent, Sparkles, Tag } from 'lucide-react';
import { generateSecureDiscountCode } from '@/lib/utils/generate-discount-code';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPlatformSettings,
  savePlatformSettings,
} from '@/lib/firebase/firestore';
import {
  CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
  CODE_DEFAULT_PASSKEY_FROM_EMAIL,
  CODE_DEFAULT_FOTOMATIC_DISCOUNT_CODE,
  CODE_DEFAULT_FOTOMATIC_DISCOUNT_PERCENT,
  CODE_DEFAULT_USER_PASSKEY,
} from '@/lib/config/platform-settings-defaults';
import { resolveMemberAccessSettings } from '@/lib/config/resolve-member-access';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [savingEmails, setSavingEmails] = useState(false);
  const [savingDiscount, setSavingDiscount] = useState(false);
  const [passkeyAdminNotifyEmail, setPasskeyAdminNotifyEmail] = useState('');
  const [passkeyFromEmail, setPasskeyFromEmail] = useState('');
  const [fotomaticDiscountCode, setFotomaticDiscountCode] = useState('');
  const [fotomaticDiscountPercent, setFotomaticDiscountPercent] = useState('');

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
      const resolved = resolveMemberAccessSettings(s);
      setPasskeyAdminNotifyEmail(
        s?.passkeyAdminNotifyEmail?.trim() ||
          CODE_DEFAULT_PASSKEY_ADMIN_NOTIFY_EMAIL,
      );
      setPasskeyFromEmail(
        s?.passkeyFromEmail?.trim() || CODE_DEFAULT_PASSKEY_FROM_EMAIL,
      );
      setFotomaticDiscountCode(resolved.fotomaticDiscountCode);
      setFotomaticDiscountPercent(String(resolved.fotomaticDiscountPercent));
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authLoading, isAdmin]);

  const handleSaveEmails = async () => {
    setSavingEmails(true);
    try {
      const ok = await savePlatformSettings({
        passkeyAdminNotifyEmail: passkeyAdminNotifyEmail.trim(),
        passkeyFromEmail: passkeyFromEmail.trim(),
      });
      if (ok) {
        toast({ title: 'Saved', description: 'Email settings updated.' });
      } else {
        toast({ title: 'Save failed', variant: 'destructive' });
      }
    } finally {
      setSavingEmails(false);
    }
  };

  const handleSaveDiscount = async () => {
    const code = fotomaticDiscountCode.trim();
    const percent = Number.parseInt(fotomaticDiscountPercent, 10);
    if (!code || code.length < 7 || code.length > 32) {
      toast({
        title: 'Invalid code',
        description: 'Use 7–32 characters (letters, numbers, and symbols).',
        variant: 'destructive',
      });
      return;
    }
    if (!Number.isFinite(percent) || percent < 1 || percent > 100) {
      toast({
        title: 'Invalid percentage',
        description: 'Enter a discount between 1 and 100.',
        variant: 'destructive',
      });
      return;
    }

    setSavingDiscount(true);
    try {
      const ok = await savePlatformSettings({
        fotomaticDiscountCode: code,
        fotomaticDiscountPercent: percent,
        userPasskeyReference: CODE_DEFAULT_USER_PASSKEY,
      });
      if (ok) {
        toast({
          title: 'Saved',
          description: 'Fotomatic discount updated for all members.',
        });
      } else {
        toast({ title: 'Save failed', variant: 'destructive' });
      }
    } finally {
      setSavingDiscount(false);
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
          Member access, Fotomatic discount, and passkey email delivery.
        </p>
      </div>

      <Card className='border-border bg-card shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Lock className='h-5 w-5 text-accent' />
            Member access passkey
          </CardTitle>
          <CardDescription>
            Used when graduates unlock sign-up and in approval emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Label htmlFor='user-passkey'>Current passkey</Label>
            <Input
              id='user-passkey'
              readOnly
              value={CODE_DEFAULT_USER_PASSKEY}
              className='font-mono text-sm bg-muted/50'
            />
          </div>
        </CardContent>
      </Card>

      <Card className='border-border bg-card shadow-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Tag className='h-5 w-5 text-accent' />
            Fotomatic discount
          </CardTitle>
          <CardDescription>
            Shown to members on the Photography page. Match the same code and
            percentage in your Fotomatic admin.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2 sm:col-span-2'>
              <Label htmlFor='fotomatic-code'>Discount code</Label>
              <div className='flex gap-2'>
                <Input
                  id='fotomatic-code'
                  value={fotomaticDiscountCode}
                  onChange={(e) => setFotomaticDiscountCode(e.target.value)}
                  placeholder={CODE_DEFAULT_FOTOMATIC_DISCOUNT_CODE}
                  className='font-mono text-sm flex-1'
                />
                <Button
                  type='button'
                  variant='outline'
                  className='shrink-0 gap-1.5'
                  onClick={() => {
                    setFotomaticDiscountCode(generateSecureDiscountCode());
                    toast({
                      title: 'Code generated',
                      description:
                        'Save when ready, then add the same code on Fotomatic.',
                    });
                  }}
                >
                  <Sparkles className='h-4 w-4' />
                  Generate
                </Button>
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='fotomatic-percent' className='flex items-center gap-1'>
                <Percent className='h-3.5 w-3.5' />
                Discount percentage
              </Label>
              <Input
                id='fotomatic-percent'
                type='number'
                min={1}
                max={100}
                value={fotomaticDiscountPercent}
                onChange={(e) => setFotomaticDiscountPercent(e.target.value)}
                placeholder={String(CODE_DEFAULT_FOTOMATIC_DISCOUNT_PERCENT)}
              />
            </div>
          </div>
          <Button
            type='button'
            onClick={() => void handleSaveDiscount()}
            disabled={savingDiscount}
            className='font-semibold'
          >
            {savingDiscount ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin inline' />
                Saving…
              </>
            ) : (
              'Save Fotomatic discount'
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className='border-border bg-card shadow-sm'>
        <CardHeader>
          <CardTitle>Passkey &amp; email (Resend)</CardTitle>
          <CardDescription>
            Addresses for passkey request notifications and outbound approval
            emails.
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
          </div>
          <Button
            type='button'
            onClick={() => void handleSaveEmails()}
            disabled={savingEmails}
            className='font-semibold'
          >
            {savingEmails ? (
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
    </div>
  );
}
