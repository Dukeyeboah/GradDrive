'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPhotographerByEmail,
  updatePhotographer,
  addPhotographer,
  type Photographer,
} from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { usePhotographerSidebar } from '@/contexts/PhotographerSidebarContext';
import { usePhotographerBasePath } from '@/hooks/use-photographer-base-path';
import Link from 'next/link';

export default function PhotographerProfilePage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const basePath = usePhotographerBasePath();
  const photographerRoot = basePath || '/';
  const { toast } = useToast();
  const { isCollapsed } = usePhotographerSidebar();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    instagram: '',
    phone: '',
    address: '',
    state: '',
    status: 'interested-follow-up' as Photographer['status'],
    instagramContact: false,
    emailContact: false,
    phoneContact: false,
  });

  useEffect(() => {
    // Check passkey verification
    if (typeof window !== 'undefined') {
      const verified = sessionStorage.getItem('photographerPasskeyVerified');
      if (verified !== 'true') {
        router.push(photographerRoot);
        return;
      }
    }

    // Wait for auth to be ready before checking
    if (user === undefined || userData === undefined) {
      return; // Still loading auth state
    }

    // Check if user is logged in
    if (!user || !userData?.email) {
      router.push(photographerRoot);
      return;
    }

    setAuthChecked(true);
    loadPhotographerData();
  }, [user, userData, router, photographerRoot]);

  const loadPhotographerData = async () => {
    if (!userData?.email) return;

    try {
      setLoading(true);
      const photographerData = await getPhotographerByEmail(userData.email);

      // For testing: allow creating profile if it doesn't exist
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
          state: photographerData.state || '',
          status: photographerData.status || 'interested-follow-up',
          instagramContact: photographerData.instagramContact || false,
          emailContact: photographerData.emailContact || false,
          phoneContact: photographerData.phoneContact || false,
        });
      } else {
        // No profile found - allow creating one
        setFormData({
          ...formData,
          email: userData.email || '',
        });
      }
    } catch (error) {
      console.error('Error loading photographer data:', error);
      // Don't block access on error - allow testing
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
          // Reload photographer data
          await loadPhotographerData();
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
          // Reload photographer data
          await loadPhotographerData();
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

  // Show loading during auth check or data loading
  if (!authChecked || loading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[60vh]'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        <p className='text-muted-foreground mt-4'>Loading profile...</p>
      </div>
    );
  }

  // Allow access even without photographer profile (for testing)

  return (
    <div
      className={cn(
        'space-y-6 px-4 pt-4 pb-0',
        isCollapsed ? 'w-full' : 'w-90vw max-w-full',
        isCollapsed ? 'ml-0' : 'ml-9'
      )}
    >
      {/* Header */}
      <div className='space-y-2 mb-6'>
        <h1 className='font-bold text-2xl md:text-3xl'>Edit Profile</h1>
        <p className='text-muted-foreground'>
          Update your photographer information
        </p>
      </div>

      <form
        className='space-y-4 bg-card rounded-lg p-4'
        onSubmit={handleSubmit}
      >
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic contact details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex flex-col gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name *</Label>
                <Input
                  id='firstName'
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email *</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone'>Phone</Label>
              <Input
                id='phone'
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
              <Label htmlFor='address'>Address</Label>
              <Input
                id='address'
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='state'>State</Label>
              <Input
                id='state'
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
              <Label htmlFor='website'>Website</Label>
              <Input
                id='website'
                type='url'
                placeholder='https://example.com'
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='instagram'>Instagram</Label>
              <Input
                id='instagram'
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
                <Label htmlFor='emailContact'>Email Contact</Label>
                <p className='text-sm text-muted-foreground'>
                  Allow users to contact you via email
                </p>
              </div>
              <Switch
                id='emailContact'
                checked={formData.emailContact}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, emailContact: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='phoneContact'>Phone Contact</Label>
                <p className='text-sm text-muted-foreground'>
                  Allow users to contact you via phone
                </p>
              </div>
              <Switch
                id='phoneContact'
                checked={formData.phoneContact}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, phoneContact: checked })
                }
              />
            </div>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <Label htmlFor='instagramContact'>Instagram Contact</Label>
                <p className='text-sm text-muted-foreground'>
                  Allow users to contact you via Instagram
                </p>
              </div>
              <Switch
                id='instagramContact'
                checked={formData.instagramContact}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, instagramContact: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
            <CardDescription>Your current status</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='status'>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as Photographer['status'],
                  })
                }
              >
                <SelectTrigger id='status'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='contacted'>Contacted</SelectItem>
                  <SelectItem value='not-contacted'>Not Contacted</SelectItem>
                  <SelectItem value='interested-follow-up'>
                    Interested - Follow Up
                  </SelectItem>
                  <SelectItem value='not-interested/no-response'>
                    Not Interested / No Response
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card> */}

        <div className='flex justify-end gap-4'>
          <Link href={`${basePath}/dashboard`}>
            <Button type='button' variant='outline'>
              Cancel
            </Button>
          </Link>
          <Button type='submit' disabled={saving}>
            {saving ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Saving...
              </>
            ) : (
              <>
                <Save className='mr-2 h-4 w-4' />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
