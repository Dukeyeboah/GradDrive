'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Mail, Phone, Instagram, Globe } from 'lucide-react';
import {
  getPhotographers,
  type Photographer,
  bookPhotographer,
} from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const { user, userData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadPhotographers();
  }, []);

  const loadPhotographers = async () => {
    try {
      setLoading(true);
      const data = await getPhotographers('interested-follow-up');
      setPhotographers(data);
    } catch (error) {
      console.error('Error loading photographers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhotographerName = (photographer: Photographer) => {
    if (photographer.firstName && photographer.lastName) {
      return `${photographer.firstName} ${photographer.lastName}`;
    }
    return photographer.firstName || photographer.name || 'Unknown';
  };

  const getLocation = (photographer: Photographer) => {
    if (photographer.address && photographer.state) {
      return `${photographer.address}, ${photographer.state}`;
    }
    return (
      photographer.address ||
      photographer.state ||
      photographer.location ||
      'Location not specified'
    );
  };

  const filteredPhotographers = photographers.filter((photographer) => {
    if (!searchQuery) return true;
    const name = getPhotographerName(photographer).toLowerCase();
    const location = getLocation(photographer).toLowerCase();
    const query = searchQuery.toLowerCase();
    return name.includes(query) || location.includes(query);
  });

  const handleBookPhotographer = async (photographer: Photographer) => {
    if (!user || !userData || !photographer.id) {
      toast({
        title: 'Error',
        description: 'Please sign in to book a photographer',
        variant: 'destructive',
      });
      return;
    }

    setBookingLoading(photographer.id);
    try {
      const success = await bookPhotographer({
        photographerId: photographer.id,
        photographerName: getPhotographerName(photographer),
        userId: user.uid,
        userName: userData.displayName || user.email || 'Unknown',
        userEmail: userData.email || user.email || 'unknown@example.com',
      });

      if (success) {
        toast({
          title: 'Booking Request Sent',
          description: `Your interest in ${getPhotographerName(photographer)} has been sent to the admin.`,
        });
      } else {
        throw new Error('Failed to book photographer');
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to book photographer';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className='flex w-full flex-col items-center justify-center py-12'>
      <div className='container max-w-6xl space-y-8'>
        <div className='space-y-2 text-center'>
          <h1 className='text-balance text-3xl font-bold md:text-4xl'>
            Photographer Network
          </h1>
          <p className='text-balance text-lg text-muted-foreground'>
            Connect with verified photographers for your graduation day
          </p>
        </div>

        <div className='flex flex-col justify-center gap-4 sm:flex-row'>
          <Input
            placeholder='Search by name or location...'
            className='sm:max-w-xs'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-muted-foreground' />
          </div>
        ) : filteredPhotographers.length === 0 ? (
          <div className='py-12 text-center'>
            <p className='text-muted-foreground'>No photographers found</p>
          </div>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredPhotographers.map((photographer) => {
              const name = getPhotographerName(photographer);
              const location = getLocation(photographer);

              return (
                <Card
                  key={photographer.id}
                  className='overflow-hidden border-border bg-card shadow-sm transition-shadow hover:shadow-md'
                >
                  <CardHeader>
                    <div className='space-y-2'>
                      <CardTitle className='text-lg'>{name}</CardTitle>
                      <CardDescription className='flex items-center gap-1'>
                        <MapPin className='h-3 w-3' />
                        {location}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className='space-y-4'>
                    {(photographer.instagramContact ||
                      photographer.emailContact ||
                      photographer.phoneContact ||
                      photographer.website) && (
                      <div className='space-y-2 border-t pt-2'>
                        <div className='flex flex-wrap gap-2'>
                          {photographer.instagramContact &&
                            photographer.instagram && (
                              <a
                                href={photographer.instagram}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='inline-flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700'
                              >
                                <Instagram className='h-4 w-4' />
                                Instagram
                              </a>
                            )}

                          {photographer.emailContact &&
                            photographer.email && (
                              <a
                                href={`mailto:${photographer.email}`}
                                className='inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700'
                              >
                                <Mail className='h-4 w-4' />
                                Email
                              </a>
                            )}

                          {photographer.phoneContact &&
                            photographer.phone && (
                              <a
                                href={`tel:${photographer.phone}`}
                                className='inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700'
                              >
                                <Phone className='h-4 w-4' />
                                Phone
                              </a>
                            )}

                          {photographer.website && (
                            <a
                              href={photographer.website}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700'
                            >
                              <Globe className='h-4 w-4' />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      className='w-full'
                      onClick={() => handleBookPhotographer(photographer)}
                      disabled={bookingLoading === photographer.id}
                    >
                      {bookingLoading === photographer.id ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Booking...
                        </>
                      ) : (
                        'Book Photographer'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
