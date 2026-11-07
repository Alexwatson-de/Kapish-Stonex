import type { Metadata } from 'next';
import './globals.css';
import './stone-experience.css';
import { CinematicAtmosphere } from '@/components/cinematic-atmosphere';
export const dynamic = 'force-dynamic';
import { settings } from '@/lib/server/data';
import { defaultSettings } from '@/lib/schema';
export async function generateMetadata(): Promise<Metadata> {
  const s = await settings().catch(() => defaultSettings);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: { default: `${s.brand} — ${s.tagline}`, template: `%s | ${s.brand}` },
    description: s.seoDescription,
    robots: { index: true, follow: true },
    icons: {
      icon: [{ url: '/brand/favicon.svg', type: 'image/svg+xml' }],
      apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
    },
    openGraph: {
      siteName: s.brand,
      title: `${s.brand} — ${s.tagline}`,
      description: s.seoDescription,
      images: [{ url: '/brand/social-card.png', width: 1200, height: 630, alt: `${s.brand} — Natural stone, considered.` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${s.brand} — ${s.tagline}`,
      description: s.seoDescription,
      images: ['/brand/social-card.png'],
    },
  };
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
        <CinematicAtmosphere />
      </body>
    </html>
  );
}
