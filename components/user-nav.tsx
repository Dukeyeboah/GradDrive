'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  User,
  Menu,
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Camera,
  Award,
  FileImage,
  Users,
  History,
  LogOut,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useViewMode } from '@/contexts/ViewModeContext';
import { signOutUser } from '@/lib/firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export function UserNav() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { user, userData } = useAuth();
  const { setViewMode, isAdminViewingAsUser } = useViewMode();
  const isDashboard = pathname === '/dashboard';
  const showBackButton = !isDashboard && pathname.startsWith('/dashboard');

  // Check if user is an admin
  const isAdmin =
    userData?.role === 'admin' || userData?.role === 'super admin';

  // Get first letter of name for avatar fallback
  const getInitial = () => {
    if (userData?.displayName) {
      return userData.displayName.charAt(0).toUpperCase();
    }
    if (userData?.email) {
      return userData.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className='flex justify-center items-center sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-4 md:px-6'>
        <div className='flex items-center gap-6'>
          <Link
            href='/dashboard'
            className='flex items-center gap-2 sm:gap-3 shrink-0'
            aria-label='Grad Drive home'
          >
            <Image
              src='/images/logo.png'
              alt=''
              width={40}
              height={40}
              className='h-8 w-8 sm:h-9 sm:w-9 object-contain'
            />
            <Image
              src='/images/graddrive.png'
              alt='Grad Drive'
              width={160}
              height={40}
              className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
            />
          </Link>

          {showBackButton && (
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/dashboard')}
              className='gap-2'
            >
              <ArrowLeft className='h-4 w-4' />
              Back
            </Button>
          )}
        </div>

        <div className='flex items-center gap-2'>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-64'>
                <div className='flex flex-col gap-2 mt-8'>
                  <Link href='/dashboard'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <GraduationCap className='h-4 w-4' />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href='/dashboard/photographers'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <Camera className='h-4 w-4' />
                      Book Photographer
                    </Button>
                  </Link>
                  <Link href='/dashboard/ebooks'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <BookOpen className='h-4 w-4' />
                      Life after grad E-books
                    </Button>
                  </Link>
                  <Link href='/dashboard/posters'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <FileImage className='h-4 w-4' />
                      Digital Posters & Artwork
                    </Button>
                  </Link>
                  <Link href='/dashboard/cap-designs'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <GraduationCap className='h-4 w-4' />
                      Graduation Cap Designs
                    </Button>
                  </Link>
                  <Link href='/dashboard/alum-club'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <Users className='h-4 w-4' />
                      HoS Alumni Club
                    </Button>
                  </Link>
                  <Link href='/dashboard/kente-history'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <History className='h-4 w-4' />
                      Kente & Graduation History
                    </Button>
                  </Link>
                  <Link href='/dashboard/scholarship'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <Award className='h-4 w-4' />
                      Scholarships
                    </Button>
                  </Link>
                  <div className='border-t border-border my-2' />
                  <Link href='/dashboard/account'>
                    <Button
                      variant='ghost'
                      className='w-full justify-start gap-2'
                    >
                      <User className='h-4 w-4' />
                      Account
                    </Button>
                  </Link>
                  <Button
                    variant='ghost'
                    className='w-full justify-start gap-2'
                    onClick={async () => {
                      await signOutUser();
                      router.push('/');
                    }}
                  >
                    <LogOut className='h-4 w-4' />
                    Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full h-10 w-10 p-0 overflow-hidden relative'
              >
                {userData?.photoURL ? (
                  <>
                    <img
                      src={userData.photoURL}
                      alt={userData.displayName || 'User'}
                      className='h-full w-full rounded-full object-cover'
                      style={{ display: 'block' }}
                      onError={(e) => {
                        // If image fails, hide it and show fallback
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          // Check if fallback already exists
                          const existingFallback =
                            parent.querySelector('.avatar-fallback');
                          if (!existingFallback) {
                            const fallback = document.createElement('div');
                            fallback.className =
                              'avatar-fallback h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm absolute inset-0';
                            fallback.textContent = getInitial();
                            parent.appendChild(fallback);
                          } else {
                            existingFallback.classList.remove('hidden');
                          }
                        }
                      }}
                    />
                    {/* Fallback - hidden by default, shown if image fails */}
                    <div className='avatar-fallback h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm absolute inset-0 hidden'>
                      {userData?.displayName || userData?.email ? (
                        getInitial()
                      ) : (
                        <User className='h-5 w-5' />
                      )}
                    </div>
                  </>
                ) : userData?.displayName || userData?.email ? (
                  <div className='h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm'>
                    {getInitial()}
                  </div>
                ) : (
                  <div className='h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white'>
                    <User className='h-5 w-5' />
                  </div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href='/dashboard' className='flex items-center gap-2'>
                  <GraduationCap className='h-4 w-4' />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/photographers'
                  className='flex items-center gap-2'
                >
                  <Camera className='h-4 w-4' />
                  Book Photographer
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/ebooks'
                  className='flex items-center gap-2'
                >
                  <BookOpen className='h-4 w-4' />
                  Life after grad E-books
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/posters'
                  className='flex items-center gap-2'
                >
                  <FileImage className='h-4 w-4' />
                  Digital Posters & Artwork
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/cap-designs'
                  className='flex items-center gap-2'
                >
                  <GraduationCap className='h-4 w-4' />
                  Graduation Cap Designs
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/alum-club'
                  className='flex items-center gap-2'
                >
                  <Users className='h-4 w-4' />
                  HoS Alumni Club
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/kente-history'
                  className='flex items-center gap-2'
                >
                  <History className='h-4 w-4' />
                  Kente & Graduation History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/scholarship'
                  className='flex items-center gap-2'
                >
                  <Award className='h-4 w-4' />
                  Scholarships
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href='/dashboard/account'
                  className='flex items-center gap-2'
                >
                  <User className='h-4 w-4' />
                  Account
                </Link>
              </DropdownMenuItem>
              {isAdmin && isAdminViewingAsUser && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setViewMode('admin');
                      router.push('/admin/dashboard');
                      toast({
                        title: 'Switched to Admin View',
                        description: 'You are now viewing the admin dashboard.',
                      });
                    }}
                    className='flex items-center gap-2'
                  >
                    <Shield className='h-4 w-4' />
                    Switch to Admin View
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  await signOutUser();
                  // Clear view mode
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('adminViewMode');
                  }
                  router.push('/');
                }}
                className='flex items-center gap-2'
              >
                <LogOut className='h-4 w-4' />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
