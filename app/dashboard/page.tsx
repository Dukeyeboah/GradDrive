'use client';

import { PerkCard } from '@/components/perk-card';
import {
  BookOpen,
  Camera,
  FileImage,
  GraduationCap,
  Award,
  Gift,
  Users,
  History,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { userData } = useAuth();

  // Get first name from displayName or email
  const getFirstName = () => {
    if (userData?.displayName) {
      const firstName = userData.displayName.split(' ')[0];
      return firstName;
    }
    if (userData?.email) {
      const emailName = userData.email.split('@')[0];
      return emailName;
    }
    return null;
  };

  const firstName = getFirstName();
  const greeting = firstName ? `Hello ${firstName}! 👋` : 'Hello! 👋';

  return (
    <div className='flex flex-col justify-start items-center w-full py-4'>
      <div className='container max-w-7xl space-y-8'>
        <div className='space-y-2 text-center'>
          <p className='text-base md:text-lg text-muted-foreground text-balance'>
            {greeting}
          </p>
          <h2 className='text-xl md:text-2xl font-semibold text-balance'>
            Welcome to Grad Dashboard. Explore these exciting features
          </h2>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <PerkCard
            icon={Camera}
            title='Book Photographer'
            description='Find and book professional photographers for your graduation'
            href='/dashboard/photographers'
            buttonText='Browse'
          />

          <PerkCard
            icon={BookOpen}
            title='Life after graduation E-books'
            description='Access comprehensive guides for your post-graduation journey'
            href='/dashboard/ebooks'
            buttonText='View'
          />

          <PerkCard
            icon={FileImage}
            title='Digital Posters & Artwork'
            description='Download free graduation posters and digital artwork'
            href='/dashboard/grad-drive'
            buttonText='Browse'
          />

          <PerkCard
            icon={GraduationCap}
            title='Graduation Cap Designs'
            description='Explore and download cap design templates'
            href='/dashboard/grad-drive'
            buttonText='View'
          />

          <PerkCard
            icon={Users}
            title='HoS Alumni Club'
            description='Connect with alumni and join exclusive community events'
            href='/dashboard/discounts'
            buttonText='Join'
          />

          <PerkCard
            icon={History}
            title='Kente & Graduation History'
            description='Learn about Kente traditions and graduation history'
            href='/dashboard/discounts'
            buttonText='Explore'
          />

          <PerkCard
            icon={Award}
            title='Scholarships'
            description='Discover scholarship opportunities and programs'
            href='/dashboard/scholarship'
            buttonText='Learn More'
          />

          <PerkCard
            icon={Gift}
            title='Coming Soon'
            description='Exciting new features and opportunities on the way'
            href='/dashboard/discounts'
            buttonText='View'
          />
        </div>
      </div>
    </div>
  );
}
