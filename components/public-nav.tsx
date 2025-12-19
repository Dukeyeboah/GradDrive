import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function PublicNav() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="font-bold text-primary-foreground text-lg">GD</span>
          </div>
          <span className="font-bold text-xl text-foreground">Grad Drive</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
