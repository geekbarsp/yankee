import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { anton, arimo, ui, wide } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yankee SRP Rules Home',
  openGraph: { title: 'Yankee SRP Rules Home', type: 'website', images: [{ url: '/logo-512.png', width: 512, height: 512 }] },
  referrer: 'strict-origin-when-cross-origin',
  icons: {
    icon: [{ url: '/favicon-64.png', sizes: '64x64', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1d1d1d',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${arimo.variable} ${wide.variable} ${ui.variable}`}>
      <body>
        {children}
        <noscript>
          <p className="nojs">This site requires JavaScript.</p>
        </noscript>
      </body>
    </html>
  );
}
