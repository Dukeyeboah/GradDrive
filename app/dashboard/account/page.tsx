import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Calendar } from "lucide-react"

export default function AccountPage() {
  return (
    <div className="container py-12 space-y-8 max-w-3xl">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl text-balance">My Account</h1>
        <p className="text-lg text-muted-foreground text-balance">Manage your profile and access information</p>
      </div>

      {/* Profile Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
              <User className="h-8 w-8 text-accent" />
            </div>
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="you@example.com" defaultValue="john@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <Input id="institution" placeholder="University of Ghana" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="graduation">Graduation Year</Label>
            <Input id="graduation" placeholder="2024" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <Mail className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="text-lg">Member Since</CardTitle>
            <CardDescription>January 2024</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <Calendar className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="text-lg">Account Status</CardTitle>
            <CardDescription>Active Member</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Access Information */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Access Summary</CardTitle>
          <CardDescription>Your available perks and resources</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Full access to digital asset library</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>E-book downloads available</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Photographer network access</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent" />
              <span>Scholarship program eligibility</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
