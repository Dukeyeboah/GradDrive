"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Chrome, Loader2, AlertCircle } from 'lucide-react'
import { ADMIN_PASSKEY, SUPER_ADMIN_PASSKEY } from '@/lib/config/admin'
import { signInEmailPassword, signUpEmailPassword, signInWithGoogle } from '@/lib/firebase/auth'
import { getUserRole, setUserRole } from '@/lib/firebase/firestore'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { useViewMode } from '@/contexts/ViewModeContext'

export function AdminWelcomeScreen() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userData } = useAuth()
  const { setViewMode } = useViewMode()
  const [passkey, setPasskey] = useState('')
  const [passkeyVerified, setPasskeyVerified] = useState(false)
  const [isLogin, setIsLogin] = useState(true) // Toggle between login and signup
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"admin" | "super admin">("admin")
  const [passkeyError, setPasskeyError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    // Check if passkey was verified (stored in sessionStorage - clears when browser closes)
    // You can change this to localStorage if you want it to persist longer
    if (typeof window !== "undefined") {
      const verified = sessionStorage.getItem("adminPasskeyVerified")
      const role = sessionStorage.getItem("adminRole") as "admin" | "super admin" | null
      if (verified === "true" && role) {
        setPasskeyVerified(true)
        setSelectedRole(role)
      }
    }

    // If user is already logged in and is admin, redirect to dashboard
    if (user && (userData?.role === 'admin' || userData?.role === 'super admin')) {
      setViewMode('admin')
      router.push('/admin/dashboard')
    }
  }, [user, userData, router])

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    let role: "admin" | "super admin" | null = null
    
    if (passkey === SUPER_ADMIN_PASSKEY) {
      role = "super admin"
    } else if (passkey === ADMIN_PASSKEY) {
      role = "admin"
    } else {
      const errorMessage = 'The passkey you entered is incorrect. Please check and try again, or contact an administrator if you believe this is an error.'
      setPasskeyError(errorMessage)
      toast({
        title: 'Incorrect Passkey',
        description: errorMessage,
        variant: 'destructive',
      })
      setPasskey('') // Clear the input
      return
    }
    
    // Clear error on successful passkey
    setPasskeyError(null)

    // Store passkey verification and role in sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("adminPasskeyVerified", "true")
      sessionStorage.setItem("adminRole", role)
    }
    
    setSelectedRole(role)
    setPasskeyVerified(true)
    toast({
      title: 'Passkey Verified',
      description: `You can now proceed to log in as ${role === "super admin" ? "Super Admin" : "Admin"}.`,
    })
  }

  // Show passkey form if not verified
  if (!passkeyVerified) {
  return (
    <main className='flex-col flex justify-center items-center min-h-screen bg-muted/30'>
      <div className='container py-20'>
        <div className='mx-auto max-w-md space-y-6'>
          <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-2 sm:gap-3 mb-4'>
              <Image
                src='/images/logo.png'
                alt=''
                width={44}
                height={44}
                className='h-9 w-9 sm:h-10 sm:w-10 object-contain'
                priority
              />
              <Image
                src='/images/graddrive.png'
                alt='Grad Drive'
                width={160}
                height={40}
                className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
                priority
              />
            </div>
            <h1 className='font-bold text-3xl md:text-4xl text-balance text-foreground'>
              Admin Login
            </h1>
            <p className='text-muted-foreground text-balance'>
              Access the admin panel to manage your Grad Drive platform
            </p>
          </div>

          <Card className='border-border bg-card shadow-sm'>
              <CardHeader>
                <CardTitle>Enter Admin Passkey</CardTitle>
                <CardDescription>
                  Please enter the admin passkey to continue
                </CardDescription>
            </CardHeader>
              <form onSubmit={handlePasskeySubmit}>
            <CardContent className='space-y-4'>
                  {passkeyError && (
                    <Alert variant='destructive'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>Incorrect Passkey</AlertTitle>
                      <AlertDescription>{passkeyError}</AlertDescription>
                    </Alert>
                  )}
                  <div className='space-y-2'>
                    <Label htmlFor='passkey'>Admin Passkey</Label>
                    <Input
                      id='passkey'
                      type='password'
                      placeholder='Enter admin passkey'
                      value={passkey}
                      onChange={(e) => {
                        setPasskey(e.target.value)
                        // Clear error when user starts typing
                        if (passkeyError) {
                          setPasskeyError(null)
                        }
                      }}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type='submit' className='w-full' size='lg'>
                    Continue
                </Button>
                </CardContent>
              </form>
            </Card>

            <div className='text-center text-sm text-muted-foreground'>
              <Link href='/' className='text-accent hover:underline'>
                ← Back to main site
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login flow
        const { user: authUser, error } = await signInEmailPassword(formData.email, formData.password)
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          })
          setLoading(false)
          return
        }
        
        if (authUser) {
          // Get role from sessionStorage (set during passkey verification)
          const roleFromPasskey = typeof window !== "undefined" 
            ? (sessionStorage.getItem("adminRole") as "admin" | "super admin" | null)
            : null
          
          // Check if user is admin/super admin, if not, set them based on passkey
          const currentRole = await getUserRole(authUser.uid)
          const targetRole = roleFromPasskey || 'admin'
          
          // If user is trying to upgrade from 'user' to 'admin', check permissions
          if (currentRole === 'user' && (targetRole === 'admin' || targetRole === 'super admin')) {
            try {
              await setUserRole(authUser.uid, targetRole)
            } catch (roleError: any) {
              // Permission denied - user can't upgrade their own role
              if (
                roleError.code === 'permission-denied' ||
                roleError.message?.includes('permission') ||
                roleError.message?.includes('insufficient permissions')
              ) {
                toast({
                  title: 'Access Denied',
                  description: 'Your account does not have admin privileges. Please contact an administrator to upgrade your account role, or sign in with a different account that has admin access.',
                  variant: 'destructive',
                })
                setLoading(false)
                return
              }
              throw roleError // Re-throw if it's a different error
            }
          } else if (currentRole !== targetRole && currentRole !== 'user') {
            // Only update if not trying to upgrade from user
            await setUserRole(authUser.uid, targetRole)
          }
          
          // Check final role after update attempt
          const finalRole = await getUserRole(authUser.uid)
          if (finalRole !== 'admin' && finalRole !== 'super admin') {
            toast({
              title: 'Access Denied',
              description: 'Your account does not have admin privileges. Please contact an administrator to upgrade your account role.',
              variant: 'destructive',
            })
            setLoading(false)
            return
          }
          
          toast({
            title: 'Success',
            description: 'Logged in successfully!',
          })
          router.push('/admin/dashboard')
          router.refresh()
        }
      } else {
        // Signup flow
        // Get role from sessionStorage (set during passkey verification)
        const roleFromPasskey = typeof window !== "undefined" 
          ? (sessionStorage.getItem("adminRole") as "admin" | "super admin" | null)
          : null
        
        const { user: authUser, error } = await signUpEmailPassword(
          formData.email,
          formData.password,
          formData.name,
          roleFromPasskey || 'admin' // Set role based on passkey
        )
        if (error) {
          toast({
            title: 'Error',
            description: error,
            variant: 'destructive',
          })
          setLoading(false)
          return
        }
        
        if (authUser) {
          toast({
            title: 'Success',
            description: 'Admin account created successfully!',
          })
          router.push('/admin/dashboard')
          router.refresh()
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    try {
      // Ensure admin role is stored
      if (typeof window !== "undefined") {
        sessionStorage.setItem("adminPasskeyVerified", "true")
        sessionStorage.setItem("adminRole", selectedRole)
      }
      
      // Get role from sessionStorage (set during passkey verification)
      const roleFromPasskey = typeof window !== "undefined" 
        ? (sessionStorage.getItem("adminRole") as "admin" | "super admin" | null)
        : null
      
      const { user, error } = await signInWithGoogle(roleFromPasskey || 'admin')
      
      if (error) {
        // Check for specific permission denied error
        if (error === 'PERMISSION_DENIED_ROLE_UPGRADE') {
          toast({
            title: 'Access Denied',
            description: 'Your account does not have admin privileges. Please contact an administrator to upgrade your account role, or sign in with a different account that has admin access.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Sign-in Error',
            description: error,
            variant: 'destructive',
          })
        }
        setLoading(false)
        return
      }
      
      if (user) {
        toast({
          title: 'Success',
          description: 'Signed in successfully!',
        })
        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (error: any) {
      console.error("Google auth error:", error)
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
    })
  }

  // Show login/signup form after passkey verification
  return (
    <main className='flex-col flex justify-center items-center min-h-screen bg-muted/30'>
      <div className='container py-20'>
        <div className='mx-auto max-w-md space-y-6'>
          <div className='text-center space-y-4'>
            <div className='flex items-center justify-center gap-2 sm:gap-3 mb-4'>
              <Image
                src='/images/logo.png'
                alt=''
                width={44}
                height={44}
                className='h-9 w-9 sm:h-10 sm:w-10 object-contain'
                priority
              />
              <Image
                src='/images/graddrive.png'
                alt='Grad Drive'
                width={160}
                height={40}
                className='h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left'
                priority
              />
            </div>
            <h1 className='font-bold text-3xl md:text-4xl text-balance text-foreground'>
              Admin {isLogin ? 'Log In' : 'Sign Up'}
            </h1>
            <p className='text-muted-foreground text-balance'>
              {isLogin 
                ? 'Access the admin panel to manage your Grad Drive platform'
                : 'Create an admin account to get started'}
            </p>
          </div>

          <Card className='border-border bg-card shadow-sm'>
            <CardHeader className='space-y-1'>
              <div className='flex items-center gap-2 mb-2'>
                <Button
                  variant={isLogin ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => {
                    setIsLogin(true)
                    resetForm()
                  }}
                  className='flex-1'
                >
                  Log In
                </Button>
                <Button
                  variant={!isLogin ? 'default' : 'ghost'}
                  size='sm'
                  onClick={() => {
                    setIsLogin(false)
                    resetForm()
                  }}
                  className='flex-1'
                >
                  Sign Up
                </Button>
              </div>
              <CardDescription>
                {isLogin 
                  ? 'Log in to your admin account'
                  : 'Create your admin account'}
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleEmailAuth}>
            <CardContent className='space-y-4'>
                {!isLogin && (
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name</Label>
                    <Input
                      id='name'
                      type='text'
                      placeholder='John Doe'
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                    />
                  </div>
                )}
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='admin@example.com'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='password'>Password</Label>
                  <Input
                    id='password'
                    type='password'
                    placeholder='••••••••'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={isLogin ? undefined : 6}
                  />
                </div>
                <Button className='w-full' size='lg' type='submit' disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      {isLogin ? 'Logging in...' : 'Creating account...'}
                    </>
                  ) : (
                    isLogin ? 'Log In' : 'Create Admin Account'
                  )}
                </Button>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-card px-2 text-muted-foreground'>Or continue with</span>
                  </div>
                </div>
                <Button
                  className='w-full'
                  size='lg'
                  variant='outline'
                  type='button'
                  onClick={handleGoogleAuth}
                  disabled={loading}
                >
                  <Chrome className='mr-2 h-4 w-4' />
                  {isLogin ? 'Log in' : 'Sign up'} with Google
                </Button>
            </CardContent>
            </form>
            <CardFooter className='flex flex-col space-y-4'>
              <div className='text-sm text-muted-foreground text-center'>
                {isLogin ? (
                  <>
                    Don't have an admin account?{' '}
                    <button
                      onClick={() => {
                        setIsLogin(false)
                        resetForm()
                      }}
                      className='text-accent hover:underline font-medium'
                      type='button'
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an admin account?{' '}
                    <button
                      onClick={() => {
                        setIsLogin(true)
                        resetForm()
                      }}
                      className='text-accent hover:underline font-medium'
                      type='button'
                    >
                      Log in
                    </button>
                  </>
                )}
              </div>
          <div className='text-center text-sm text-muted-foreground'>
            <Link href='/' className='text-accent hover:underline'>
              ← Back to main site
            </Link>
          </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}

