import { PerkCard } from "@/components/perk-card"
import { GraduationCap, BookOpen, Camera, Award, Gift, User } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container py-12 space-y-8">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl md:text-4xl text-balance">Welcome back! 🎓</h1>
        <p className="text-lg text-muted-foreground text-balance">Access your graduation perks and resources</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PerkCard
          icon={GraduationCap}
          title="Digital Assets"
          description="Download free posters, cap designs, and keepsake materials"
          href="/dashboard/grad-drive"
          buttonText="Browse Assets"
        />

        <PerkCard
          icon={BookOpen}
          title="E-book Library"
          description="Access your After-Grad Kit and future book releases"
          href="/dashboard/ebooks"
          buttonText="View Library"
        />

        <PerkCard
          icon={Camera}
          title="Photographer Network"
          description="Connect with verified photographers in your area"
          href="/dashboard/photographers"
          buttonText="Find Photographers"
        />

        <PerkCard
          icon={Award}
          title="Scholarship Tour"
          description="Learn about our Ghana Culture Scholarship program"
          href="/dashboard/scholarship"
          buttonText="Learn More"
        />

        <PerkCard
          icon={Gift}
          title="Exclusive Discounts"
          description="Access special offers and future purchase discounts"
          href="/dashboard/discounts"
          buttonText="View Offers"
        />

        <PerkCard
          icon={User}
          title="My Account"
          description="Manage your profile and access information"
          href="/dashboard/account"
          buttonText="View Profile"
        />
      </div>
    </div>
  )
}
