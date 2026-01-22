import { EmptyState } from "@/components/empty-state"
import { Users } from "lucide-react"

export default function AlumClubPage() {
  return (
    <div className="flex flex-col justify-center items-center w-full py-12">
      <div className="container max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl md:text-4xl text-balance">HoS Alumni Club</h1>
          <p className="text-lg text-muted-foreground text-balance">Connect with alumni and join exclusive community events</p>
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

