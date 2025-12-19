import { EmptyState } from "@/components/empty-state"
import { Gift } from "lucide-react"

export default function DiscountsPage() {
  return (
    <div className="container py-12">
      <div className="space-y-2 mb-8">
        <h1 className="font-bold text-3xl md:text-4xl text-balance">Exclusive Discounts</h1>
        <p className="text-lg text-muted-foreground text-balance">Special offers and future purchase benefits</p>
      </div>

      <EmptyState
        icon={Gift}
        title="Exciting offers coming soon"
        description="We're working on exclusive discounts and special offers for Grad Drive members. Check back soon for updates!"
      />
    </div>
  )
}
