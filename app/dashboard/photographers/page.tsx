import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Star, CheckCircle2 } from "lucide-react"

export default function PhotographersPage() {
  const photographers = [
    {
      id: 1,
      name: "Kwame Photography",
      location: "Accra, Ghana",
      description: "Specializing in graduation ceremonies and portrait photography with a focus on capturing authentic moments",
      style: "Events & Ceremonies",
      tags: ["Graduation", "Portraits", "Events"],
      price: 250,
      rating: 4.9,
      reviews: 127,
      verified: true,
      image: "/placeholder.jpg",
    },
    {
      id: 2,
      name: "Ama Visual Arts",
      location: "Kumasi, Ghana",
      description: "Professional event photography with artistic flair, perfect for memorable graduation celebrations",
      style: "Event Photography",
      tags: ["Events", "Artistic", "Professional"],
      price: 300,
      rating: 4.8,
      reviews: 94,
      verified: true,
      image: "/placeholder.jpg",
    },
    {
      id: 3,
      name: "Kofi Studios",
      location: "Takoradi, Ghana",
      description: "Creative portrait photography that captures your personality and graduation achievement beautifully",
      style: "Creative Portraits",
      tags: ["Portraits", "Creative", "Studio"],
      price: 200,
      rating: 4.7,
      reviews: 68,
      verified: true,
      image: "/placeholder.jpg",
    },
    {
      id: 4,
      name: "Yaa Lens",
      location: "Accra, Ghana",
      description: "Expert in graduation ceremonies with attention to detail and cultural significance",
      style: "Graduation Ceremonies",
      tags: ["Graduation", "Ceremonies", "Cultural"],
      price: 280,
      rating: 5.0,
      reviews: 152,
      verified: true,
      image: "/placeholder.jpg",
    },
    {
      id: 5,
      name: "Nana Captures",
      location: "Cape Coast, Ghana",
      description: "Lifestyle and event photography that tells your graduation story through beautiful imagery",
      style: "Lifestyle & Events",
      tags: ["Lifestyle", "Events", "Storytelling"],
      price: 220,
      rating: 4.6,
      reviews: 81,
      verified: true,
      image: "/placeholder.jpg",
    },
    {
      id: 6,
      name: "Abena Photo Co.",
      location: "Tamale, Ghana",
      description: "Documentary-style photography capturing authentic moments and cultural celebrations",
      style: "Documentary Style",
      tags: ["Documentary", "Cultural", "Authentic"],
      price: 240,
      rating: 4.8,
      reviews: 103,
      verified: true,
      image: "/placeholder.jpg",
    },
  ]

  return (
    <div className="flex flex-col justify-center items-center w-full py-12">
      <div className="container max-w-6xl space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="font-bold text-3xl md:text-4xl text-balance">Photographer Network</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Connect with verified photographers for your graduation day
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Input placeholder="Search by name or location..." className="sm:max-w-xs" />
          <Button variant="outline">
            <MapPin className="h-4 w-4 mr-2" />
            Filter by Location
          </Button>
        </div>

        {/* Photographer List */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {photographers.map((photographer) => (
            <Card key={photographer.id} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative h-48 w-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                {photographer.verified && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                )}
                <div className="text-white/20 text-6xl font-bold">PHOTO</div>
              </div>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{photographer.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-sm">{photographer.rating}</span>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {photographer.location}
                  </CardDescription>
                  <p className="text-sm text-muted-foreground leading-relaxed">{photographer.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{photographer.style}</Badge>
                    {photographer.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between pt-2 border-t">
                  <div>
                    <span className="text-2xl font-bold">${photographer.price}</span>
                    <span className="text-sm text-muted-foreground ml-1">/session</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({photographer.reviews} reviews)</span>
                </div>
                <Button className="w-full">
                  Select Photographer
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
