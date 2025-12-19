import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreVertical } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminPhotographersPage() {
  const photographers = [
    { id: 1, name: "Kwame Photography", location: "Accra", verified: true, listings: 12 },
    { id: 2, name: "Ama Visual Arts", location: "Kumasi", verified: true, listings: 8 },
    { id: 3, name: "Kofi Studios", location: "Takoradi", verified: true, listings: 15 },
    { id: 4, name: "Yaa Lens", location: "Accra", verified: false, listings: 6 },
    { id: 5, name: "Nana Captures", location: "Cape Coast", verified: true, listings: 10 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">Photographer Network</h1>
          <p className="text-muted-foreground">Manage photographers and their profiles</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Photographer
        </Button>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>All Photographers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photographers.map((photographer) => (
                <TableRow key={photographer.id}>
                  <TableCell className="font-medium">{photographer.name}</TableCell>
                  <TableCell>{photographer.location}</TableCell>
                  <TableCell>
                    <Badge variant={photographer.verified ? "default" : "secondary"}>
                      {photographer.verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{photographer.listings}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
