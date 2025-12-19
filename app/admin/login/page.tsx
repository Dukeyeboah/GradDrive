import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Chrome } from 'lucide-react';

export default function AdminLoginPage() {
  return (
    <main className='flex-col flex justify-center items-center min-h-screen bg-muted/30'>
      <div className='container py-20'>
        <div className='mx-auto max-w-md'>
          <Card className='border-border bg-card shadow-sm'>
            <CardHeader className='space-y-1'>
              <CardTitle className='text-2xl font-bold'>Admin Sign In</CardTitle>
              <CardDescription>Sign in to your admin account</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input id='email' type='email' placeholder='admin@example.com' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='password'>Password</Label>
                <Input id='password' type='password' placeholder='••••••••' />
              </div>
              <Button className='w-full' size='lg'>
                Sign In
              </Button>
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-card px-2 text-muted-foreground'>Or continue with</span>
                </div>
              </div>
              <Button className='w-full' size='lg' variant='outline'>
                <Chrome className='mr-2 h-4 w-4' />
                Sign in with Google
              </Button>
            </CardContent>
            <CardFooter className='flex flex-col space-y-4'>
              <div className='text-sm text-muted-foreground text-center'>
                Don't have an admin account?{' '}
                <Link href='/admin/signup' className='text-accent hover:underline font-medium'>
                  Sign up
                </Link>
              </div>
              <div className='text-sm text-muted-foreground text-center'>
                <Link href='/admin' className='text-accent hover:underline'>
                  ← Back to admin portal
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}

