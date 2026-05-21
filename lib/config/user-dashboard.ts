export type CategoryCardConfig = {
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  imageSrc: string;
};

/** Offerings hub on /dashboard/grad-drive (Tools & Resources temporarily omitted). */
export const DASHBOARD_CATEGORY_CARDS: CategoryCardConfig[] = [
  {
    title: 'Photography',
    description: 'Book photographers on Fotomatic.',
    href: '/dashboard/photographers',
    ctaLabel: 'Access',
    imageSrc: '/images/categories/photography.jpeg',
  },
  {
    title: 'Ebooks & Guides',
    description: 'Guides and reads for life after graduation.',
    href: '/dashboard/ebooks',
    ctaLabel: 'View All',
    imageSrc: '/images/categories/ebooks.jpeg',
  },
  {
    title: 'Posters & Artworks',
    description: 'Posters and digital art for graduation.',
    href: '/dashboard/posters',
    ctaLabel: 'Browse',
    imageSrc: '/images/categories/posters.jpeg',
  },
  {
    title: 'Travel opportunities',
    description: 'Tours and exclusive travel offers.',
    href: '/dashboard/discounts',
    ctaLabel: 'Access',
    imageSrc: '/images/categories/travel_opportunites.jpeg',
  },
  {
    title: 'Cap Designs',
    description: 'Cap templates and design ideas.',
    href: '/dashboard/cap-designs',
    ctaLabel: 'View All',
    imageSrc: '/images/categories/cap.jpeg',
  },
  {
    title: 'Scholarships',
    description: 'Funding and programs for graduates.',
    href: '/dashboard/scholarship',
    ctaLabel: 'Explore',
    imageSrc: '/images/categories/scholarships.jpeg',
  },
  {
    title: 'Cultural Content',
    description: 'Kente, heritage, and grad history.',
    href: '/dashboard/kente-history',
    ctaLabel: 'Explore',
    imageSrc: '/images/categories/cultural_content.jpeg',
  },
];

/** Featured row on home: Ebooks, Posters, Photography, Travel Opportunities. */
export const DASHBOARD_HOME_OFFERING_CARDS: CategoryCardConfig[] = [
  {
    title: 'Ebooks & Guides',
    description: 'Guides and reads for life after graduation.',
    href: '/dashboard/ebooks',
    ctaLabel: 'View All',
    imageSrc: '/images/categories/ebooks.jpeg',
  },
  {
    title: 'Posters & Artworks',
    description: 'Posters and digital art for graduation.',
    href: '/dashboard/posters',
    ctaLabel: 'Browse',
    imageSrc: '/images/categories/posters.jpeg',
  },
  {
    title: 'Photography',
    description: 'Book photographers on Fotomatic.',
    href: '/dashboard/photographers',
    ctaLabel: 'Access',
    imageSrc: '/images/categories/photography.jpeg',
  },
  {
    title: 'Travel Opportunities',
    description: 'Tours and exclusive travel offers.',
    href: '/dashboard/discounts',
    ctaLabel: 'Access',
    imageSrc: '/images/categories/travel_opportunites.jpeg',
  },
];

export type DashboardEventItem = {
  id: string;
  title: string;
  description: string;
  dateLabel: string;
  time: string;
  imageSrc: string;
  href: string;
};

export const DASHBOARD_UPCOMING_EVENTS: DashboardEventItem[] = [];

export const DASHBOARD_SEARCH_ROUTES: { keywords: string[]; href: string }[] =
  [
    {
      keywords: ['photo', 'photograph', 'camera', 'book', 'shoot'],
      href: '/dashboard/photographers',
    },
    { keywords: ['ebook', 'book', 'guide', 'read', 'library'], href: '/dashboard/ebooks' },
    { keywords: ['poster', 'art', 'download', 'print'], href: '/dashboard/posters' },
    { keywords: ['cap', 'design', 'mortar'], href: '/dashboard/cap-designs' },
    {
      keywords: ['scholar', 'fund', 'tuition', 'apply'],
      href: '/dashboard/scholarship',
    },
    {
      keywords: ['travel', 'ghana', 'tour', 'trip', 'hos', 'opportunity'],
      href: '/dashboard/discounts',
    },
    { keywords: ['alumni', 'club', 'event', 'community'], href: '/dashboard/alum-club' },
    { keywords: ['kente', 'history', 'culture'], href: '/dashboard/kente-history' },
    { keywords: ['account', 'profile', 'setting'], href: '/dashboard/account' },
    {
      keywords: [
        'grad driver',
        'drivers',
        'directory',
        'network',
        'alumni',
        'classmate',
        'connect',
      ],
      href: '/dashboard/grad-drivers',
    },
    { keywords: ['explore', 'offering'], href: '/dashboard/grad-drive' },
  ];
