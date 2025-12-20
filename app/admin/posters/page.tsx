"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Plus, FileImage, MoreVertical, Eye, Edit, Upload, Download } from "lucide-react"

interface Poster {
  id: number
  name: string
  description: string
  type: string
  format: string
  downloads: number
  uploaded: string
  category?: string
  tags?: string[]
  imageUrl?: string
}

export default function AdminPostersPage() {
  const [posters, setPosters] = useState<Poster[]>([
    { 
      id: 1, 
      name: "Celebration Poster", 
      description: "Beautiful graduation celebration poster design",
      type: "Poster", 
      format: "PNG", 
      downloads: 1247, 
      uploaded: "Jan 10, 2024",
      category: "Posters",
      tags: ["Graduation", "Celebration"],
      imageUrl: undefined
    },
    { 
      id: 2, 
      name: "Kente Pattern Cap", 
      description: "Traditional Kente-inspired graduation cap decoration",
      type: "Cap Design", 
      format: "PDF", 
      downloads: 892, 
      uploaded: "Jan 12, 2024",
      category: "Cap Designs",
      tags: ["Kente", "Traditional"]
    },
    { 
      id: 3, 
      name: "Achievement Certificate", 
      description: "Customizable achievement certificate template",
      type: "Certificate", 
      format: "PDF", 
      downloads: 1589, 
      uploaded: "Jan 14, 2024",
      category: "Certificates",
      tags: ["Certificate", "Achievement"]
    },
    { 
      id: 4, 
      name: "Thank You Cards", 
      description: "Set of elegant thank you card templates",
      type: "Cards", 
      format: "PNG", 
      downloads: 734, 
      uploaded: "Jan 16, 2024",
      category: "Cards",
      tags: ["Thank You", "Cards"]
    },
    { 
      id: 5, 
      name: "Social Media Graphics", 
      description: "Announcement graphics for social platforms",
      type: "Graphics", 
      format: "PNG", 
      downloads: 1156, 
      uploaded: "Jan 18, 2024",
      category: "Graphics",
      tags: ["Social Media", "Graphics"]
    },
  ])

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    format: "",
    category: "",
    tags: "",
    imageUrl: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleAddPoster = () => {
    const newPoster: Poster = {
      id: posters.length + 1,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      format: formData.format,
      downloads: 0,
      uploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: formData.category,
      tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
      imageUrl: imagePreview || undefined,
    }
    setPosters([...posters, newPoster])
    setAddModalOpen(false)
    resetForm()
    setImagePreview(null)
  }

  const handleEditPoster = () => {
    if (!selectedPoster) return
    setPosters(posters.map(p => 
      p.id === selectedPoster.id 
        ? { 
            ...p, 
            ...formData, 
            tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
            category: formData.category || p.category,
            imageUrl: imagePreview || p.imageUrl
          }
        : p
    ))
    setEditModalOpen(false)
    setSelectedPoster(null)
    resetForm()
    setImagePreview(null)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "",
      format: "",
      category: "",
      tags: "",
      imageUrl: "",
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setFormData({ ...formData, imageUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const openViewModal = (poster: Poster) => {
    setSelectedPoster(poster)
    setViewModalOpen(true)
  }

  const openEditModal = (poster: Poster) => {
    setSelectedPoster(poster)
    setFormData({
      name: poster.name,
      description: poster.description,
      type: poster.type,
      format: poster.format,
      category: poster.category || "",
      tags: poster.tags?.join(", ") || "",
      imageUrl: poster.imageUrl || "",
    })
    setImagePreview(poster.imageUrl || null)
    setEditModalOpen(true)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">Poster Management</h1>
          <p className="text-muted-foreground">Upload and manage digital assets</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Upload Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posters.map((poster) => (
          <Card key={poster.id} className="border-border bg-card shadow-sm overflow-hidden">
            {poster.imageUrl ? (
              <div className="w-full h-64 relative overflow-hidden">
                <img 
                  src={poster.imageUrl} 
                  alt={poster.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewModal(poster)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(poster)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 relative bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <FileImage className="h-16 w-16 text-white/50" />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewModal(poster)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(poster)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-base">{poster.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{poster.type}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Downloads</span>
                <span className="font-medium">{poster.downloads}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploaded</span>
                <span className="font-medium">{poster.uploaded}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Poster Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Asset</DialogTitle>
            <DialogDescription>Add a new poster or digital asset to the library</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Celebration Poster"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the asset"
                rows={3}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g., Poster, Cap Design"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="format">Format</Label>
                <Input
                  id="format"
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  placeholder="e.g., PNG, PDF"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Posters, Cap Designs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Graduation, Celebration, Kente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Upload Asset File</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="image" 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="flex-1" 
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setAddModalOpen(false); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleAddPoster}>Upload Asset</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Details</DialogTitle>
            <DialogDescription>Complete information about the asset</DialogDescription>
          </DialogHeader>
          {selectedPoster && (
            <div className="space-y-4">
              {selectedPoster.imageUrl ? (
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <img 
                    src={selectedPoster.imageUrl} 
                    alt={selectedPoster.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                  <FileImage className="h-16 w-16 text-white/50" />
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{selectedPoster.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{selectedPoster.type}</span>
                    <span>•</span>
                    <span>{selectedPoster.format}</span>
                    {selectedPoster.category && (
                      <>
                        <span>•</span>
                        <span>{selectedPoster.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedPoster.description}</p>
                </div>
                {selectedPoster.tags && selectedPoster.tags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {selectedPoster.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded-md bg-muted">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Downloads</Label>
                    <div className="flex items-center gap-1 mt-1">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold">{selectedPoster.downloads}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Uploaded</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedPoster.uploaded}</p>
                  </div>
                </div>
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

      {/* Edit Poster Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
            <DialogDescription>Update asset information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Asset Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Input
                  id="edit-type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-format">Format</Label>
                <Input
                  id="edit-format"
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
            <div className="space-y-2">
              <Label htmlFor="edit-file">Update Asset File</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="edit-file" 
                  type="file" 
                  accept="image/*,.pdf" 
                  className="flex-1" 
                  onChange={handleImageChange}
                />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditModalOpen(false); setSelectedPoster(null); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleEditPoster}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
