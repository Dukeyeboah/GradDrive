'use client'

import { useState } from "react"
import { Gift } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { submitTravelInterest } from "@/lib/firebase/firestore"

export default function DiscountsPage() {
  const { user, userData } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    graduationYear: "",
    school: "",
    interests: "",
    preferredTiming: "",
    budgetRange: "",
    travelExperience: "",
    additionalInfo: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess(null)
    setError(null)

    try {
      if (!user) {
        setError("Please sign in to submit your interest.")
        setSubmitting(false)
        return
      }

      const ok = await submitTravelInterest({
        userId: user.uid,
        userName: formData.name || userData?.displayName || "",
        userEmail: formData.email || userData?.email || "",
        graduationYear: formData.graduationYear,
        school: formData.school,
        interests: formData.interests,
        preferredTiming: formData.preferredTiming,
        budgetRange: formData.budgetRange,
        travelExperience: formData.travelExperience,
        additionalInfo: formData.additionalInfo,
      })

      if (!ok) {
        setError("We couldn't save your interest right now. Please try again shortly.")
        setSubmitting(false)
        return
      }

      setSuccess("Thank you for your interest! The HoS team will review your submission and reach out with next steps.")
      setSubmitting(false)
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full py-12">
      <div className="container max-w-4xl space-y-10">
        <div className="space-y-3 text-center">
          <h1 className="font-bold text-3xl md:text-4xl text-balance">The HoS Travel Experience</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Immerse yourself in Ghana&apos;s rich Kente heritage, food, art, and educational experiences with House of
            Stole. A curated journey for recent graduates who want to explore life after college at the intersection of
            culture and education.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[3fr,2fr]">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Share your interest</CardTitle>
              <CardDescription>
                Tell us a bit about yourself and the kind of travel experience you&apos;d love. This helps us gauge
                interest and design an experience that truly serves you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert variant="default" className="mb-4">
                  <AlertTitle>Interest submitted</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTitle>Something went wrong</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={userData?.displayName || "Enter your full name"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={userData?.email || "you@example.com"}
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      value={formData.graduationYear}
                      onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                      placeholder="e.g. 2025"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School / University</Label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      placeholder="Where did you graduate from?"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interests">What are you most excited to experience?</Label>
                  <Textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="Share what draws you to this trip – Kente heritage, food, art, history, community, or something else."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredTiming">Preferred travel timing</Label>
                  <Input
                    id="preferredTiming"
                    value={formData.preferredTiming}
                    onChange={(e) => setFormData({ ...formData, preferredTiming: e.target.value })}
                    placeholder="e.g. Summer after graduation, specific months, flexible, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budgetRange">Approximate budget range (optional)</Label>
                  <Input
                    id="budgetRange"
                    value={formData.budgetRange}
                    onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                    placeholder="e.g. $1,500 – $2,500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="travelExperience">
                    Have you travelled to Ghana or other parts of Africa before?
                  </Label>
                  <Textarea
                    id="travelExperience"
                    value={formData.travelExperience}
                    onChange={(e) => setFormData({ ...formData, travelExperience: e.target.value })}
                    placeholder="Tell us briefly about your previous travel experience (if any)."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Anything else you&apos;d like us to know? (optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    placeholder="Share any questions, access needs, or ideas for what would make this experience meaningful for you."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Interest"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border bg-muted/40">
            <CardHeader>
              <CardTitle>Why this experience?</CardTitle>
              <CardDescription>
                House of Stole (HoS) sits at the intersection of culture and education. This trip is our way of inviting
                you into that intersection in a living, breathing way.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                The HoS Travel Experience is a curated journey to Ghana designed for recent graduates and young
                professionals who want to explore life after college in a meaningful way before stepping fully into the
                next chapter.
              </p>
              <p>
                You&apos;ll experience the culture that birthed Kente – visiting weaving communities, learning the
                stories behind the cloth, and seeing how tradition and creativity meet. Alongside this, you&apos;ll
                explore food, art, music, and key educational and historical sites that ground the experience in deeper
                context.
              </p>
              <p>
                Our goal is to create space for learning, reflection, fun, and connection – to Ghana, to the HoS story,
                and to other travellers on a similar journey. This form helps us understand who is interested and what
                kind of experience would serve you best.
              </p>
              <p className="font-medium text-foreground">
                This is not a commitment – it&apos;s an interest form. By filling it out, you&apos;re helping us shape
                something special, and you&apos;ll be the first to hear when details are confirmed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
