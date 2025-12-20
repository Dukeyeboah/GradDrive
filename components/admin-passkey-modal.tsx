"use client"

import { useState } from "react"
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
        <DialogHeader>
          <DialogTitle>Admin Access Required</DialogTitle>
          <DialogDescription>
            Please enter the admin passkey to {mode === "login" ? "sign in" : "create an account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleVerify} className="space-y-4">
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

