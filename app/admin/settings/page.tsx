import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function AdminSettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
        <p className="text-muted-foreground">Configure platform settings and preferences</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>General platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="platform-name">Platform Name</Label>
            <Input id="platform-name" defaultValue="Grad Drive" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <Input id="support-email" type="email" defaultValue="support@graddrive.com" />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>User Registration</Label>
              <p className="text-sm text-muted-foreground">Allow new users to sign up</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Photographer Applications</Label>
              <p className="text-sm text-muted-foreground">Accept new photographer registrations</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Scholarship Applications</Label>
              <p className="text-sm text-muted-foreground">Accept scholarship tour applications</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>Save All Settings</Button>
      </div>
    </div>
  )
}
