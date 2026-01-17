"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Mail, Phone, Instagram, Globe } from "lucide-react"
import { getPhotographers, Photographer } from "@/lib/firebase/firestore"
import { Loader2 } from "lucide-react"

export default function PhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadPhotographers()
  }, [])

  const loadPhotographers = async () => {
    try {
      setLoading(true)
      // Only show photographers with status "interested-follow-up"
      const data = await getPhotographers("interested-follow-up")
      setPhotographers(data)
    } catch (error) {
      console.error("Error loading photographers:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPhotographerName = (photographer: Photographer) => {
    if (photographer.firstName && photographer.lastName) {
      return `${photographer.firstName} ${photographer.lastName}`
    }
    return photographer.firstName || photographer.name || "Unknown"
  }

  const getLocation = (photographer: Photographer) => {
    if (photographer.address && photographer.state) {
      return `${photographer.address}, ${photographer.state}`
    }
    return photographer.address || photographer.state || photographer.location || "Location not specified"
  }

  const filteredPhotographers = photographers.filter((photographer) => {
    if (!searchQuery) return true
    const name = getPhotographerName(photographer).toLowerCase()
    const location = getLocation(photographer).toLowerCase()
    const query = searchQuery.toLowerCase()
    return name.includes(query) || location.includes(query)
  })

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
          <Input 
            placeholder="Search by name or location..." 
            className="sm:max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Photographer List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPhotographers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No photographers found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPhotographers.map((photographer) => {
              const name = getPhotographerName(photographer)
              const location = getLocation(photographer)
              
              return (
                <Card key={photographer.id} className="border-border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  {/* Image placeholder - commented out as requested */}
                  {/* <div className="relative h-48 w-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <div className="text-white/20 text-6xl font-bold">PHOTO</div>
                  </div> */}
                  
                  <CardHeader>
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {location}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Contact Information */}
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-sm font-medium">Contact Information</p>
                      <div className="flex flex-wrap gap-2">
                        {/* Instagram - only show if instagramContact is true */}
                        {photographer.instagramContact && photographer.instagram && (
                          <a
                            href={photographer.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-pink-600 hover:text-pink-700"
                          >
                            <Instagram className="h-4 w-4" />
                            Instagram
                          </a>
                        )}
                        
                        {/* Email - only show if emailContact is true */}
                        {photographer.emailContact && photographer.email && (
                          <a
                            href={`mailto:${photographer.email}`}
                            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                          >
                            <Mail className="h-4 w-4" />
                            Email
                          </a>
                        )}
                        
                        {/* Phone - only show if phoneContact is true */}
                        {photographer.phoneContact && photographer.phone && (
                          <a
                            href={`tel:${photographer.phone}`}
                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-700"
                          >
                            <Phone className="h-4 w-4" />
                            Phone
                          </a>
                        )}
                        
                        {/* Show message if no contact methods available */}
                        {!photographer.instagramContact && !photographer.emailContact && !photographer.phoneContact && (
                          <span className="text-sm text-muted-foreground">Contact information not available</span>
                        )}
                      </div>
                      
                      {/* Website - always show if available */}
                      {photographer.website && (
                        <a
                          href={photographer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                        >
                          <Globe className="h-4 w-4" />
                          Website
                        </a>
                      )}
                    </div>
                    
                    <Button className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
