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
    <div className="flex flex-col justify-center items-center w-full py-12">
      <div className="container max-w-4xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl md:text-4xl text-balance">Ghana Culture Scholarship Tour</h1>
          <p className="text-lg text-muted-foreground text-balance">
            An immersive cultural experience celebrating your graduation
          </p>
        </div>

        {/* Hero Card */}
        <Card className="border-border bg-card shadow-sm">
          <CardHeader>
            <div className="flex h-48 w-full items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 mb-4">
              <Award className="h-24 w-24 text-white" />
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 mb-2">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Duration</CardTitle>
              <CardDescription>10-day immersive experience</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 mb-2">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">Locations</CardTitle>
              <CardDescription>Accra, Kumasi, Cape Coast</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 mb-2">
                <Users className="h-5 w-5 text-white" />
              </div>
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
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-white" />
                  </div>
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
    </div>
  )
}
