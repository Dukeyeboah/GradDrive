'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { AdminStatCard } from '@/components/admin/admin-stat-card';
import { AdminRecentActivity } from '@/components/admin/admin-recent-activity';
import { AdminPlatformHealthCard } from '@/components/admin/admin-platform-health-card';
import { AdminQuickAccessGrid } from '@/components/admin/admin-quick-access-grid';
import { derivePlatformHealthScores } from '@/lib/admin/derive-platform-health';

export default function AdminDashboardPage() {
  const { userData } = useAuth();
  const {
    analytics,
    users,
    downloadBreakdown,
    loading,
    refreshUsers,
    refreshDownloadBreakdown,
  } = useData();
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const role = userData?.role || 'admin';
  const roleDisplay = role === 'super admin' ? 'Super Admin' : 'Admin';
  const displayName = userData?.displayName?.split(' ')[0] || 'there';

  const formatNumber = (num: number) => num.toLocaleString();

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

  const handleCardClick = async (cardType: string) => {
    setSelectedModal(cardType);
    setModalLoading(true);
    setModalData(null);

    try {
      switch (cardType) {
        case 'users':
          if (users && users.length > 0) {
            setModalData(users.filter((u) => !u.role || u.role === 'user'));
            setModalLoading(false);
          } else {
            await refreshUsers();
            setModalLoading(false);
          }
          break;
        case 'downloads':
          if (downloadBreakdown) {
            setModalData(downloadBreakdown);
            setModalLoading(false);
          } else {
            await refreshDownloadBreakdown();
            setModalLoading(false);
          }
          break;
        case 'admins':
          if (users && users.length > 0) {
            setModalData(
              users.filter(
                (u) => u.role === 'admin' || u.role === 'super admin',
              ),
            );
            setModalLoading(false);
          } else {
            await refreshUsers();
            setModalLoading(false);
          }
          break;
        case 'photographers':
          setModalData({ count: analytics?.photographersListed || 0 });
          setModalLoading(false);
          break;
        case 'posters':
          setModalData({ count: analytics?.postersUploaded || 0 });
          setModalLoading(false);
          break;
        case 'capDesigns':
          setModalData({ count: analytics?.capDesigns || 0 });
          setModalLoading(false);
          break;
      }
    } catch (error) {
      console.error('Error loading modal data:', error);
      setModalLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedModal || !modalLoading) return;

    switch (selectedModal) {
      case 'users':
        if (users && users.length > 0) {
          setModalData(users.filter((u) => !u.role || u.role === 'user'));
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
          setModalData(
            users.filter(
              (u) => u.role === 'admin' || u.role === 'super admin',
            ),
          );
          setModalLoading(false);
        }
        break;
    }
  }, [users, downloadBreakdown, selectedModal, modalLoading]);

  const health = derivePlatformHealthScores(analytics);

  const statDefs = [
    {
      key: 'users' as const,
      label: 'Total Grad Users',
      icon: Users,
      iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
      value: analytics ? formatNumber(analytics.totalUsers) : '…',
      descriptor: 'Registered users',
    },
    {
      key: 'downloads' as const,
      label: 'Total Downloads',
      icon: Download,
      iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      value: analytics ? formatNumber(analytics.totalDownloads) : '…',
      descriptor: 'All time downloads',
    },
    {
      key: 'admins' as const,
      label: 'Total Admins',
      icon: UserCog,
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      value: analytics ? formatNumber(analytics.totalAdmins) : '…',
      descriptor: 'Admin accounts',
    },
    {
      key: 'photographers' as const,
      label: 'Photographers Listed',
      icon: Camera,
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
      value: analytics ? formatNumber(analytics.photographersListed) : '…',
      descriptor: 'Active photographers',
    },
    {
      key: 'posters' as const,
      label: 'Posters Uploaded',
      icon: FileImage,
      iconBg: 'bg-gradient-to-br from-violet-500 to-indigo-600',
      value: analytics ? formatNumber(analytics.postersUploaded) : '…',
      descriptor: 'Available posters',
    },
    {
      key: 'capDesigns' as const,
      label: 'Cap Designs',
      icon: GraduationCap,
      iconBg: 'bg-gradient-to-br from-sky-500 to-cyan-600',
      value: analytics ? formatNumber(analytics.capDesigns) : '…',
      descriptor: 'Available designs',
    },
  ];

  const statLoading = loading || !analytics;

  return (
    <div className='space-y-10 p-4 sm:p-6 lg:p-8'>
      <div className='space-y-2'>
        <div className='flex flex-wrap items-center gap-3'>
          <h1 className='text-3xl font-bold tracking-tight text-foreground md:text-4xl'>
            Welcome back, {displayName}! 👋
          </h1>
          <Badge
            variant='secondary'
            className='rounded-full border border-border bg-background text-xs font-medium'
          >
            {roleDisplay}
          </Badge>
        </div>
        <p className='max-w-2xl text-muted-foreground text-pretty leading-relaxed'>
          Here&apos;s what&apos;s happening with your Grad Drive platform.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {statDefs.map((stat) => (
          <AdminStatCard
            key={stat.key}
            label={stat.label}
            value={stat.value}
            descriptor={stat.descriptor}
            icon={stat.icon}
            iconBgClassName={stat.iconBg}
            loading={statLoading}
            onClick={() => handleCardClick(stat.key)}
          />
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        <AdminRecentActivity
          loading={loading}
          activities={analytics?.recentActivity ?? []}
        />
        <AdminPlatformHealthCard
          userEngagement={health.userEngagement}
          assetDownloads={health.assetDownloads}
          photographerConnections={health.photographerConnections}
        />
      </div>

      <AdminQuickAccessGrid />

      <Dialog
        open={selectedModal !== null}
        onOpenChange={() => setSelectedModal(null)}
      >
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
              {selectedModal === 'users' &&
                'List of all registered users (excluding admins)'}
              {selectedModal === 'downloads' &&
                'Detailed breakdown of downloads by category'}
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
                    className='p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors duration-200'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-medium'>
                          {user.displayName || 'No name'}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {user.email}
                        </div>
                        {user.createdAt && (
                          <div className='text-xs text-muted-foreground mt-1'>
                            Joined: {formatDate(user.createdAt)}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          user.role === 'admin' || user.role === 'super admin'
                            ? 'default'
                            : 'secondary'
                        }
                      >
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
                        className='p-2 border border-border rounded-lg flex items-center justify-between'
                      >
                        <span className='text-sm'>{poster.name}</span>
                        <Badge variant='secondary'>
                          {poster.downloads} downloads
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      No posters yet
                    </p>
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
                        className='p-2 border border-border rounded-lg flex items-center justify-between'
                      >
                        <span className='text-sm'>{ebook.title}</span>
                        <Badge variant='secondary'>
                          {ebook.downloads} downloads
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      No e-books yet
                    </p>
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
                        className='p-2 border border-border rounded-lg flex items-center justify-between'
                      >
                        <span className='text-sm'>{design.name}</span>
                        <Badge variant='secondary'>
                          {design.downloads} downloads
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className='text-sm text-muted-foreground'>
                      No cap designs yet
                    </p>
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
                    className='p-3 border border-border rounded-xl hover:bg-muted/50 transition-colors duration-200'
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-medium'>
                          {admin.displayName || 'No name'}
                        </div>
                        <div className='text-sm text-muted-foreground'>
                          {admin.email}
                        </div>
                        {admin.createdAt && (
                          <div className='text-xs text-muted-foreground mt-1'>
                            Joined: {formatDate(admin.createdAt)}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={
                          admin.role === 'super admin' ? 'default' : 'secondary'
                        }
                      >
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
