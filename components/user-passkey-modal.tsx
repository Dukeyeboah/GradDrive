'use client';

import { useState } from 'react';
import Image from 'next/image';
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
        <div className='flex flex-col gap-4'>
          <div className='flex items-center justify-center gap-2 sm:gap-3'>
            <Image
              src='/images/logo.png'
              alt=''
              width={44}
              height={44}
              className='h-9 w-9 sm:h-10 sm:w-10 object-contain'
            />
            <Image
              src='/images/graddrive.png'
              alt='Grad Drive'
              width={160}
              height={40}
              className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
            />
          </div>
          <DialogHeader className='text-center sm:text-center space-y-2'>
            <DialogTitle>Enter passkey</DialogTitle>
            <DialogDescription>
              Grad Drive is for our graduates. Enter the passkey you were given
              to continue to sign in or create an account.
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleVerify} className='space-y-4 pt-2'>
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
