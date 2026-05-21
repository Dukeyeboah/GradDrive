"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Chrome, Loader2 } from "lucide-react"
import {
  signInEmailPassword,
  signUpEmailPassword,
  signInWithGoogle,
  getUserData,
} from "@/lib/firebase/auth"
import { getUserRole } from "@/lib/firebase/firestore"
import { readGradDriveAccessUnlocked } from "@/lib/config/user"
import { useToast } from "@/hooks/use-toast"
import { FirstTimeProfileModal } from "@/components/first-time-profile-modal"

interface AuthModalsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "login" | "signup"
  onModeChange: (mode: "login" | "signup") => void
  onSignupBlockedWithoutPasskey?: () => void
}

export function AuthModals({
  open,
  onOpenChange,
  mode,
  onModeChange,
  onSignupBlockedWithoutPasskey,
}: AuthModalsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [newUserUid, setNewUserUid] = useState<string | null>(null)
  const [newUserName, setNewUserName] = useState<string | null>(null)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        const { user, error } = await signInEmailPassword(
          formData.email,
          formData.password,
        )
        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        } else if (user) {
          const role = await getUserRole(user.uid)
          toast({
            title: "Success",
            description: "Signed in successfully!",
          })
          onOpenChange(false)
          if (role === "admin" || role === "super admin") {
            router.push("/admin/dashboard")
          } else if (role === "photographer-admin") {
            router.push("/photographer-admin/dashboard")
          } else {
            router.push("/dashboard")
          }
          router.refresh()
        }
      } else {
        if (!readGradDriveAccessUnlocked()) {
          toast({
            title: "Passkey required",
            description:
              "Unlock sign-up with your access passkey first (Get access on the home page).",
            variant: "destructive",
          })
          onOpenChange(false)
          onSignupBlockedWithoutPasskey?.()
          setLoading(false)
          return
        }

        const { user, error } = await signUpEmailPassword(
          formData.email,
          formData.password,
          formData.name,
          "user",
        )
        if (error) {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          })
        } else if (user) {
          toast({
            title: "Success",
            description: "Account created successfully!",
          })
          onOpenChange(false)
          const existing = await getUserData(user.uid)
          if (existing?.collegeName != null || existing?.graduationYear != null) {
            router.push("/dashboard")
            router.refresh()
          } else {
            setNewUserUid(user.uid)
            setNewUserName(formData.name || null)
            setShowProfileModal(true)
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    if (mode === "signup" && !readGradDriveAccessUnlocked()) {
      toast({
        title: "Passkey required",
        description:
          "Unlock sign-up with your access passkey first, then use Google again.",
        variant: "destructive",
      })
      onOpenChange(false)
      onSignupBlockedWithoutPasskey?.()
      return
    }

    setLoading(true)
    try {
      const { user, error } = await signInWithGoogle("user")

      if (error) {
        const err = String(error)
        const noGradDriveAccount =
          err.includes("Access restricted") ||
          err.includes("only for accounts that already exist") ||
          err.includes("Google sign-in is only for accounts")
        toast({
          title: noGradDriveAccount
            ? "No Grad Drive account yet"
            : "Sign-in failed",
          description: noGradDriveAccount
            ? "This Google account is not registered with Grad Drive, or you still need to unlock access with your passkey on the home page before creating an account. Use Log in only if you have already signed up."
            : err,
          variant: "destructive",
          duration: noGradDriveAccount ? 14_000 : 7_000,
        })
        setLoading(false)
        return
      }

      if (user) {
        toast({
          title: "Success",
          description: "Signed in successfully!",
        })
        onOpenChange(false)
        const role = await getUserRole(user.uid)
        if (role === "admin" || role === "super admin") {
          router.push("/admin/dashboard")
        } else if (role === "photographer-admin") {
          router.push("/photographer-admin/dashboard")
        } else {
          router.push("/dashboard")
        }
        router.refresh()
      }
    } catch (error: any) {
      console.error("Google auth error:", error)
      toast({
        title: "Error",
        description:
          error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "login" ? "Welcome back" : "Create an account"}
          </DialogTitle>
          <DialogDescription>
            {mode === "login"
              ? "Log in with email or Google. New to Grad Drive? Use Sign up on the home page after unlocking with your passkey."
              : "Create your account with email or Google. You already unlocked sign-up with your passkey on this device."}
          </DialogDescription>
        </DialogHeader>
        <Card className="border-0 shadow-none">
          <form onSubmit={handleEmailAuth}>
            <CardContent className="space-y-4 pt-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required={mode === "signup"}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  minLength={6}
                />
              </div>
              <Button className="w-full" size="lg" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mode === "login" ? "Signing in..." : "Creating account..."}
                  </>
                ) : mode === "login" ? (
                  "Log In"
                ) : (
                  "Create Account"
                )}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                variant="outline"
                type="button"
                onClick={() => void handleGoogleAuth()}
                disabled={loading}
              >
                <Chrome className="mr-2 h-4 w-4" />
                {mode === "login" ? "Google" : "Google"}
              </Button>
            </CardContent>
          </form>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground text-center">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => onModeChange("signup")}
                    className="text-accent hover:underline font-medium"
                    type="button"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    onClick={() => onModeChange("login")}
                    className="text-accent hover:underline font-medium"
                    type="button"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
      {newUserUid && (
        <FirstTimeProfileModal
          open={showProfileModal}
          onOpenChange={setShowProfileModal}
          uid={newUserUid}
          initialName={newUserName}
          onComplete={() => {
            setNewUserUid(null)
            setNewUserName(null)
            router.push("/dashboard")
            router.refresh()
          }}
        />
      )}
    </Dialog>
  )
}
