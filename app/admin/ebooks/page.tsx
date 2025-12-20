"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { EmptyState } from "@/components/empty-state"
import { Plus, BookOpen, MoreVertical, Eye, Edit, Upload, Download, FileText } from "lucide-react"

interface Ebook {
  id: number
  title: string
  author: string
  description: string
  pages: number
  available: boolean
  uploaded?: string
  downloads?: number
  category?: string
  isbn?: string
  thumbnailUrl?: string
}

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([
    {
      id: 1,
      title: "After-Grad Kit",
      author: "Grad Drive Team",
      description: "Complete guide to navigating life after graduation, including career planning, financial tips, and personal development strategies.",
      pages: 120,
      available: true,
      uploaded: "Jan 5, 2024",
      downloads: 2341,
      category: "Career Guide",
      isbn: "978-0-123456-78-9"
    },
    {
      id: 2,
      title: "Career Launch Blueprint",
      author: "Coming Soon",
      description: "Strategic guide to launching your professional career with confidence and clarity.",
      pages: 85,
      available: false,
      category: "Career Guide"
    },
    {
      id: 3,
      title: "Financial Freedom Fundamentals",
      author: "Coming Soon",
      description: "Essential financial literacy for young professionals starting their journey.",
      pages: 95,
      available: false,
      category: "Finance"
    },
  ])

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    pages: "",
    available: true,
    category: "",
    isbn: "",
    thumbnailUrl: "",
  })
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  const handleAddEbook = () => {
    const newEbook: Ebook = {
      id: ebooks.length + 1,
      title: formData.title,
      author: formData.author,
      description: formData.description,
      pages: parseInt(formData.pages) || 0,
      available: formData.available,
      uploaded: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      downloads: 0,
      category: formData.category,
      isbn: formData.isbn,
      thumbnailUrl: thumbnailPreview || undefined,
    }
    setEbooks([...ebooks, newEbook])
    setAddModalOpen(false)
    resetForm()
    setThumbnailPreview(null)
  }

  const handleEditEbook = () => {
    if (!selectedEbook) return
    setEbooks(ebooks.map(e => 
      e.id === selectedEbook.id 
        ? { 
            ...e, 
            ...formData, 
            pages: parseInt(formData.pages) || e.pages,
            thumbnailUrl: thumbnailPreview || e.thumbnailUrl
          }
        : e
    ))
    setEditModalOpen(false)
    setSelectedEbook(null)
    resetForm()
    setThumbnailPreview(null)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      pages: "",
      available: true,
      category: "",
      isbn: "",
      thumbnailUrl: "",
    })
  }

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string)
        setFormData({ ...formData, thumbnailUrl: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const openViewModal = (ebook: Ebook) => {
    setSelectedEbook(ebook)
    setViewModalOpen(true)
  }

  const openEditModal = (ebook: Ebook) => {
    setSelectedEbook(ebook)
    setFormData({
      title: ebook.title,
      author: ebook.author,
      description: ebook.description,
      pages: ebook.pages.toString(),
      available: ebook.available,
      category: ebook.category || "",
      isbn: ebook.isbn || "",
      thumbnailUrl: ebook.thumbnailUrl || "",
    })
    setThumbnailPreview(ebook.thumbnailUrl || null)
    setEditModalOpen(true)
  }

  if (ebooks.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="font-bold text-3xl md:text-4xl">E-book Management</h1>
            <p className="text-muted-foreground">Upload and update e-book resources</p>
          </div>
          <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Upload E-book
          </Button>
        </div>
        <EmptyState
          icon={BookOpen}
          title="No e-books yet"
          description="Upload your first e-book to get started"
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">E-book Management</h1>
          <p className="text-muted-foreground">Upload and update e-book resources</p>
        </div>
        <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Upload E-book
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ebooks.map((ebook) => (
          <Card key={ebook.id} className="border-border bg-card shadow-sm overflow-hidden">
            {ebook.thumbnailUrl ? (
              <div className="w-full h-64 relative overflow-hidden">
                <img 
                  src={ebook.thumbnailUrl} 
                  alt={ebook.title}
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
                      <DropdownMenuItem onClick={() => openViewModal(ebook)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(ebook)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ) : (
              <div className="w-full h-64 relative bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-white/50" />
                <div className="absolute top-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openViewModal(ebook)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditModal(ebook)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-base">{ebook.title}</CardTitle>
                {ebook.available ? (
                  <Badge variant="default">Available</Badge>
                ) : (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
              <CardDescription className="text-xs">By {ebook.author}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground line-clamp-2">{ebook.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{ebook.pages} pages</span>
                {ebook.downloads !== undefined && (
                  <span className="text-muted-foreground">{ebook.downloads} downloads</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add E-book Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Upload New E-book</DialogTitle>
            <DialogDescription>Add a new e-book to the library</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="E-book title"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pages">Pages</Label>
                <Input
                  id="pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  placeholder="120"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the e-book content"
                rows={4}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Career Guide, Finance"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isbn">ISBN (optional)</Label>
                <Input
                  id="isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  placeholder="978-0-123456-78-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Upload Thumbnail Image</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="thumbnail" 
                  type="file" 
                  accept="image/*" 
                  className="flex-1" 
                  onChange={handleThumbnailChange}
                />
              </div>
              {thumbnailPreview && (
                <div className="mt-2">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ebook-file">Upload E-book File</Label>
              <div className="flex items-center gap-2">
                <Input id="ebook-file" type="file" accept=".pdf,.epub,.mobi" className="flex-1" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="available" className="cursor-pointer">Make available for download</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setAddModalOpen(false); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleAddEbook}>Upload E-book</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>E-book Details</DialogTitle>
            <DialogDescription>Complete information about the e-book</DialogDescription>
          </DialogHeader>
          {selectedEbook && (
            <div className="space-y-4">
              {selectedEbook.thumbnailUrl ? (
                <div className="w-full h-64 rounded-lg overflow-hidden">
                  <img 
                    src={selectedEbook.thumbnailUrl} 
                    alt={selectedEbook.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                  <BookOpen className="h-16 w-16 text-white/50" />
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{selectedEbook.title}</h3>
                    {selectedEbook.available ? (
                      <Badge variant="default">Available</Badge>
                    ) : (
                      <Badge variant="secondary">Coming Soon</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">By {selectedEbook.author}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedEbook.description}</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Pages</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedEbook.pages} pages</p>
                  </div>
                  {selectedEbook.downloads !== undefined && (
                    <div>
                      <Label className="text-sm font-medium">Downloads</Label>
                      <div className="flex items-center gap-1 mt-1">
                        <Download className="h-4 w-4 text-muted-foreground" />
                        <span className="text-lg font-bold">{selectedEbook.downloads}</span>
                      </div>
                    </div>
                  )}
                </div>
                {selectedEbook.category && (
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedEbook.category}</p>
                  </div>
                )}
                {selectedEbook.isbn && (
                  <div>
                    <Label className="text-sm font-medium">ISBN</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedEbook.isbn}</p>
                  </div>
                )}
                {selectedEbook.uploaded && (
                  <div>
                    <Label className="text-sm font-medium">Uploaded</Label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedEbook.uploaded}</p>
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

      {/* Edit E-book Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit E-book</DialogTitle>
            <DialogDescription>Update e-book information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-author">Author</Label>
                <Input
                  id="edit-author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-pages">Pages</Label>
                <Input
                  id="edit-pages"
                  type="number"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-isbn">ISBN (optional)</Label>
                <Input
                  id="edit-isbn"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-thumbnail">Update Thumbnail Image</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="edit-thumbnail" 
                  type="file" 
                  accept="image/*" 
                  className="flex-1" 
                  onChange={handleThumbnailChange}
                />
              </div>
              {thumbnailPreview && (
                <div className="mt-2">
                  <img 
                    src={thumbnailPreview} 
                    alt="Thumbnail preview" 
                    className="w-full h-48 object-cover rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-file">Update E-book File</Label>
              <div className="flex items-center gap-2">
                <Input id="edit-file" type="file" accept=".pdf,.epub,.mobi" className="flex-1" />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-available" className="cursor-pointer">Make available for download</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setEditModalOpen(false); setSelectedEbook(null); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleEditEbook}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
