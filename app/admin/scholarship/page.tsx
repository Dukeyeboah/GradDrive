import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminScholarshipPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl">Scholarship Program</h1>
        <p className="text-muted-foreground">Edit scholarship details and manage applications</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
          <CardDescription>Update scholarship program information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Program Title</Label>
            <Input id="title" defaultValue="Ghana Culture Scholarship Tour" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              defaultValue="An immersive cultural experience celebrating your graduation"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Max Participants</Label>
              <Input id="participants" type="number" defaultValue="20" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="locations">Locations</Label>
            <Input id="locations" defaultValue="Accra, Kumasi, Cape Coast" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Manage incoming applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">Pending Applications</p>
                <p className="text-sm text-muted-foreground">Applications awaiting review</p>
              </div>
              <span className="font-bold text-2xl">24</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-medium">Approved Applications</p>
                <p className="text-sm text-muted-foreground">Accepted for next tour</p>
              </div>
              <span className="font-bold text-2xl">12</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium">Total Applicants</p>
                <p className="text-sm text-muted-foreground">All-time applications</p>
              </div>
              <span className="font-bold text-2xl">156</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
