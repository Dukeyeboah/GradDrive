'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Users,
  Camera,
  FileImage,
  BookOpen,
  Download,
  UserCog,
  GraduationCap,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const { userData } = useAuth();
  const { analytics, users, downloadBreakdown, loading, refreshAnalytics, refreshUsers, refreshDownloadBreakdown } = useData();
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const role = userData?.role || 'admin';
  const roleDisplay = role === 'super admin' ? 'Super Admin' : 'Admin';

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  // Format time ago
  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Format activity action text
  const formatActivityAction = (action: string) => {
    const actionMap: Record<string, string> = {
      'user_signup': 'New user registration',
      'user_login': 'User logged in',
      'download_poster': 'Asset downloaded',
      'download_ebook': 'E-book accessed',
      'download_cap_design': 'Cap design downloaded',
      'contact_photographer': 'Photographer contacted',
      'add_poster': 'Poster uploaded',
      'add_ebook': 'E-book uploaded',
      'add_cap_design': 'Cap design uploaded',
      'delete_poster': 'Poster deleted',
      'update_poster': 'Poster updated',
    };
    return actionMap[action] || action.replace(/_/g, ' ');
  };

  // Format date
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

  // Handle card click
  const handleCardClick = async (cardType: string) => {
    setSelectedModal(cardType);
    setModalLoading(true);
    setModalData(null);

    try {
      switch (cardType) {
        case 'users':
          // Use cached data if available, otherwise refresh
          // Filter to only show users with role "user" (exclude admins)
          if (users && users.length > 0) {
            const regularUsers = users.filter(
              (u) => !u.role || u.role === 'user'
            );
            setModalData(regularUsers);
            setModalLoading(false);
          } else {
            await refreshUsers();
            // Data will be available in next render via context
            setModalLoading(false);
          }
          break;
        case 'downloads':
          // Use cached data if available, otherwise refresh
          if (downloadBreakdown) {
            setModalData(downloadBreakdown);
            setModalLoading(false);
          } else {
            await refreshDownloadBreakdown();
            setModalLoading(false);
          }
          break;
        case 'admins':
          // Use cached users data
          if (users && users.length > 0) {
            const admins = users.filter(
              (u) => u.role === 'admin' || u.role === 'super admin'
            );
            setModalData(admins);
            setModalLoading(false);
          } else {
            await refreshUsers();
            setModalLoading(false);
          }
          break;
        case 'photographers':
          // For now, just show count - can add detailed view later
          setModalData({ count: analytics?.photographersListed || 0 });
          setModalLoading(false);
          break;
        case 'posters':
          // For now, just show count - can add detailed view later
          setModalData({ count: analytics?.postersUploaded || 0 });
          setModalLoading(false);
          break;
        case 'capDesigns':
          // For now, just show count - can add detailed view later
          setModalData({ count: analytics?.capDesigns || 0 });
          setModalLoading(false);
          break;
      }
    } catch (error) {
      console.error('Error loading modal data:', error);
      setModalLoading(false);
    }
  };

  // Update modal data when context data changes
  useEffect(() => {
    if (!selectedModal || !modalLoading) return;

    switch (selectedModal) {
      case 'users':
        if (users && users.length > 0) {
          // Filter to only show users with role "user" (exclude admins)
          const regularUsers = users.filter(
            (u) => !u.role || u.role === 'user'
          );
          setModalData(regularUsers);
          setModalLoading(false);
        }
        break;
      case 'downloads':
        if (downloadBreakdown) {
          setModalData(downloadBreakdown);
          setModalLoading(false);
        }
        break;
      case 'admins':
        if (users && users.length > 0) {
          const admins = users.filter(
            (u) => u.role === 'admin' || u.role === 'super admin'
          );
          setModalData(admins);
          setModalLoading(false);
        }
        break;
    }
  }, [users, downloadBreakdown, selectedModal, modalLoading]);

  const stats = analytics
    ? [
        {
          label: 'Total Grad Users',
          value: formatNumber(analytics.totalUsers),
          icon: Users,
          change: 'Registered users',
          gradient: 'from-blue-500 to-purple-600',
        },
        {
          label: 'Total Downloads',
          value: formatNumber(analytics.totalDownloads),
          icon: Download,
          change: 'All time downloads',
          gradient: 'from-green-500 to-emerald-600',
        },
        {
          label: 'Total Admins',
          value: formatNumber(analytics.totalAdmins),
          icon: UserCog,
          change: 'Admin accounts',
          gradient: 'from-amber-500 to-orange-600',
        },
        {
          label: 'Photographers Listed',
          value: formatNumber(analytics.photographersListed),
          icon: Camera,
          change: 'Active photographers',
          gradient: 'from-pink-500 to-rose-600',
        },
        {
          label: 'Posters Uploaded',
          value: formatNumber(analytics.postersUploaded),
          icon: FileImage,
          change: 'Available posters',
          gradient: 'from-violet-500 to-indigo-600',
        },
        {
          label: 'Cap Designs',
          value: formatNumber(analytics.capDesigns),
          icon: GraduationCap,
          change: 'Available designs',
          gradient: 'from-cyan-500 to-blue-600',
        },
      ]
    : [
        {
          label: 'Total Grad Users',
          value: '...',
          icon: Users,
          change: 'Loading...',
          gradient: 'from-blue-500 to-purple-600',
        },
        {
          label: 'Total Downloads',
          value: '...',
          icon: Download,
          change: 'Loading...',
          gradient: 'from-green-500 to-emerald-600',
        },
        {
          label: 'Total Admins',
          value: '...',
          icon: UserCog,
          change: 'Loading...',
          gradient: 'from-amber-500 to-orange-600',
        },
        {
          label: 'Photographers Listed',
          value: '...',
          icon: Camera,
          change: 'Loading...',
          gradient: 'from-pink-500 to-rose-600',
        },
        {
          label: 'Posters Uploaded',
          value: '...',
          icon: FileImage,
          change: 'Loading...',
          gradient: 'from-violet-500 to-indigo-600',
        },
        {
          label: 'Cap Designs',
          value: '...',
          icon: GraduationCap,
          change: 'Loading...',
          gradient: 'from-cyan-500 to-blue-600',
        },
      ];

  return (
    <div className='p-6 space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
            <h1 className='font-bold text-3xl md:text-4xl'>Admin Overview</h1>
            <Badge variant='secondary' className='text-sm'>
              {roleDisplay}
            </Badge>
          </div>
          <p className='text-muted-foreground'>
            Monitor and manage your Grad Drive platform
          </p>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          const cardTypes = ['users', 'downloads', 'admins', 'photographers', 'posters', 'capDesigns'];
          const cardType = cardTypes[idx];
          const isLoading = loading || stat.value === '...';
          return (
            <Card
              key={idx}
              className={cn(
                'border-border bg-card shadow-sm transition-shadow',
                !isLoading && 'cursor-pointer hover:shadow-md'
              )}
              onClick={() => !isLoading && handleCardClick(cardType)}
            >
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>
                  {stat.label}
                </CardTitle>
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br',
                    stat.gradient
                  )}
                >
                  {isLoading ? (
                    <Loader2 className='h-4 w-4 text-white animate-spin' />
                  ) : (
                    <Icon className='h-4 w-4 text-white' />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className='font-bold text-2xl'>
                  {isLoading ? (
                    <span className='flex items-center gap-2'>
                      <Loader2 className='h-5 w-5 animate-spin' />
                      Loading...
                    </span>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card className='border-border bg-card shadow-sm'>
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='text-sm text-muted-foreground'>Loading activity...</div>
            ) : analytics && analytics.recentActivity.length > 0 ? (
              <div className='space-y-3 text-sm max-h-96 overflow-y-auto'>
                {analytics.recentActivity.map((activity, idx) => (
                  <div
                    key={activity.id || idx}
                    className={`flex items-center justify-between py-2 ${
                      idx < analytics.recentActivity.length - 1
                        ? 'border-b border-border'
                        : ''
                    }`}
                  >
                    <div className='flex flex-col'>
                      <span>{formatActivityAction(activity.action)}</span>
                      {activity.userRole && (
                        <span className='text-xs text-muted-foreground'>
                          by {activity.userName} ({activity.userRole})
                        </span>
                      )}
                    </div>
                    <span className='text-muted-foreground'>
                      {formatTimeAgo(activity.timestamp)}
                    </span>
              </div>
                ))}
              </div>
            ) : (
              <div className='text-sm text-muted-foreground'>
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border-border bg-card shadow-sm'>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4 max-h-96 overflow-y-auto'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span>User Engagement</span>
                  <span className='font-medium'>87%</span>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div
                    className='h-2 rounded-full bg-accent'
                    style={{ width: '87%' }}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span>Asset Downloads</span>
                  <span className='font-medium'>92%</span>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div
                    className='h-2 rounded-full bg-accent'
                    style={{ width: '92%' }}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center justify-between text-sm'>
                  <span>Photographer Connections</span>
                  <span className='font-medium'>78%</span>
                </div>
                <div className='h-2 rounded-full bg-muted'>
                  <div
                    className='h-2 rounded-full bg-accent'
                    style={{ width: '78%' }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown Modals */}
      <Dialog open={selectedModal !== null} onOpenChange={() => setSelectedModal(null)}>
        <DialogContent className='sm:max-w-4xl max-h-[90vh] overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>
              {selectedModal === 'users' && 'All Users'}
              {selectedModal === 'downloads' && 'Download Breakdown'}
              {selectedModal === 'admins' && 'Admin Users'}
              {selectedModal === 'photographers' && 'Photographers'}
              {selectedModal === 'posters' && 'Posters'}
              {selectedModal === 'capDesigns' && 'Cap Designs'}
            </DialogTitle>
            <DialogDescription>
              {selectedModal === 'users' && 'List of all registered users (excluding admins)'}
              {selectedModal === 'downloads' && 'Detailed breakdown of downloads by category'}
              {selectedModal === 'admins' && 'List of all admin accounts'}
              {selectedModal === 'photographers' && 'Photographer listings'}
              {selectedModal === 'posters' && 'All uploaded posters'}
              {selectedModal === 'capDesigns' && 'All cap designs'}
            </DialogDescription>
          </DialogHeader>

          {modalLoading ? (
            <div className='py-8 text-center text-muted-foreground'>
              Loading...
            </div>
          ) : selectedModal === 'users' && modalData ? (
            <div className='space-y-4'>
              <div className='text-sm text-muted-foreground mb-4'>
                Total: {modalData.length} users
              </div>
              <div className='space-y-2 max-h-96 overflow-y-auto'>
                {modalData.map((user: any) => (
                  <div
                    key={user.id}
                    className='p-3 border border-border rounded-lg hover:bg-accent/50'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-medium'>{user.displayName || 'No name'}</div>
                        <div className='text-sm text-muted-foreground'>{user.email}</div>
                        {user.createdAt && (
                          <div className='text-xs text-muted-foreground mt-1'>
                            Joined: {formatDate(user.createdAt)}
                          </div>
                        )}
                      </div>
                      <Badge variant={user.role === 'admin' || user.role === 'super admin' ? 'default' : 'secondary'}>
                        {user.role || 'user'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedModal === 'downloads' && modalData ? (
            <div className='space-y-6'>
              <div>
                <h3 className='font-semibold mb-3 flex items-center gap-2'>
                  <FileImage className='h-4 w-4' />
                  Posters ({modalData.posters.length})
                </h3>
                <div className='space-y-2 max-h-48 overflow-y-auto'>
                  {modalData.posters.length > 0 ? (
                    modalData.posters.map((poster: any) => (
                      <div
                        key={poster.id}
                        className='p-2 border border-border rounded flex items-center justify-between'
                      >
                        <span className='text-sm'>{poster.name}</span>
                        <Badge variant='secondary'>{poster.downloads} downloads</Badge>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>No posters yet</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className='font-semibold mb-3 flex items-center gap-2'>
                  <BookOpen className='h-4 w-4' />
                  E-books ({modalData.ebooks.length})
                </h3>
                <div className='space-y-2 max-h-48 overflow-y-auto'>
                  {modalData.ebooks.length > 0 ? (
                    modalData.ebooks.map((ebook: any) => (
                      <div
                        key={ebook.id}
                        className='p-2 border border-border rounded flex items-center justify-between'
                      >
                        <span className='text-sm'>{ebook.title}</span>
                        <Badge variant='secondary'>{ebook.downloads} downloads</Badge>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>No e-books yet</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className='font-semibold mb-3 flex items-center gap-2'>
                  <GraduationCap className='h-4 w-4' />
                  Cap Designs ({modalData.capDesigns.length})
                </h3>
                <div className='space-y-2 max-h-48 overflow-y-auto'>
                  {modalData.capDesigns.length > 0 ? (
                    modalData.capDesigns.map((design: any) => (
                      <div
                        key={design.id}
                        className='p-2 border border-border rounded flex items-center justify-between'
                      >
                        <span className='text-sm'>{design.name}</span>
                        <Badge variant='secondary'>{design.downloads} downloads</Badge>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>No cap designs yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : selectedModal === 'admins' && modalData ? (
            <div className='space-y-4'>
              <div className='text-sm text-muted-foreground mb-4'>
                Total: {modalData.length} admins
              </div>
              <div className='space-y-2 max-h-96 overflow-y-auto'>
                {modalData.map((admin: any) => (
                  <div
                    key={admin.id}
                    className='p-3 border border-border rounded-lg hover:bg-accent/50'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-medium'>{admin.displayName || 'No name'}</div>
                        <div className='text-sm text-muted-foreground'>{admin.email}</div>
                        {admin.createdAt && (
                          <div className='text-xs text-muted-foreground mt-1'>
                            Joined: {formatDate(admin.createdAt)}
                          </div>
                        )}
                      </div>
                      <Badge variant={admin.role === 'super admin' ? 'default' : 'secondary'}>
                        {admin.role}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='py-8 text-center text-muted-foreground'>
              {modalData?.count !== undefined
                ? `Total: ${modalData.count}`
                : 'No data available'}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
