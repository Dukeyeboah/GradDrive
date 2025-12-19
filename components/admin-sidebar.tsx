"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Camera, FileImage, BookOpen, Award, Palette, Settings } from "lucide-react"

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/photographers", label: "Photographers", icon: Camera },
  { href: "/admin/posters", label: "Posters", icon: FileImage },
  { href: "/admin/ebooks", label: "E-books", icon: BookOpen },
  { href: "/admin/scholarship", label: "Scholarship", icon: Award },
  { href: "/admin/customizer", label: "Customizer", icon: Palette },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card">
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="font-bold text-primary-foreground text-lg">GD</span>
          </div>
          <div>
            <span className="font-bold text-lg block">Grad Drive</span>
            <span className="text-xs text-muted-foreground">Admin Portal</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
