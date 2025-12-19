import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Chrome } from 'lucide-react';

export function AdminWelcomeScreen() {
  return (
    <main className='flex-col flex justify-center items-center min-h-screen bg-muted/30'>
      <div className='container py-20'>
        <div className='mx-auto max-w-md space-y-6'>
          <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <div className='flex h-12 w-12 items-center justify-center rounded-md bg-primary'>
                <span className='font-bold text-primary-foreground text-xl'>GD</span>
              </div>
              <span className='font-bold text-2xl text-foreground'>Grad Drive</span>
            </div>
            <h1 className='font-bold text-3xl md:text-4xl text-balance text-foreground'>
              Admin Login
            </h1>
            <p className='text-muted-foreground text-balance'>
              Access the admin panel to manage your Grad Drive platform
            </p>
          </div>

          <Card className='border-border bg-card shadow-sm'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-xl font-bold'>Sign In Options</CardTitle>
              <CardDescription>Choose your preferred sign-in method</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Link href='/admin/login'>
                <Button className='w-full' size='lg' variant='outline'>
                  <Mail className='mr-2 h-4 w-4' />
                  Sign in with Email
                </Button>
              </Link>
              <Link href='/admin/login'>
                <Button className='w-full' size='lg' variant='outline'>
                  <Chrome className='mr-2 h-4 w-4' />
                  Sign in with Google
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className='border-border bg-card shadow-sm'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-xl font-bold'>Create Admin Account</CardTitle>
              <CardDescription>New to the admin panel? Sign up here</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Link href='/admin/signup'>
                <Button className='w-full' size='lg' variant='outline'>
                  <Mail className='mr-2 h-4 w-4' />
                  Sign up with Email
                </Button>
              </Link>
              <Link href='/admin/signup'>
                <Button className='w-full' size='lg' variant='outline'>
                  <Chrome className='mr-2 h-4 w-4' />
                  Sign up with Google
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className='text-center text-sm text-muted-foreground'>
            <Link href='/' className='text-accent hover:underline'>
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

