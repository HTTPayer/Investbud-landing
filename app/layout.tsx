import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Investbud AI Co-pilot Landing And Chat',
  description: 'Your AI Co-Pilot for Crypto Investing - Real-time macro regime signals + on-chain portfolio analysis, powered by LLM intelligence.',
  openGraph: {
    images: ['https://bolt.new/static/og_default.png'],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://bolt.new/static/og_default.png'],
  },
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
