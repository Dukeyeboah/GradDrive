import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Camera, MapPin, Star, Mail } from "lucide-react"

export default function PhotographersPage() {
  const photographers = [
    {
      id: 1,
      name: "Kwame Photography",
      location: "Accra, Ghana",
      specialty: "Graduation & Portraits",
      rating: 4.9,
      reviews: 127,
      verified: true,
    },
    {
      id: 2,
      name: "Ama Visual Arts",
      location: "Kumasi, Ghana",
      specialty: "Event Photography",
      rating: 4.8,
      reviews: 94,
      verified: true,
    },
    {
      id: 3,
      name: "Kofi Studios",
      location: "Takoradi, Ghana",
      specialty: "Creative Portraits",
      rating: 4.7,
      reviews: 68,
      verified: true,
    },
    {
      id: 4,
      name: "Yaa Lens",
      location: "Accra, Ghana",
      specialty: "Graduation Ceremonies",
      rating: 5.0,
      reviews: 152,
      verified: true,
    },
    {
      id: 5,
      name: "Nana Captures",
      location: "Cape Coast, Ghana",
      specialty: "Lifestyle & Events",
      rating: 4.6,
      reviews: 81,
      verified: true,
    },
    {
      id: 6,
      name: "Abena Photo Co.",
      location: "Tamale, Ghana",
      specialty: "Documentary Style",
      rating: 4.8,
      reviews: 103,
      verified: true,
    },
  ]

  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl text-balance">Photographer Network</h1>
        <p className="text-lg text-muted-foreground text-balance">
          Connect with verified photographers for your graduation day
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search by name or location..." className="sm:max-w-xs" />
        <Button variant="outline">
          <MapPin className="h-4 w-4 mr-2" />
          Filter by Location
        </Button>
      </div>

      {/* Photographer List */}
      <div className="grid gap-6 md:grid-cols-2">
        {photographers.map((photographer) => (
          <Card key={photographer.id} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Camera className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{photographer.name}</CardTitle>
                      {photographer.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {photographer.location}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{photographer.specialty}</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="font-semibold text-sm">{photographer.rating}</span>
                  <span className="text-sm text-muted-foreground">({photographer.reviews})</span>
                </div>
              </div>
              <Button className="w-full gap-2">
                <Mail className="h-4 w-4" />
                Contact Photographer
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
