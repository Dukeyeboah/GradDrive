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

// Map each card to a unique soft pastel gradient
const getIconGradient = (title: string): string => {
  const titleLower = title.toLowerCase()
  if (titleLower.includes("photographer") || titleLower.includes("camera")) {
    return "from-pink-200 to-rose-300"
  }
  if (titleLower.includes("book") || titleLower.includes("ebook")) {
    return "from-emerald-200 to-teal-300"
  }
  if (titleLower.includes("digital") || titleLower.includes("asset") || titleLower.includes("poster")) {
    return "from-blue-200 to-purple-300"
  }
  if (titleLower.includes("cap") || titleLower.includes("graduation")) {
    return "from-violet-200 to-indigo-300"
  }
  if (titleLower.includes("alumni") || titleLower.includes("club") || titleLower.includes("users")) {
    return "from-cyan-200 to-blue-300"
  }
  if (titleLower.includes("history") || titleLower.includes("kente")) {
    return "from-amber-200 to-orange-300"
  }
  if (titleLower.includes("scholarship") || titleLower.includes("award")) {
    return "from-yellow-200 to-amber-300"
  }
  if (titleLower.includes("discount") || titleLower.includes("gift") || titleLower.includes("coming soon")) {
    return "from-purple-200 to-pink-300"
  }
  return "from-blue-200 to-purple-300"
}

export function PerkCard({ icon: Icon, title, description, href, buttonText = "View", gradient }: PerkCardProps) {
  const defaultGradient = getIconGradient(title)
  const finalGradient = gradient || defaultGradient

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col h-full">
      <CardHeader className="flex-1">
        <div className="flex items-center gap-3 mb-3">
          <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br flex-shrink-0", finalGradient)}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        </div>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 mt-auto">
        <Link href={href}>
          <Button variant="outline" className="w-full bg-transparent">
            {buttonText}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
