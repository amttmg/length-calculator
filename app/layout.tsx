import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feet & Inch Length Calculator',
  description: 'Mobile-first length calculator for feet, inches, and division operations.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg'
  },
  manifest: '/manifest.webmanifest',
  metadataBase: new URL('https://your-vercel-app-url.vercel.app')
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111827'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
