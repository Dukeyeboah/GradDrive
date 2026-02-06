import type React from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { ViewModeProvider } from '@/contexts/ViewModeContext';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

const FOTOMATIC_HOSTS = [
  'fotomatic.app',
  'www.fotomatic.app',
  'fotmatic.app',
  'www.fotmatic.app',
];

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get('host') ?? '';
  const hostname = host.split(':')[0].toLowerCase();
  const isFotomatic = FOTOMATIC_HOSTS.some(
    (h) => hostname === h || hostname.endsWith('.' + h)
  );

  const baseMetadata = {
    description:
      'Access exclusive graduation perks, digital assets, photographer network, and scholarship opportunities.',
    generator: 'v0.app',
    icons: {
      icon: [
        {
          url: '/icon-light-32x32.png',
          media: '(prefers-color-scheme: light)',
        },
        {
          url: '/icon-dark-32x32.png',
          media: '(prefers-color-scheme: dark)',
        },
        {
          url: '/icon.svg',
          type: 'image/svg+xml',
        },
      ],
      apple: '/apple-icon.png',
    },
  };

  if (isFotomatic) {
    return {
      ...baseMetadata,
      title: 'Fotomatic',
    };
  }

  return {
    ...baseMetadata,
    title: 'Grad Drive - Your Graduation Journey Partner',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <ViewModeProvider>
            <DataProvider>{children}</DataProvider>
          </ViewModeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
