import type { LucideIcon } from 'lucide-react';
import {
  Users,
  Camera,
  FileImage,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
} from 'lucide-react';

export type AdminQuickAccessItem = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export const ADMIN_QUICK_ACCESS_ITEMS: AdminQuickAccessItem[] = [
  {
    href: '/admin/users',
    title: 'Manage Users',
    description: 'View and manage Grad Drive user accounts.',
    icon: Users,
  },
  {
    href: '/admin/photographers',
    title: 'Photographers',
    description: 'Curate photographer listings and bookings.',
    icon: Camera,
  },
  {
    href: '/admin/posters',
    title: 'Posters',
    description: 'Upload and organize poster assets.',
    icon: FileImage,
  },
  {
    href: '/admin/cap-designs',
    title: 'Cap Designs',
    description: 'Manage cap design templates and files.',
    icon: GraduationCap,
  },
  {
    href: '/admin/ebooks',
    title: 'E-books',
    description: 'Publish and track eBook downloads.',
    icon: BookOpen,
  },
  {
    href: '/admin/scholarship',
    title: 'Scholarships',
    description: 'Review scholarship submissions and content.',
    icon: Award,
  },
  // {
  //   href: '/admin/customizer',
  //   title: 'Customizer',
  //   description: 'Configure product customizer experiences.',
  //   icon: Palette,
  // },
  {
    href: '/admin/logs',
    title: 'System Logs',
    description: 'Audit activity and platform events.',
    icon: FileText,
  },
];
