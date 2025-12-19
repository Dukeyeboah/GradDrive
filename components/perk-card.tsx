import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

interface PerkCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  buttonText?: string
}

export function PerkCard({ icon: Icon, title, description, href, buttonText = "View" }: PerkCardProps) {
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <CardHeader>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 mb-2">
          <Icon className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Link href={href}>
          <Button variant="outline" className="w-full bg-transparent">
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
