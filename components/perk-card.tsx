import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PerkCardProps {
  icon: LucideIcon
  title: string
  description: string
  href: string
  buttonText?: string
  gradient?: string
}

const getIconGradient = (title: string): string => {
  const titleLower = title.toLowerCase()
  if (titleLower.includes("digital") || titleLower.includes("asset")) {
    return "from-blue-500 to-purple-600"
  }
  if (titleLower.includes("book") || titleLower.includes("ebook")) {
    return "from-emerald-500 to-teal-600"
  }
  if (titleLower.includes("photographer") || titleLower.includes("camera")) {
    return "from-pink-500 to-rose-600"
  }
  if (titleLower.includes("scholarship") || titleLower.includes("award")) {
    return "from-amber-500 to-orange-600"
  }
  if (titleLower.includes("discount") || titleLower.includes("gift")) {
    return "from-violet-500 to-indigo-600"
  }
  if (titleLower.includes("account") || titleLower.includes("profile")) {
    return "from-cyan-500 to-blue-600"
  }
  return "from-blue-500 to-purple-600"
}

export function PerkCard({ icon: Icon, title, description, href, buttonText = "View", gradient }: PerkCardProps) {
  const defaultGradient = getIconGradient(title)
  const finalGradient = gradient || defaultGradient

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <CardHeader>
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br", finalGradient, "mb-2")}>
          <Icon className="h-6 w-6 text-white" />
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
