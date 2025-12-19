import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, MoreVertical } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", joined: "Jan 15, 2024" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Active", joined: "Jan 18, 2024" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", status: "Active", joined: "Jan 20, 2024" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", status: "Inactive", joined: "Jan 22, 2024" },
    { id: 5, name: "Michael Brown", email: "michael@example.com", status: "Active", joined: "Jan 25, 2024" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl">User Management</h1>
        <p className="text-muted-foreground">Manage Grad Drive users and their access</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.joined}</TableCell>
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
