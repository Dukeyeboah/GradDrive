"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ADMIN_PASSKEY } from "@/lib/config/admin"
import { useToast } from "@/hooks/use-toast"

interface AdminPasskeyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified: () => void
  mode: "login" | "signup"
}

export function AdminPasskeyModal({ open, onOpenChange, onVerified, mode }: AdminPasskeyModalProps) {
  const [passkey, setPasskey] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passkey !== ADMIN_PASSKEY) {
      toast({
        title: "Invalid Passkey",
        description: "The admin passkey is incorrect.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // Store passkey in sessionStorage for this session
    if (typeof window !== "undefined") {
      sessionStorage.setItem("adminPasskeyVerified", "true")
    }
    
    setTimeout(() => {
      setLoading(false)
      onVerified()
      onOpenChange(false)
    }, 300)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Image
              src="/images/logo.png"
              alt=""
              width={44}
              height={44}
              className="h-9 w-9 sm:h-10 sm:w-10 object-contain"
            />
            <Image
              src="/images/graddrive.png"
              alt="Grad Drive"
              width={160}
              height={40}
              className="h-7 sm:h-8 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left"
            />
          </div>
          <DialogHeader className="text-center sm:text-center space-y-2">
            <DialogTitle>Admin Access Required</DialogTitle>
            <DialogDescription>
              Please enter the admin passkey to {mode === "login" ? "sign in" : "create an account"}
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleVerify} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="passkey">Admin Passkey</Label>
            <Input
              id="passkey"
              type="password"
              placeholder="Enter admin passkey"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Required for admin access
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                router.push("/")
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

