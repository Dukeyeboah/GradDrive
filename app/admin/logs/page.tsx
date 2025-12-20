import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText } from "lucide-react"

export default function AdminLogsPage() {
  const logs = [
    { id: 1, type: "info", message: "User registration completed", user: "john@example.com", admin: null, timestamp: "2024-01-15 10:30:45" },
    { id: 2, type: "warning", message: "Failed login attempt", user: "unknown", admin: null, timestamp: "2024-01-15 10:25:12" },
    { id: 3, type: "info", message: "Asset downloaded", user: "jane@example.com", admin: null, timestamp: "2024-01-15 10:20:33" },
    { id: 4, type: "error", message: "Database connection timeout", user: "system", admin: null, timestamp: "2024-01-15 10:15:08" },
    { id: 5, type: "info", message: "Photographer added", user: null, admin: "admin@graddrive.com", timestamp: "2024-01-15 10:10:22" },
    { id: 6, type: "info", message: "E-book uploaded", user: null, admin: "admin@graddrive.com", timestamp: "2024-01-15 10:05:15" },
    { id: 7, type: "info", message: "Poster asset updated", user: null, admin: "superadmin@graddrive.com", timestamp: "2024-01-15 10:00:05" },
    { id: 8, type: "info", message: "User account suspended", user: "spam@example.com", admin: "admin@graddrive.com", timestamp: "2024-01-15 09:55:30" },
  ]

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl">System Logs</h1>
        <p className="text-muted-foreground">View system activity and logs</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Activity Logs</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getBadgeVariant(log.type)} className="text-xs">
                      {log.type}
                    </Badge>
                    <span className="text-sm font-medium">{log.message}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    {log.user && <span>User: {log.user}</span>}
                    {log.admin && <span>Admin: {log.admin}</span>}
                    {(log.user || log.admin) && <span>•</span>}
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

