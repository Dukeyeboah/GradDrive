import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Camera, FileImage, BookOpen, Download, UserCog, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminDashboardPage() {
  const stats = [
    { 
      label: "Total Grad Users", 
      value: "1,247", 
      icon: Users, 
      change: "+12% from last month",
      gradient: "from-blue-500 to-purple-600"
    },
    { 
      label: "Total Downloads", 
      value: "8,432", 
      icon: Download, 
      change: "+23% this month",
      gradient: "from-green-500 to-emerald-600"
    },
    { 
      label: "Total Admins", 
      value: "5", 
      icon: UserCog, 
      change: "2 active now",
      gradient: "from-amber-500 to-orange-600"
    },
    { 
      label: "Photographers Listed", 
      value: "89", 
      icon: Camera, 
      change: "+8 this month",
      gradient: "from-pink-500 to-rose-600"
    },
    { 
      label: "Posters Uploaded", 
      value: "156", 
      icon: FileImage, 
      change: "+23 this month",
      gradient: "from-violet-500 to-indigo-600"
    },
    { 
      label: "Cap Designs", 
      value: "42", 
      icon: GraduationCap, 
      change: "+5 this month",
      gradient: "from-cyan-500 to-blue-600"
    },
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="font-bold text-3xl md:text-4xl">Admin Overview</h1>
            <Badge variant="secondary" className="text-sm">Super Admin</Badge>
          </div>
          <p className="text-muted-foreground">Monitor and manage your Grad Drive platform</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border-border bg-card shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br", stat.gradient)}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
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

