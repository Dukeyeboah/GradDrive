'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPhotographerByEmail,
  updatePhotographer,
  addPhotographer,
  type Photographer,
} from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface PhotographerProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PhotographerProfileModal({
  open,
  onOpenChange,
  onSuccess,
}: PhotographerProfileModalProps) {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    instagram: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    status: 'interested-follow-up' as Photographer['status'],
    instagramContact: false,
    emailContact: false,
    phoneContact: false,
  });

  useEffect(() => {
    if (open && userData?.email) {
      loadPhotographerData();
    }
  }, [open, userData?.email]);

  const loadPhotographerData = async () => {
    if (!userData?.email) return;

    try {
      setLoading(true);
      const photographerData = await getPhotographerByEmail(userData.email);

      if (photographerData) {
        setPhotographer(photographerData);
        setFormData({
          firstName: photographerData.firstName || '',
          lastName: photographerData.lastName || '',
          email: photographerData.email || userData.email || '',
          website: photographerData.website || '',
          instagram: photographerData.instagram || '',
          phone: photographerData.phone || '',
          address: photographerData.address || '',
          city: photographerData.city || '',
          state: photographerData.state || '',
          status: photographerData.status || 'interested-follow-up',
          instagramContact: photographerData.instagramContact || false,
          emailContact: photographerData.emailContact || false,
          phoneContact: photographerData.phoneContact || false,
        });
      } else {
        // No profile found - allow creating one
        setFormData({
          firstName: '',
          lastName: '',
          email: userData.email || '',
          website: '',
          instagram: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          status: 'interested-follow-up',
          instagramContact: false,
          emailContact: false,
          phoneContact: false,
        });
      }
    } catch (error) {
      console.error('Error loading photographer data:', error);
      setFormData({
        ...formData,
        email: userData?.email || '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.firstName) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in at least your email and first name.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      if (photographer?.id) {
        // Update existing profile
        const success = await updatePhotographer(photographer.id, formData);

        if (success) {
          toast({
            title: 'Success',
            description: 'Your profile has been updated successfully.',
          });
          onOpenChange(false);
          if (onSuccess) onSuccess();
        } else {
          toast({
            title: 'Error',
            description: 'Failed to update profile. Please try again.',
            variant: 'destructive',
          });
        }
      } else {
        // Create new profile
        const photographerId = await addPhotographer(formData);

        if (photographerId) {
          toast({
            title: 'Success',
            description: 'Your profile has been created successfully.',
          });
          onOpenChange(false);
          if (onSuccess) onSuccess();
        } else {
          toast({
            title: 'Error',
            description: 'Failed to create profile. Please try again.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {photographer ? 'Edit Profile' : 'Create Profile'}
          </DialogTitle>
          <DialogDescription>
            {photographer
              ? 'Update your information'
              : 'Create your Fotomatic profile to get started'}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className='flex flex-col justify-center items-center py-8'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
            <p className='text-muted-foreground mt-4'>Loading profile...</p>
          </div>
        ) : (
          <form className='space-y-4' onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic contact details</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='modal-firstName'>First Name *</Label>
                    <Input
                      id='modal-firstName'
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='modal-lastName'>Last Name</Label>
                    <Input
                      id='modal-lastName'
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='modal-email'>Email *</Label>
                  <Input
                    id='modal-email'
                    type='email'
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='modal-phone'>Phone</Label>
                  <Input
                    id='modal-phone'
                    type='tel'
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>Where you're based</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='modal-address'>Address</Label>
                  <Input
                    id='modal-address'
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='modal-city'>City</Label>
                  <Input
                    id='modal-city'
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='modal-state'>State</Label>
                  <Input
                    id='modal-state'
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Online Presence</CardTitle>
                <CardDescription>
                  Your website and social media links
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='modal-website'>Website</Label>
                  <Input
                    id='modal-website'
                    type='url'
                    placeholder='https://example.com'
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='modal-instagram'>Instagram</Label>
                  <Input
                    id='modal-instagram'
                    type='url'
                    placeholder='https://instagram.com/yourhandle'
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData({ ...formData, instagram: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Preferences</CardTitle>
                <CardDescription>How users can contact you</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='modal-emailContact'>Email Contact</Label>
                    <p className='text-sm text-muted-foreground'>
                      Allow users to contact you via email
                    </p>
                  </div>
                  <Switch
                    id='modal-emailContact'
                    checked={formData.emailContact}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, emailContact: checked })
                    }
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='modal-phoneContact'>Phone Contact</Label>
                    <p className='text-sm text-muted-foreground'>
                      Allow users to contact you via phone
                    </p>
                  </div>
                  <Switch
                    id='modal-phoneContact'
                    checked={formData.phoneContact}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, phoneContact: checked })
                    }
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <div className='space-y-0.5'>
                    <Label htmlFor='modal-instagramContact'>
                      Instagram Contact
                    </Label>
                    <p className='text-sm text-muted-foreground'>
                      Allow users to contact you via Instagram
                    </p>
                  </div>
                  <Switch
                    id='modal-instagramContact'
                    checked={formData.instagramContact}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, instagramContact: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <div className='flex justify-end gap-4 pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className='mr-2 h-4 w-4' />
                    {photographer ? 'Save Changes' : 'Create Profile'}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

