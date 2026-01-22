"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Award, Calendar, MapPin, Users, CheckCircle, Loader2 } from "lucide-react"
import { submitScholarshipInterest } from "@/lib/firebase/firestore"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function ScholarshipPage() {
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { user, userData } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    fullName: userData?.displayName || "",
    email: userData?.email || "",
    phone: "",
    graduationYear: "",
    school: "",
    major: "",
    whyInterested: "",
    previousTravel: "",
    additionalInfo: "",
  })
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
            <Button 
              size="lg" 
              className="w-full gap-2"
              onClick={() => setFormOpen(true)}
            >
              <Award className="h-5 w-5" />
              Submit Interest Form
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scholarship Interest Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scholarship Interest Form</DialogTitle>
            <DialogDescription>
              Please fill out this form to express your interest in the Ghana Culture Scholarship Tour. Our team will get back to you when applications open.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!user || !userData) {
                toast({
                  title: "Error",
                  description: "Please sign in to submit the form",
                  variant: "destructive",
                })
                return
              }

              setSubmitting(true)
              try {
                const success = await submitScholarshipInterest({
                  userId: user.uid,
                  userName: formData.fullName || userData.displayName || user.email || "Unknown",
                  userEmail: formData.email || userData.email || user.email || "",
                  phone: formData.phone,
                  graduationYear: formData.graduationYear,
                  school: formData.school,
                  major: formData.major,
                  whyInterested: formData.whyInterested,
                  previousTravel: formData.previousTravel,
                  additionalInfo: formData.additionalInfo,
                })

                if (success) {
                  toast({
                    title: "Success!",
                    description: "Your interest form has been submitted successfully. Our team will get back to you soon!",
                  })
                  setFormOpen(false)
                  // Reset form
                  setFormData({
                    fullName: userData?.displayName || "",
                    email: userData?.email || "",
                    phone: "",
                    graduationYear: "",
                    school: "",
                    major: "",
                    whyInterested: "",
                    previousTravel: "",
                    additionalInfo: "",
                  })
                } else {
                  throw new Error("Failed to submit form")
                }
              } catch (error: any) {
                toast({
                  title: "Error",
                  description: error.message || "Failed to submit interest form. Please try again.",
                  variant: "destructive",
                })
              } finally {
                setSubmitting(false)
              }
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="graduationYear">Graduation Year *</Label>
                <Input
                  id="graduationYear"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  placeholder="2024"
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="school">School/University *</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whyInterested">Why are you interested in this scholarship? *</Label>
              <Textarea
                id="whyInterested"
                value={formData.whyInterested}
                onChange={(e) => setFormData({ ...formData, whyInterested: e.target.value })}
                rows={4}
                placeholder="Tell us about your interest in Ghanaian culture and this scholarship opportunity..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousTravel">Have you traveled to Ghana or West Africa before?</Label>
              <Textarea
                id="previousTravel"
                value={formData.previousTravel}
                onChange={(e) => setFormData({ ...formData, previousTravel: e.target.value })}
                rows={2}
                placeholder="Share any previous travel experiences..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                value={formData.additionalInfo}
                onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                rows={3}
                placeholder="Any other information you'd like to share..."
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setFormOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Interest"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
