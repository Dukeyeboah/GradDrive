import { EmptyState } from "@/components/empty-state"
import { History } from "lucide-react"

export default function KenteHistoryPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full py-12">
      <div className="container max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl md:text-4xl text-balance">Kente & Graduation History</h1>
          <p className="text-lg text-muted-foreground text-balance">Learn about Kente traditions and graduation history</p>
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

