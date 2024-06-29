import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calories Tracker AI',
  description: 'Calories Tracker AI',
  keywords: ['calories, ai, chatgpt, nutrition'],
  openGraph: {
    url: 'https://calories-tracker-ai.vercel.app/',
    title: 'Calories Tracker AI',
    description: 'Calories Tracker AI',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Calories Tracker AI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://calories-tracker-ai.vercel.app/',
    title: 'Calories Tracker AI',
    description: 'Calories Tracker AI',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Calories Tracker AI',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
