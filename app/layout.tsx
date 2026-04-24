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
      'Access exclusive graduation perks, digital assets, photographer network, and scholarship opportunities.',
    generator: 'v0.app',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        {
          url: '/icon-light-32x32.png',
          type: 'image/png',
          sizes: '32x32',
          media: '(prefers-color-scheme: light)',
        },
        {
          url: '/icon-dark-32x32.png',
          type: 'image/png',
          sizes: '32x32',
          media: '(prefers-color-scheme: dark)',
        },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
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
