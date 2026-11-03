import { EmptyState } from "@/components/empty-state"
import { Users } from "lucide-react"

export default function AlumClubPage() {
  return (
    <div className="flex w-full flex-col items-center justify-start pb-8 pt-4">
      <div className="container max-w-4xl space-y-6">
        <div className="space-y-1.5 text-center">
          <h1 className="text-balance text-3xl font-bold md:text-4xl">HoS Alumni Club</h1>
          <p className="text-balance text-sm text-muted-foreground">Connect with alumni and join exclusive community events</p>
        </div>

        <EmptyState
          icon={Users}
          title="Exciting exclusive discounts coming soon"
          description="We're working on exclusive discounts and special offers for Grad Drive members. Check back soon for updates!"
        />
      </div>
    </div>
  )
}

