'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { USER_PASSKEY } from '@/lib/config/user';
import { useToast } from '@/hooks/use-toast';

interface UserPasskeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerified: () => void;
}

export function UserPasskeyModal({
  open,
  onOpenChange,
  onVerified,
}: UserPasskeyModalProps) {
  const [passkey, setPasskey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkey !== USER_PASSKEY) {
      toast({
        title: 'Incorrect passkey',
        description: 'Please check the key you were given and try again.',
        variant: 'destructive',
      });
      setPasskey('');
      return;
    }
    setLoading(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userPasskeyVerified', 'true');
      localStorage.setItem('userPasskeyVerified', 'true');
    }
    setPasskey('');
    setLoading(false);
    onVerified();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Enter passkey</DialogTitle>
          <DialogDescription>
            Grad Drive is for our graduates. Enter the passkey you were given to
            continue to sign in or create an account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleVerify} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='user-passkey'>Passkey</Label>
            <Input
              id='user-passkey'
              type='password'
              placeholder='Enter passkey'
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className='flex justify-end gap-2'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'Verifying...' : 'Continue'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
