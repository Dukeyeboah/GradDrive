import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileImage, MoreVertical } from "lucide-react"

export default function AdminPostersPage() {
  const posters = [
    { id: 1, name: "Celebration Poster", type: "PNG", downloads: 1247, uploaded: "Jan 10, 2024" },
    { id: 2, name: "Kente Pattern Cap", type: "PDF", downloads: 892, uploaded: "Jan 12, 2024" },
    { id: 3, name: "Achievement Certificate", type: "PDF", downloads: 1589, uploaded: "Jan 14, 2024" },
    { id: 4, name: "Thank You Cards", type: "PNG", downloads: 734, uploaded: "Jan 16, 2024" },
    { id: 5, name: "Social Media Graphics", type: "PNG", downloads: 1156, uploaded: "Jan 18, 2024" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">Poster Management</h1>
          <p className="text-muted-foreground">Upload and manage digital assets</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Upload Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posters.map((poster) => (
          <Card key={poster.id} className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <FileImage className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{poster.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{poster.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Downloads</span>
                <span className="font-medium">{poster.downloads}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploaded</span>
                <span className="font-medium">{poster.uploaded}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
