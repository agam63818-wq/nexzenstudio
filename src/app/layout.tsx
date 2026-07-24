import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { SITE_URL } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NexZen Studio — Build. Create. Inspire.',
    template: '%s | NexZen Studio',
  },
  description:
    'AI prompts, image & video prompts, APKs, games, tools, resources and blogs by @agam.nexgen.ai. Build. Create. Inspire.',
  keywords: ['AI prompts', 'ChatGPT', 'Midjourney', 'APK', 'games', 'AI tools', 'NexZen Studio'],
  alternates: { types: { 'application/rss+xml': `${SITE_URL}/rss.xml` } },
  openGraph: {
    title: 'NexZen Studio — Build. Create. Inspire.',
    description: 'AI prompts, games, APKs, tools & resources for creators.',
    url: SITE_URL,
    siteName: 'NexZen Studio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexZen Studio — Build. Create. Inspire.',
    description: 'AI prompts, games, APKs, tools & resources for creators.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NexZen Studio',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
