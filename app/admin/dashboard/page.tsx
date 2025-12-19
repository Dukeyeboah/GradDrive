import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Camera, FileImage, BookOpen } from "lucide-react"

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "1,247", icon: Users, change: "+12% from last month" },
    { label: "Photographers", value: "89", icon: Camera, change: "+8 this month" },
    { label: "Digital Assets", value: "156", icon: FileImage, change: "+23 this month" },
    { label: "E-books", value: "12", icon: BookOpen, change: "3 coming soon" },
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl">Admin Overview</h1>
        <p className="text-muted-foreground">Monitor and manage your Grad Drive platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="font-bold text-2xl">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Recent User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>New user registration</span>
                <span className="text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>Asset downloaded</span>
                <span className="text-muted-foreground">3 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span>E-book accessed</span>
                <span className="text-muted-foreground">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Photographer contacted</span>
                <span className="text-muted-foreground">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>User Engagement</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-accent" style={{ width: "87%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Asset Downloads</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-accent" style={{ width: "92%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Photographer Connections</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-accent" style={{ width: "78%" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

