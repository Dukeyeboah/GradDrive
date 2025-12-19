import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus } from "lucide-react"

export default function AdminEbooksPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">E-book Management</h1>
          <p className="text-muted-foreground">Upload and update e-book resources</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Upload E-book
        </Button>
      </div>

      <EmptyState
        icon={BookOpen}
        title="E-book management coming soon"
        description="Interface for uploading and managing e-books will be available here."
      />
    </div>
  )
}
