"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { User, Menu, ArrowLeft, GraduationCap, BookOpen, Camera, Award, Gift, Ticket } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

export function UserNav() {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const router = useRouter()
  const isDashboard = pathname === "/dashboard"
  const showBackButton = !isDashboard && pathname.startsWith("/dashboard")

  return (
    <nav className="flex justify-center items-center sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="font-bold text-primary-foreground text-lg">GD</span>
            </div>
            <span className="font-bold text-xl text-foreground">Grad Drive</span>
          </Link>

          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex flex-col gap-2 mt-8">
                  <Link href="/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/grad-drive">
                    <Button variant="ghost" className="w-full justify-start">
                      Digital Assets
                    </Button>
                  </Link>
                  <Link href="/dashboard/ebooks">
                    <Button variant="ghost" className="w-full justify-start">
                      E-books
                    </Button>
                  </Link>
                  <Link href="/dashboard/photographers">
                    <Button variant="ghost" className="w-full justify-start">
                      Photographers
                    </Button>
                  </Link>
                  <Link href="/dashboard/scholarship">
                    <Button variant="ghost" className="w-full justify-start">
                      Scholarship
                    </Button>
                  </Link>
                  <Link href="/dashboard/discounts">
                    <Button variant="ghost" className="w-full justify-start">
                      Discounts
                    </Button>
                  </Link>
                  <Link href="/dashboard/account">
                    <Button variant="ghost" className="w-full justify-start">
                      Account
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/grad-drive" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Digital Assets
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/ebooks" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  E-books
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/photographers" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Photographers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/scholarship" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Scholarship
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/discounts" className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  Discounts
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/account">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
