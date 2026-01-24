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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Bell,
  Mail,
  User,
  Calendar,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  getPhotographerByEmail,
  getPhotographerBookings,
  updatePhotographerBooking,
  type Photographer,
  type PhotographerBooking,
} from '@/lib/firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { usePhotographerSidebar } from '@/contexts/PhotographerSidebarContext';

export default function PhotographerBookingsPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { isCollapsed } = usePhotographerSidebar();
  const [photographer, setPhotographer] = useState<Photographer | null>(null);
  const [bookings, setBookings] = useState<PhotographerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Check passkey verification
    if (typeof window !== 'undefined') {
      const verified = sessionStorage.getItem('photographerPasskeyVerified');
      if (verified !== 'true') {
        router.push('/photographer-admin');
        return;
      }
    }

    // Wait for auth to be ready before checking
    if (user === undefined || userData === undefined) {
      return; // Still loading auth state
    }

    // Check if user is logged in
    if (!user || !userData?.email) {
      router.push('/photographer-admin');
      return;
    }

    setAuthChecked(true);
    loadBookings();
  }, [user, userData, router]);

  const loadBookings = async () => {
    if (!userData?.email) return;

    try {
      setLoading(true);
      const photographerData = await getPhotographerByEmail(userData.email);

      // For testing: allow access even without photographer profile
      if (photographerData) {
        setPhotographer(photographerData);

        // Load bookings for this photographer
        if (photographerData.id) {
          const photographerBookings = await getPhotographerBookings(
            photographerData.id
          );
          setBookings(photographerBookings);
        }
      } else {
        // No profile found - bookings will be empty
        setBookings([]);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
      // Don't block access on error - allow testing
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    newStatus: 'pending' | 'contacted' | 'completed'
  ) => {
    setUpdatingStatus(bookingId);
    try {
      const success = await updatePhotographerBooking(bookingId, {
        status: newStatus,
      });
      if (success) {
        toast({
          title: 'Status Updated',
          description: `Booking status updated to ${newStatus}.`,
        });
        // Reload bookings
        await loadBookings();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update booking status.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(null);
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

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter === 'all') return true;
    return (booking.status || 'pending') === statusFilter;
  });

  const pendingCount = bookings.filter(
    (b) => !b.status || b.status === 'pending'
  ).length;
  const contactedCount = bookings.filter(
    (b) => b.status === 'contacted'
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === 'completed'
  ).length;

  // Show loading during auth check or data loading
  if (!authChecked || loading) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[60vh]'>
        <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
        <p className='text-muted-foreground mt-4'>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'space-y-6 p-4',
        isCollapsed ? 'w-full' : 'w-[90vw] max-w-full'
      )}
    >
      {/* Header */}
      <div className='space-y-2 mb-6'>
        <h1 className='font-bold text-2xl md:text-3xl'>Booking Requests</h1>
        <p className='text-muted-foreground'>
          Manage booking requests from users
        </p>
      </div>

      {/* Stats */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Pending</CardTitle>
            <Bell className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Contacted</CardTitle>
            <Mail className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{contactedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Completed</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                View and manage booking requests
              </CardDescription>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Filter by status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='contacted'>Contacted</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <div className='text-center py-12'>
              <Bell className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground'>No booking requests yet</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className='text-center py-12'>
              <p className='text-muted-foreground'>
                No bookings match the selected filter
              </p>
            </div>
          ) : (
            <div className='space-y-4'>
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className='hover:bg-accent/50 transition-colors'
                >
                  <CardContent className='pt-6'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 space-y-3'>
                        <div className='flex items-center gap-3'>
                          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary/10'>
                            <User className='h-5 w-5 text-primary' />
                          </div>
                          <div>
                            <p className='font-semibold text-lg'>
                              {booking.userName}
                            </p>
                            <div className='flex items-center gap-2 mt-1'>
                              <Mail className='h-3 w-3 text-muted-foreground' />
                              <p className='text-sm text-muted-foreground'>
                                {booking.userEmail}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='h-4 w-4' />
                            <span>{formatDate(booking.timestamp)}</span>
                          </div>
                          <Badge
                            variant={getStatusBadgeVariant(booking.status)}
                          >
                            {booking.status || 'pending'}
                          </Badge>
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Select
                          value={booking.status || 'pending'}
                          onValueChange={(value) =>
                            handleStatusUpdate(
                              booking.id!,
                              value as 'pending' | 'contacted' | 'completed'
                            )
                          }
                          disabled={updatingStatus === booking.id}
                        >
                          <SelectTrigger className='w-[140px]'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='pending'>Pending</SelectItem>
                            <SelectItem value='contacted'>Contacted</SelectItem>
                            <SelectItem value='completed'>Completed</SelectItem>
                          </SelectContent>
                        </Select>
                        {updatingStatus === booking.id && (
                          <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
