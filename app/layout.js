import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'GoTrade | Scan. Find. Save. Fast.',
    template: '%s | GoTrade'
  },
  description: 'Stop wasting time chasing suppliers. Find the right product, at the right price, in seconds.',
  applicationName: 'GoTrade',
  keywords: [
    'GoTrade',
    'trade sourcing',
    'supplier comparison',
    'product scan',
    'construction procurement'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'GoTrade',
    title: 'GoTrade | Scan. Find. Save. Fast.',
    description: 'Find products, compare suppliers, and save time on every job.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'GoTrade - Scan. Find. Save. Fast.'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoTrade | Scan. Find. Save. Fast.',
    description: 'Find products, compare suppliers, and save time on every job.',
    images: ['/og-image.svg']
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: [{ url: '/favicon.svg' }]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
