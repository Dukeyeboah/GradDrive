"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Mail, Phone, GraduationCap, Building, Calendar, User } from "lucide-react"
import { getScholarshipSubmissions, ScholarshipSubmission } from "@/lib/firebase/firestore"

export default function AdminScholarshipPage() {
  const [submissions, setSubmissions] = useState<ScholarshipSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<ScholarshipSubmission | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      setLoading(true)
      const data = await getScholarshipSubmissions()
      setSubmissions(data)
    } catch (error) {
      console.error("Error loading submissions:", error)
    } finally {
      setLoading(false)
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

  const getStatusBadgeVariant = (status?: string) => {
    switch (status) {
      case "approved":
        return "default"
      case "reviewed":
        return "secondary"
      case "rejected":
        return "destructive"
      default:
        return "outline"
    }
  }
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl">Scholarship Program</h1>
        <p className="text-muted-foreground">Edit scholarship details and manage applications</p>
      </div>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Program Details</CardTitle>
          <CardDescription>Update scholarship program information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Program Title</Label>
            <Input id="title" defaultValue="Ghana Culture Scholarship Tour" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              defaultValue="An immersive cultural experience celebrating your graduation"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input id="duration" type="number" defaultValue="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participants">Max Participants</Label>
              <Input id="participants" type="number" defaultValue="20" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="locations">Locations</Label>
            <Input id="locations" defaultValue="Accra, Kumasi, Cape Coast" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-border bg-card shadow-sm">
        <CardHeader>
          <CardTitle>Application Submissions</CardTitle>
          <CardDescription>View and manage scholarship interest submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No submissions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Pending Applications</p>
                  <p className="text-sm text-muted-foreground">Applications awaiting review</p>
                </div>
                <span className="font-bold text-2xl">
                  {submissions.filter(s => !s.status || s.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium">Total Submissions</p>
                  <p className="text-sm text-muted-foreground">All-time applications</p>
                </div>
                <span className="font-bold text-2xl">{submissions.length}</span>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto mt-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="p-3 border border-border rounded-lg hover:bg-accent/50 cursor-pointer"
                    onClick={() => {
                      setSelectedSubmission(submission)
                      setViewModalOpen(true)
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{submission.userName}</span>
                          <Badge variant={getStatusBadgeVariant(submission.status)}>
                            {submission.status || "pending"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{submission.userEmail}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {submission.school} • {submission.graduationYear}
                        </p>
                        {submission.timestamp && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Submitted: {formatDate(submission.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Submission Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scholarship Submission Details</DialogTitle>
            <DialogDescription>
              Complete information about the scholarship interest submission
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <p className="text-sm">{selectedSubmission.userName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <p className="text-sm">{selectedSubmission.userEmail}</p>
                </div>
              </div>
              {selectedSubmission.phone && (
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4" />
                    Phone
                  </Label>
                  <p className="text-sm">{selectedSubmission.phone}</p>
                </div>
              )}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4" />
                    Graduation Year
                  </Label>
                  <p className="text-sm">{selectedSubmission.graduationYear}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Building className="h-4 w-4" />
                    School
                  </Label>
                  <p className="text-sm">{selectedSubmission.school}</p>
                </div>
              </div>
              {selectedSubmission.major && (
                <div>
                  <Label className="text-sm font-medium mb-1">Major/Field of Study</Label>
                  <p className="text-sm">{selectedSubmission.major}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium mb-1">Why Interested</Label>
                <p className="text-sm whitespace-pre-wrap">{selectedSubmission.whyInterested}</p>
              </div>
              {selectedSubmission.previousTravel && (
                <div>
                  <Label className="text-sm font-medium mb-1">Previous Travel Experience</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedSubmission.previousTravel}</p>
                </div>
              )}
              {selectedSubmission.additionalInfo && (
                <div>
                  <Label className="text-sm font-medium mb-1">Additional Information</Label>
                  <p className="text-sm whitespace-pre-wrap">{selectedSubmission.additionalInfo}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium mb-1">Status</Label>
                <div>
                  <Badge variant={getStatusBadgeVariant(selectedSubmission.status)}>
                    {selectedSubmission.status || "pending"}
                  </Badge>
                </div>
              </div>
              {selectedSubmission.timestamp && (
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4" />
                    Submitted
                  </Label>
                  <p className="text-sm">{formatDate(selectedSubmission.timestamp)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
