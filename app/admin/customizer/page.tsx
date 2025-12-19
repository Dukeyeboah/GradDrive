import { EmptyState } from "@/components/empty-state"
import { Palette } from "lucide-react"

export default function AdminCustomizerPage() {
  return (
    <div className="p-6">
      <div className="space-y-2 mb-8">
        <h1 className="font-bold text-3xl md:text-4xl">Customizer Dashboard</h1>
        <p className="text-muted-foreground">Entry point to photographer customization tools</p>
      </div>

      <EmptyState
        icon={Palette}
        title="Customizer coming soon"
        description="Advanced customization tools for the photographer network app will be available here."
      />
    </div>
  )
}
