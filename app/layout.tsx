import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { ViewModeProvider } from '@/contexts/ViewModeContext';
import './globals.css';

const _geist = Geist({ subsets: ['latin'] });
const _geistMono = Geist_Mono({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Grad Drive - Your Graduation Journey Partner',
    description:
      'Connect with graduates, explore practical guides, and celebrate your next chapter with Grad Drive.',
    metadataBase: new URL('https://graddrive.com'),
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', type: 'image/png', sizes: '32x32' },
        { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
      shortcut: ['/favicon.ico'],
    },
    openGraph: {
      title: 'Grad Drive - Your Graduation Journey Partner',
      description:
        'Connect with graduates, explore practical guides, and celebrate your next chapter with Grad Drive.',
      url: 'https://graddrive.com',
      siteName: 'Grad Drive',
      type: 'website',
      images: [
        {
          url: '/icon-512.png',
          width: 512,
          height: 512,
          alt: 'Grad Drive',
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: 'Grad Drive - Your Graduation Journey Partner',
      description:
        'Connect with graduates, explore practical guides, and celebrate your next chapter with Grad Drive.',
      images: ['/icon-512.png'],
    },
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
