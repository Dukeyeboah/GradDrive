'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { updateUserProfile } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface FirstTimeProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uid: string;
  initialName?: string | null;
  onComplete: () => void;
}

export function FirstTimeProfileModal({
  open,
  onOpenChange,
  uid,
  initialName = '',
  onComplete,
}: FirstTimeProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: initialName || '',
    collegeName: '',
    collegeGroup: '',
    major: '',
    graduationYear: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open && initialName) {
      setFormData((prev) => ({ ...prev, displayName: initialName }));
    }
  }, [open, initialName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await updateUserProfile(uid, {
      displayName: formData.displayName.trim() || null,
      collegeName: formData.collegeName.trim() || null,
      collegeGroup: formData.collegeGroup.trim() || null,
      major: formData.major.trim() || null,
      graduationYear: formData.graduationYear.trim() || null,
    });
    setLoading(false);
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Profile saved',
      description: "You're all set. Welcome to Grad Drive!",
    });
    onOpenChange(false);
    onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Set up your profile</DialogTitle>
          <DialogDescription>
            Tell us a bit about yourself so we can personalize your experience.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='ft-displayName'>Full Name</Label>
            <Input
              id='ft-displayName'
              type='text'
              placeholder='Your name'
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ft-collegeName'>College / University Name *</Label>
            <Input
              id='ft-collegeName'
              type='text'
              placeholder='e.g. University of Ghana'
              value={formData.collegeName}
              onChange={(e) =>
                setFormData({ ...formData, collegeName: e.target.value })
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ft-collegeGroup'>College group (optional)</Label>
            <Input
              id='ft-collegeGroup'
              type='text'
              placeholder='e.g. Class of 2025'
              value={formData.collegeGroup}
              onChange={(e) =>
                setFormData({ ...formData, collegeGroup: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ft-major'>Major / Field of study</Label>
            <Input
              id='ft-major'
              type='text'
              placeholder='e.g. Computer Science'
              value={formData.major}
              onChange={(e) =>
                setFormData({ ...formData, major: e.target.value })
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='ft-graduationYear'>Graduation year</Label>
            <Input
              id='ft-graduationYear'
              type='text'
              placeholder='e.g. 2025'
              value={formData.graduationYear}
              onChange={(e) =>
                setFormData({ ...formData, graduationYear: e.target.value })
              }
            />
          </div>
          <div className='flex justify-end gap-2 pt-2'>
            <Button type='submit' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Saving...
                </>
              ) : (
                'Save and continue'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
