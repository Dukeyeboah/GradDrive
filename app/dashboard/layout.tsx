import type React from "react"
import { UserNav } from "@/components/user-nav"
import { PublicFooter } from "@/components/public-footer"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UserNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  )
}
