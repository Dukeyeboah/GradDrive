import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Calendar, MapPin, Users, CheckCircle } from "lucide-react"

export default function ScholarshipPage() {
  const benefits = [
    "Round-trip airfare to Ghana",
    "Accommodation for 10 days",
    "Guided cultural tours",
    "Traditional ceremony participation",
    "Local artisan workshops",
    "Historical site visits",
  ]

  return (
    <div className="container py-12 space-y-8 max-w-4xl">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl text-balance">Ghana Culture Scholarship Tour</h1>
        <p className="text-lg text-muted-foreground text-balance">
          An immersive cultural experience celebrating your graduation
        </p>
      </div>

      {/* Hero Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <div className="flex h-48 w-full items-center justify-center rounded-lg bg-accent/10 mb-4">
            <Award className="h-24 w-24 text-accent" />
          </div>
          <CardTitle className="text-2xl">Celebrate Your Achievement in Ghana</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Experience the rich culture and heritage of Ghana through our exclusive scholarship program. Connect with
            your roots, learn traditional practices, and create unforgettable memories.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Program Details */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <Calendar className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="text-lg">Duration</CardTitle>
            <CardDescription>10-day immersive experience</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <MapPin className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="text-lg">Locations</CardTitle>
            <CardDescription>Accra, Kumasi, Cape Coast</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <Users className="h-8 w-8 text-accent mb-2" />
            <CardTitle className="text-lg">Group Size</CardTitle>
            <CardDescription>Maximum 20 participants</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* What's Included */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">What's Included</CardTitle>
          <CardDescription>Everything you need for an unforgettable journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application */}
      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl">Ready to Apply?</CardTitle>
          <CardDescription>
            Applications open quarterly. Submit your interest to be notified when the next cycle begins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button size="lg" className="w-full gap-2">
            <Award className="h-5 w-5" />
            Submit Interest Form
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
