import { EmptyState } from "@/components/empty-state"
import { History } from "lucide-react"

export default function KenteHistoryPage() {
  return (
    <div className="flex w-full flex-col items-center justify-start pb-8 pt-4">
      <div className="container max-w-4xl space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">Kente & Graduation History</h1>
          <p className="text-balance text-sm text-muted-foreground">Learn about Kente traditions and graduation history</p>
        </div>

        <EmptyState
          icon={History}
          title="Educational content coming soon"
          description="We're preparing comprehensive educational materials about the rich history of Kente cloth and graduation traditions. Check back soon for engaging content that celebrates our cultural heritage!"
        />
      </div>
    </div>
  )
}

