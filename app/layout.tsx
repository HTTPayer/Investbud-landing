import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: 'Investbud AI - AI Co-Pilot for Crypto Investing',
  description: 'Your AI Co-Pilot for Crypto Investing - Real-time macro regime signals + on-chain portfolio analysis, powered by LLM intelligence. Get AI-powered wallet analysis, market insights, and DeFi portfolio recommendations.',
  keywords: [
    'crypto AI',
    'crypto portfolio analysis',
    'DeFi AI assistant',
    'blockchain wallet analysis',
    'crypto market analysis',
    'on-chain analysis',
    'crypto trading AI',
    'macro regime signals',
    'Web3 AI',
    'crypto investment advisor',
    'portfolio tracker',
    'cryptocurrency analysis',
    'AI trading assistant',
    'Base blockchain',
    'USDC payments',
    'x402 protocol',
    'MetaMask integration',
    'crypto co-pilot'
  ],
  authors: [{ name: 'Investbud Team' }],
  creator: 'Investbud AI',
  publisher: 'Investbud AI',
  metadataBase: new URL('https://investbudai.xyz'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://investbudai.xyz',
    title: 'Investbud AI - AI Co-Pilot for Crypto Investing',
    description: 'Your AI Co-Pilot for Crypto Investing - Real-time macro regime signals + on-chain portfolio analysis, powered by LLM intelligence.',
    siteName: 'Investbud AI',
    images: [
      {
        url: '/ib-og.png',
        width: 1200,
        height: 630,
        alt: 'Investbud AI - Crypto Investment Co-Pilot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Investbud AI - AI Co-Pilot for Crypto Investing',
    description: 'Real-time macro regime signals + on-chain portfolio analysis, powered by LLM intelligence.',
    images: ['/ib-og.png'],
    creator: '@investbud',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes when ready
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  category: 'finance',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
