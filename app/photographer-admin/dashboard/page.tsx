'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Camera,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Loader2,
  Edit,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPhotographerByEmail,
  getPhotographerBookings,
  type Photographer,
  type PhotographerBooking,
} from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { usePhotographerSidebar } from '@/contexts/PhotographerSidebarContext';
import { usePhotographerBasePath } from '@/hooks/use-photographer-base-path';
import Link from 'next/link';
import { PhotographerProfileModal } from '@/components/photographer-profile-modal';

export default function PhotographerDashboardPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const basePath = usePhotographerBasePath();
  const photographerRoot = basePath || '/';
  const { toast } = useToast();
  const { isCollapsed, setOpenProfileModal } = usePhotographerSidebar();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [bookings, setBookings] = useState<PhotographerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const setOpenProfileModalRef = useRef<((fn: () => void) => void) | null>(
    null
  );

  // Update ref when setOpenProfileModal changes
  useEffect(() => {
    setOpenProfileModalRef.current = setOpenProfileModal;
    // Register the modal open function with the context
    if (setOpenProfileModalRef.current) {
      setOpenProfileModalRef.current(() => setProfileModalOpen(true));
    }
  }, [setOpenProfileModal]);

  useEffect(() => {
    // Check passkey verification and auth synchronously
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

      // For testing: allow access even without photographer profile
      if (photographerData) {
        setPhotographer(photographerData);

        // Load bookings for this photographer
        if (photographerData.id) {
          setBookingsLoading(true);
          const photographerBookings = await getPhotographerBookings(
            photographerData.id
          );
          setBookings(photographerBookings);
        }
      } else {
        // No profile found - still allow access for testing
        // Bookings will be empty
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading photographer data:', error);
      // Don't block access on error - allow testing
      setBookings([]);
    } finally {
      setLoading(false);
      setBookingsLoading(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'contacted':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getPhotographerName = () => {
    if (photographer?.firstName && photographer?.lastName) {
      return `${photographer.firstName} ${photographer.lastName}`;
    }
    return photographer?.firstName || photographer?.name || 'Photographer';
  };

  // Show loading during auth check or data loading
  if (!authChecked || loading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[60vh]'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        <p className='text-muted-foreground mt-4'>Loading your dashboard...</p>
      </div>
    );
  }

  // Allow access even without photographer profile (for testing)
  const displayName = photographer
    ? photographer.firstName && photographer.lastName
      ? `${photographer.firstName} ${photographer.lastName}`
      : photographer.firstName || photographer.name || 'Photographer'
    : userData?.displayName || user?.displayName || user?.email || 'User';

  const pendingBookings = bookings.filter(
    (b) => !b.status || b.status === 'pending'
  );
  const totalBookings = bookings.length;

  return (
    <div
      className={cn(
        'space-y-6 p-4',
        isCollapsed ? 'w-full' : 'w-[90vw] max-w-full'
      )}
    >
      {/* Header */}
      <div className='space-y-2 mb-6'>
        <h1 className='font-bold text-2xl md:text-3xl'>Dashboard</h1>
        {!photographer && (
          <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mt-4'>
            <p className='text-sm text-yellow-800 dark:text-yellow-200'>
              <strong>Note:</strong> No photographer profile found. You can
              create one in the Profile section.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className='grid gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Bookings
            </CardTitle>
            <Calendar className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalBookings}</div>
            <p className='text-xs text-muted-foreground'>
              All-time booking requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Requests
            </CardTitle>
            <Bell className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pendingBookings.length}</div>
            <p className='text-xs text-muted-foreground'>
              Awaiting your response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Status</CardTitle>
            <Camera className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <Badge
              variant={
                photographer?.status === 'interested-follow-up'
                  ? 'default'
                  : 'secondary'
              }
            >
              {photographer?.status || 'Not set'}
            </Badge>
            <p className='text-xs text-muted-foreground mt-2'>
              Your current status
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Manage Profile</CardTitle>
            <CardDescription>
              Update your information and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className='w-full gap-2'
              onClick={() => setProfileModalOpen(true)}
            >
              <Edit className='h-4 w-4' />
              {photographer ? 'Edit Profile' : 'Create Profile'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Bookings</CardTitle>
            <CardDescription>
              See all booking requests from users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`${basePath}/bookings`}>
              <Button className='w-full gap-2' variant='outline'>
                <Bell className='h-4 w-4' />
                View Bookings (
                {pendingBookings.length > 0 ? pendingBookings.length : '0'}{' '}
                pending)
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>How you appear to users</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {photographer ? (
            <div className='grid gap-4 md:grid-cols-2'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Name
                </p>
                <p className='text-base'>{getPhotographerName()}</p>
              </div>
              {photographer.email && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                    <Mail className='h-4 w-4' />
                    Email
                  </p>
                  <p className='text-base'>{photographer.email}</p>
                </div>
              )}
              {photographer.phone && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                    <Phone className='h-4 w-4' />
                    Phone
                  </p>
                  <p className='text-base'>{photographer.phone}</p>
                </div>
              )}
              {(photographer.address || photographer.state) && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                    <MapPin className='h-4 w-4' />
                    Location
                  </p>
                  <p className='text-base'>
                    {photographer.address && photographer.state
                      ? `${photographer.address}, ${photographer.state}`
                      : photographer.address ||
                        photographer.state ||
                        'Not specified'}
                  </p>
                </div>
              )}
              {photographer.website && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                    <Globe className='h-4 w-4' />
                    Website
                  </p>
                  <a
                    href={photographer.website}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-base text-primary hover:underline'
                  >
                    {photographer.website}
                  </a>
                </div>
              )}
              {photographer.instagram && (
                <div>
                  <p className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                    <Instagram className='h-4 w-4' />
                    Instagram
                  </p>
                  <a
                    href={photographer.instagram}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-base text-primary hover:underline'
                  >
                    {photographer.instagram}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-muted-foreground mb-4'>
                No profile found. Create one to get started!
              </p>
              <Button onClick={() => setProfileModalOpen(true)}>
                Create Profile
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>Recent Booking Requests</CardTitle>
              <CardDescription>Latest requests from users</CardDescription>
            </div>
            <Link href={`${basePath}/bookings`}>
              <Button variant='outline' size='sm'>
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {bookingsLoading ? (
            <div className='flex justify-center py-8'>
              <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            </div>
          ) : bookings.length === 0 ? (
            <div className='text-center py-8'>
              <Bell className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground'>No booking requests yet</p>
            </div>
          ) : (
            <div className='space-y-3'>
              {bookings.slice(0, 5).map((booking) => (
                <div
                  key={booking.id}
                  className='flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50'
                >
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <p className='font-medium'>{booking.userName}</p>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status || 'pending'}
                      </Badge>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                      {booking.userEmail}
                    </p>
                    {booking.timestamp && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        {formatDate(booking.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <PhotographerProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onSuccess={() => {
          loadPhotographerData();
        }}
      />
    </div>
  );
}
