"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, MoreVertical, Eye, Edit, Upload, MapPin, DollarSign, Star, Tag } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Photographer {
  id: number
  name: string
  location: string
  description: string
  style: string
  tags: string[]
  price: number
  rating: number
  reviews: number
  verified: boolean
  listings: number
  email?: string
  phone?: string
  image?: string
}

export default function AdminPhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([
    { 
      id: 1, 
      name: "Kwame Photography", 
      location: "Accra, Ghana",
      description: "Specializing in graduation ceremonies and portrait photography",
      style: "Events & Ceremonies",
      tags: ["Graduation", "Portraits", "Events"],
      price: 250,
      rating: 4.9,
      reviews: 127,
      verified: true, 
      listings: 12,
      email: "kwame@photography.com",
      phone: "+233 24 123 4567"
    },
    { 
      id: 2, 
      name: "Ama Visual Arts", 
      location: "Kumasi, Ghana",
      description: "Professional event photography with artistic flair",
      style: "Event Photography",
      tags: ["Events", "Artistic", "Professional"],
      price: 300,
      rating: 4.8,
      reviews: 94,
      verified: true, 
      listings: 8,
      email: "ama@visualarts.com",
      phone: "+233 24 234 5678"
    },
    { 
      id: 3, 
      name: "Kofi Studios", 
      location: "Takoradi, Ghana",
      description: "Creative portrait photography",
      style: "Creative Portraits",
      tags: ["Portraits", "Creative", "Studio"],
      price: 200,
      rating: 4.7,
      reviews: 68,
      verified: true, 
      listings: 15,
      email: "kofi@studios.com",
      phone: "+233 24 345 6789"
    },
    { 
      id: 4, 
      name: "Yaa Lens", 
      location: "Accra, Ghana",
      description: "Expert in graduation ceremonies",
      style: "Graduation Ceremonies",
      tags: ["Graduation", "Ceremonies", "Cultural"],
      price: 280,
      rating: 5.0,
      reviews: 152,
      verified: false, 
      listings: 6,
      email: "yaa@lens.com",
      phone: "+233 24 456 7890"
    },
    { 
      id: 5, 
      name: "Nana Captures", 
      location: "Cape Coast, Ghana",
      description: "Lifestyle and event photography",
      style: "Lifestyle & Events",
      tags: ["Lifestyle", "Events", "Storytelling"],
      price: 220,
      rating: 4.6,
      reviews: 81,
      verified: true, 
      listings: 10,
      email: "nana@captures.com",
      phone: "+233 24 567 8901"
    },
  ])

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    style: "",
    tags: "",
    price: "",
    email: "",
    phone: "",
    verified: false,
  })

  const handleAddPhotographer = () => {
    const newPhotographer: Photographer = {
      id: photographers.length + 1,
      name: formData.name,
      location: formData.location,
      description: formData.description,
      style: formData.style,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      price: parseFloat(formData.price) || 0,
      rating: 0,
      reviews: 0,
      verified: formData.verified,
      listings: 0,
      email: formData.email,
      phone: formData.phone,
    }
    setPhotographers([...photographers, newPhotographer])
    setAddModalOpen(false)
    resetForm()
  }

  const handleEditPhotographer = () => {
    if (!selectedPhotographer) return
    setPhotographers(photographers.map(p => 
      p.id === selectedPhotographer.id 
        ? { ...p, ...formData, tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean), price: parseFloat(formData.price) || p.price }
        : p
    ))
    setEditModalOpen(false)
    setSelectedPhotographer(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      description: "",
      style: "",
      tags: "",
      price: "",
      email: "",
      phone: "",
      verified: false,
    })
  }

  const openViewModal = (photographer: Photographer) => {
    setSelectedPhotographer(photographer)
    setViewModalOpen(true)
  }

  const openEditModal = (photographer: Photographer) => {
    setSelectedPhotographer(photographer)
    setFormData({
      name: photographer.name,
      location: photographer.location,
      description: photographer.description,
      style: photographer.style,
      tags: photographer.tags.join(", "),
      price: photographer.price.toString(),
      email: photographer.email || "",
      phone: photographer.phone || "",
      verified: photographer.verified,
    })
    setEditModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">Photographer Network</h1>
          <p className="text-muted-foreground">Manage photographers and their profiles</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Photographer
        </Button>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>All Photographers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Listings</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {photographers.map((photographer) => (
                <TableRow key={photographer.id}>
                  <TableCell className="font-medium">{photographer.name}</TableCell>
                  <TableCell>{photographer.location}</TableCell>
                  <TableCell>
                    <Badge variant={photographer.verified ? "default" : "secondary"}>
                      {photographer.verified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{photographer.listings}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openViewModal(photographer)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditModal(photographer)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Photographer Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Photographer</DialogTitle>
            <DialogDescription>Fill in the details to add a new photographer to the network</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Photographer name"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Input
                  id="style"
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                  placeholder="e.g., Events & Ceremonies"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the photographer's style and specialties"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Graduation, Portraits, Events"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="photographer@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+233 24 123 4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="flex items-center gap-2">
                <Input id="image" type="file" accept="image/*" className="flex-1" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="verified" className="cursor-pointer">Verified Photographer</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setAddModalOpen(false); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleAddPhotographer}>Add Photographer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Photographer Details</DialogTitle>
            <DialogDescription>Complete information about the photographer</DialogDescription>
          </DialogHeader>
          {selectedPhotographer && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600">
                  <span className="text-white text-2xl font-bold">
                    {selectedPhotographer.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{selectedPhotographer.name}</h3>
                    {selectedPhotographer.verified && (
                      <Badge variant="default">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-3 w-3" />
                    {selectedPhotographer.location}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{selectedPhotographer.rating}</span>
                    <span className="text-muted-foreground">({selectedPhotographer.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPhotographer.description}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Style</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPhotographer.style}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {selectedPhotographer.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Price</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">${selectedPhotographer.price}</span>
                      <span className="text-sm text-muted-foreground">/session</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Listings</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPhotographer.listings} active listings</p>
                  </div>
                </div>
                {selectedPhotographer.email && (
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPhotographer.email}</p>
                  </div>
                )}
                {selectedPhotographer.phone && (
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPhotographer.phone}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Photographer Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Photographer</DialogTitle>
            <DialogDescription>Update photographer information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-style">Style</Label>
                <Input
                  id="edit-style"
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Update Image</Label>
              <div className="flex items-center gap-2">
                <Input id="edit-image" type="file" accept="image/*" className="flex-1" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-verified"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-verified" className="cursor-pointer">Verified Photographer</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditModalOpen(false); setSelectedPhotographer(null); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleEditPhotographer}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
