"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MoreVertical, Eye, Edit, Loader2, Instagram, Mail, Phone, Globe, Plus, Clock, User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPhotographers, updatePhotographer, addPhotographer, Photographer, getPhotographerBookings, PhotographerBooking } from "@/lib/firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"

export default function AdminPhotographersPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedPhotographer, setSelectedPhotographer] = useState<Photographer | null>(null)
  const [bookings, setBookings] = useState<PhotographerBooking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    website: "",
    instagram: "",
    phone: "",
    address: "",
    state: "",
    status: "interested-follow-up" as Photographer["status"],
    instagramContact: false,
    emailContact: false,
    phoneContact: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadPhotographers()
  }, [])

  const loadPhotographers = async () => {
    try {
      setLoading(true)
      const data = await getPhotographers()
      setPhotographers(data)
    } catch (error) {
      console.error("Error loading photographers:", error)
      toast({
        title: "Error",
        description: "Failed to load photographers",
        variant: "destructive",
      })
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
    return photographer.address || photographer.state || photographer.location || "N/A"
  }

  const openViewModal = async (photographer: Photographer) => {
    setSelectedPhotographer(photographer)
    setViewModalOpen(true)
    // Load bookings for this photographer
    if (photographer.id) {
      setLoadingBookings(true)
      try {
        const photographerBookings = await getPhotographerBookings(photographer.id)
        setBookings(photographerBookings)
      } catch (error) {
        console.error("Error loading bookings:", error)
      } finally {
        setLoadingBookings(false)
      }
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Unknown"
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const openEditModal = (photographer: Photographer) => {
    setSelectedPhotographer(photographer)
    setFormData({
      firstName: photographer.firstName || "",
      lastName: photographer.lastName || "",
      email: photographer.email || "",
      website: photographer.website || "",
      instagram: photographer.instagram || "",
      phone: photographer.phone || "",
      address: photographer.address || "",
      state: photographer.state || "",
      status: photographer.status || "interested-follow-up",
      instagramContact: photographer.instagramContact || false,
      emailContact: photographer.emailContact || false,
      phoneContact: photographer.phoneContact || false,
    })
    setEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      website: "",
      instagram: "",
      phone: "",
      address: "",
      state: "",
      status: "interested-follow-up",
      instagramContact: false,
      emailContact: false,
      phoneContact: false,
    })
  }

  const openAddModal = () => {
    resetForm()
    setAddModalOpen(true)
  }

  const handleAddPhotographer = async () => {
    if (!formData.firstName.trim()) {
      toast({
        title: "Error",
        description: "First name is required",
        variant: "destructive",
      })
      return
    }

    try {
      const photographerId = await addPhotographer(formData)
      if (photographerId) {
        toast({
          title: "Success",
          description: "Photographer added successfully",
        })
        setAddModalOpen(false)
        resetForm()
        loadPhotographers()
      } else {
        throw new Error("Add failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add photographer",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePhotographer = async () => {
    if (!selectedPhotographer?.id) return

    try {
      const success = await updatePhotographer(selectedPhotographer.id, formData)
      if (success) {
        toast({
          title: "Success",
          description: "Photographer updated successfully",
        })
        setEditModalOpen(false)
        setSelectedPhotographer(null)
        resetForm()
        loadPhotographers()
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update photographer",
        variant: "destructive",
      })
    }
  }

  const getStatusBadgeVariant = (status: Photographer["status"]) => {
    switch (status) {
      case "interested-follow-up":
        return "default"
      case "contacted":
        return "secondary"
      case "not-contacted":
        return "outline"
      case "not-interested/no-response":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-bold text-3xl md:text-4xl">Photographer Network</h1>
          <p className="text-muted-foreground">Manage photographers and their profiles</p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Photographer
        </Button>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>All Photographers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Contact Methods</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {photographers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No photographers found
                    </TableCell>
                  </TableRow>
                ) : (
                  photographers.map((photographer) => (
                    <TableRow key={photographer.id}>
                      <TableCell className="font-medium">
                        {getPhotographerName(photographer)}
                      </TableCell>
                      <TableCell>{getLocation(photographer)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(photographer.status)}>
                          {photographer.status?.replace(/-/g, " ").replace(/\//g, " / ") || "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {photographer.instagramContact && photographer.instagram && (
                            <Instagram className="h-4 w-4 text-pink-600" title="Instagram contact enabled" />
                          )}
                          {photographer.emailContact && photographer.email && (
                            <Mail className="h-4 w-4 text-blue-600" title="Email contact enabled" />
                          )}
                          {photographer.phoneContact && photographer.phone && (
                            <Phone className="h-4 w-4 text-green-600" title="Phone contact enabled" />
                          )}
                          {!photographer.instagramContact && !photographer.emailContact && !photographer.phoneContact && (
                            <span className="text-xs text-muted-foreground">No contact methods</span>
                          )}
                        </div>
                      </TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Photographer Details</DialogTitle>
            <DialogDescription>Complete information about the photographer</DialogDescription>
          </DialogHeader>
          {selectedPhotographer && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getPhotographerName(selectedPhotographer)}
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPhotographer.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPhotographer.phone || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Website</Label>
                  {selectedPhotographer.website ? (
                    <a
                      href={selectedPhotographer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mt-1 block"
                    >
                      {selectedPhotographer.website}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">N/A</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">Instagram</Label>
                  {selectedPhotographer.instagram ? (
                    <a
                      href={selectedPhotographer.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-pink-600 hover:underline mt-1 block"
                    >
                      {selectedPhotographer.instagram}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">N/A</p>
                  )}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPhotographer.address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">State</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedPhotographer.state || "N/A"}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">
                    <Badge variant={getStatusBadgeVariant(selectedPhotographer.status)}>
                      {selectedPhotographer.status?.replace(/-/g, " ").replace(/\//g, " / ") || "Unknown"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Preferred Contact Methods</Label>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <Instagram className={`h-4 w-4 ${selectedPhotographer.instagramContact ? "text-pink-600" : "text-gray-400"}`} />
                      <span className={`text-sm ${selectedPhotographer.instagramContact ? "text-foreground" : "text-muted-foreground"}`}>
                        Instagram
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className={`h-4 w-4 ${selectedPhotographer.emailContact ? "text-blue-600" : "text-gray-400"}`} />
                      <span className={`text-sm ${selectedPhotographer.emailContact ? "text-foreground" : "text-muted-foreground"}`}>
                        Email
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className={`h-4 w-4 ${selectedPhotographer.phoneContact ? "text-green-600" : "text-gray-400"}`} />
                      <span className={`text-sm ${selectedPhotographer.phoneContact ? "text-foreground" : "text-muted-foreground"}`}>
                        Phone
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bookings Section */}
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Booking Requests ({bookings.length})
                  </Label>
                </div>
                {loadingBookings ? (
                  <div className="flex justify-center items-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : bookings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No booking requests yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-3 border border-border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{booking.userName}</span>
                              <Badge variant={booking.status === "pending" ? "default" : booking.status === "contacted" ? "secondary" : "outline"}>
                                {booking.status || "pending"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{booking.userEmail}</p>
                            {booking.timestamp && (
                              <p className="text-xs text-muted-foreground mt-1">
                                Requested: {formatDate(booking.timestamp)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => { setViewModalOpen(false); setBookings([]) }}>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
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
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-instagram">Instagram</Label>
              <Input
                id="edit-instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://www.instagram.com/username"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Input
                  id="edit-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Photographer["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interested-follow-up">Interested - Follow Up</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="not-contacted">Not Contacted</SelectItem>
                  <SelectItem value="not-interested/no-response">Not Interested / No Response</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <Label className="text-sm font-medium">Preferred Contact Methods</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    <Label htmlFor="edit-instagramContact" className="cursor-pointer">
                      Instagram Contact
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="edit-instagramContact"
                      checked={formData.instagramContact}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, instagramContact: checked })
                      }
                    />
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formData.instagramContact ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="edit-emailContact" className="cursor-pointer">
                      Email Contact
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="edit-emailContact"
                      checked={formData.emailContact}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, emailContact: checked })
                      }
                    />
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formData.emailContact ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <Label htmlFor="edit-phoneContact" className="cursor-pointer">
                      Phone Contact
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="edit-phoneContact"
                      checked={formData.phoneContact}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, phoneContact: checked })
                      }
                    />
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formData.phoneContact ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setEditModalOpen(false); setSelectedPhotographer(null); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePhotographer}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Photographer Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Photographer</DialogTitle>
            <DialogDescription>Enter photographer information to add them to the network</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="add-firstName">First Name *</Label>
                <Input
                  id="add-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-lastName">Last Name</Label>
                <Input
                  id="add-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="add-email">Email</Label>
                <Input
                  id="add-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="photographer@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-phone">Phone</Label>
                <Input
                  id="add-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-website">Website</Label>
              <Input
                id="add-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-instagram">Instagram</Label>
              <Input
                id="add-instagram"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://www.instagram.com/username"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="add-address">Address</Label>
                <Input
                  id="add-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-state">State</Label>
                <Input
                  id="add-state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="California"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as Photographer["status"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interested-follow-up">Interested - Follow Up</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="not-contacted">Not Contacted</SelectItem>
                  <SelectItem value="not-interested/no-response">Not Interested / No Response</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <Label className="text-sm font-medium">Preferred Contact Methods</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    <Label htmlFor="add-instagramContact" className="cursor-pointer">
                      Instagram Contact
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="add-instagramContact"
                      checked={formData.instagramContact}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, instagramContact: checked })
                      }
                    />
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formData.instagramContact ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="add-emailContact" className="cursor-pointer">
                      Email Contact
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="add-emailContact"
                      checked={formData.emailContact}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, emailContact: checked })
                      }
                    />
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formData.emailContact ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <Label htmlFor="add-phoneContact" className="cursor-pointer">
                      Phone Contact
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="add-phoneContact"
                      checked={formData.phoneContact}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, phoneContact: checked })
                      }
                    />
                    <div
                      className={`h-3 w-3 rounded-full ${
                        formData.phoneContact ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => { setAddModalOpen(false); resetForm() }}>
                Cancel
              </Button>
              <Button onClick={handleAddPhotographer}>Add Photographer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
