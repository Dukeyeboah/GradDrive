"use client"

import { useState, useEffect } from "react"
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
import { Plus, GraduationCap, MoreVertical, Eye, Edit, Upload } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getCapDesigns, addCapDesign, updateCapDesign, type Poster } from "@/lib/firebase/firestore"
import { uploadImage } from "@/lib/firebase/storage"
import { addSystemLog } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"

export default function AdminCapDesignsPage() {
  const { user, userData } = useAuth()
  const { toast } = useToast()
  const [designs, setDesigns] = useState<Poster[]>([])
  const [loading, setLoading] = useState(true)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<Poster | null>(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    shopifyLink: "",
    imageUrl: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    loadDesigns()
  }, [])

  const loadDesigns = async () => {
    try {
      setLoading(true)
      const allDesigns = await getCapDesigns()
      setDesigns(allDesigns)
    } catch (error) {
      console.error("Error loading cap designs:", error)
      toast({
        title: 'Error',
        description: 'Failed to load cap designs',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddDesign = async () => {
    if (!user || !userData) {
      toast({
        title: 'Error',
        description: 'You must be logged in to upload cap designs',
        variant: 'destructive',
      })
      return
    }

    if (!imageFile) {
      toast({
        title: 'Error',
        description: 'Please upload an image',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      // Upload image to Firebase Storage
      const { url, error: uploadError } = await uploadImage(imageFile, "cap-designs")
      if (uploadError || !url) {
        toast({
          title: 'Upload Error',
          description: uploadError || 'Failed to upload image',
          variant: 'destructive',
        })
        setUploading(false)
        return
      }

      // Save cap design data to Firestore (remove undefined values)
      const designData: any = {
        name: formData.name,
        description: formData.description,
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        imageUrl: url,
        uploadedBy: user.uid,
        uploadedByName: userData.displayName || user.email || "Unknown",
      }
      
      // Only include optional fields if they have values
      if (formData.shopifyLink && formData.shopifyLink.trim()) {
        designData.shopifyLink = formData.shopifyLink.trim()
      }

      const designId = await addCapDesign(designData)
      if (designId) {
        // Log the action
        await addSystemLog(
          "Cap design uploaded",
          "cap-design",
          user.uid,
          userData.displayName || user.email || "Unknown",
          userData.email || "",
          { designId, designName: formData.name }
        )

        toast({
          title: 'Success',
          description: 'Cap design uploaded successfully!',
        })
        setAddModalOpen(false)
        resetForm()
        loadDesigns()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to save cap design',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error("Error adding cap design:", error)
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEditDesign = async () => {
    if (!selectedDesign || !user || !userData) return

    setUploading(true)
    try {
      let imageUrl = selectedDesign.imageUrl

      // Upload new image if one was selected
      if (imageFile) {
        const { url, error: uploadError } = await uploadImage(imageFile, "cap-designs")
        if (uploadError || !url) {
          toast({
            title: 'Upload Error',
            description: uploadError || 'Failed to upload image',
            variant: 'destructive',
          })
          setUploading(false)
          return
        }
        imageUrl = url
      }

      // Update cap design in Firestore (remove undefined values)
      const updateData: any = {
        name: formData.name,
        description: formData.description,
        category: "Cap Designs",
        tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
        imageUrl,
      }
      
      // Only include optional fields if they have values
      if (formData.shopifyLink && formData.shopifyLink.trim()) {
        updateData.shopifyLink = formData.shopifyLink.trim()
      }

      const success = await updateCapDesign(selectedDesign.id!, updateData)
      if (success) {
        // Log the action
        await addSystemLog(
          "Cap design updated",
          "cap-design",
          user.uid,
          userData.displayName || user.email || "Unknown",
          userData.email || "",
          { designId: selectedDesign.id, designName: formData.name }
        )

        toast({
          title: 'Success',
          description: 'Cap design updated successfully!',
        })
        setEditModalOpen(false)
        setSelectedDesign(null)
        resetForm()
        loadDesigns()
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update cap design',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      console.error("Error updating cap design:", error)
      toast({
        title: 'Error',
        description: error.message || 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      tags: "",
      shopifyLink: "",
      imageUrl: "",
    })
    setImageFile(null)
    setImagePreview(null)
  }

  const openViewModal = (design: Poster) => {
    setSelectedDesign(design)
    setViewModalOpen(true)
  }

  const openEditModal = (design: Poster) => {
    setSelectedDesign(design)
    setFormData({
      name: design.name,
      description: design.description,
      category: design.category || "",
      tags: design.tags?.join(", ") || "",
      shopifyLink: design.shopifyLink || "",
      imageUrl: design.imageUrl || "",
    })
    setImagePreview(design.imageUrl || null)
    setImageFile(null)
    setEditModalOpen(true)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading cap designs...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">Cap Design Management</h1>
          <p className="text-muted-foreground">Upload and manage graduation cap designs</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Upload Cap Design
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {designs.map((design) => (
          <Card key={design.id} className="border-border bg-card shadow-sm overflow-hidden">
            {design.imageUrl ? (
              <div className="w-full h-64 relative overflow-hidden">
                <img 
                  src={design.imageUrl} 
                  alt={design.name}
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
                      <DropdownMenuItem onClick={() => openViewModal(design)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(design)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 relative bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <GraduationCap className="h-16 w-16 text-white/50" />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewModal(design)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(design)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-base">{design.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Add Cap Design Modal - Similar structure to posters modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New Cap Design</DialogTitle>
            <DialogDescription>Add a new graduation cap design to the library</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Design Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Kente Pattern Cap Design"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the cap design"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated, optional)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Kente, Traditional, Modern"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopifyLink">Shopify Link (optional)</Label>
              <Input
                id="shopifyLink"
                type="url"
                value={formData.shopifyLink}
                onChange={(e) => setFormData({ ...formData, shopifyLink: e.target.value })}
                placeholder="https://your-shop.myshopify.com/products/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Cap Design Image</Label>
              <div className="flex flex-col gap-2">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Click to upload image</span>
                  </div>
                  <input 
                    id="image-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleImageChange}
                  />
                </label>
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
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setAddModalOpen(false); resetForm() }} disabled={uploading}>
                Cancel
              </Button>
              <Button onClick={handleAddDesign} disabled={uploading || !imageFile}>
                {uploading ? "Uploading..." : "Upload Cap Design"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View and Edit modals similar to posters - I'll create simplified versions */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cap Design Details</DialogTitle>
          </DialogHeader>
          {selectedDesign && (
            <div className="space-y-4">
              {selectedDesign.imageUrl && (
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <img src={selectedDesign.imageUrl} alt={selectedDesign.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-lg font-semibold mt-1">{selectedDesign.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedDesign.description}</p>
                </div>
                {selectedDesign.shopifyLink && (
                  <div>
                    <Label className="text-sm font-medium">Shopify Link</Label>
                    <a href={selectedDesign.shopifyLink} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline mt-1 block">
                      {selectedDesign.shopifyLink}
                    </a>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setViewModalOpen(false)}>Close</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Cap Design</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Design Name</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input id="edit-tags" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-shopifyLink">Shopify Link</Label>
              <Input id="edit-shopifyLink" type="url" value={formData.shopifyLink} onChange={(e) => setFormData({ ...formData, shopifyLink: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Update Image (optional)</Label>
              <label htmlFor="edit-image-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Click to upload new image</span>
                </div>
                <input id="edit-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-border mt-2" />}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditModalOpen(false); setSelectedDesign(null); resetForm() }} disabled={uploading}>Cancel</Button>
              <Button onClick={handleEditDesign} disabled={uploading}>{uploading ? "Saving..." : "Save Changes"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

