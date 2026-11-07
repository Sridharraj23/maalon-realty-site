import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppFloating from '@/components/layout/WhatsAppFloating';
import { BRAND, DEFAULT_SITE_SETTINGS } from '@/lib/constants';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#019393',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: 'MAALON REALTY | Every Property Has a Purpose. Every Buyer Has a Place.',
    template: '%s | MAALON REALTY',
  },
  description:
    'Maalon Realty connects property owners with the right buyers and helps you discover properties that truly fit your needs, aspirations, and lifestyle across Tamil Nadu.',
  keywords: [
    'Maalon Realty',
    'Real Estate Advisory Tamil Nadu',
    'Properties for sale in Chennai',
    'Villas for sale in ECR Chennai',
    'Apartments for sale in OMR',
    'Plots for sale in Guduvanchery',
    'Commercial property in Coimbatore',
    'Rental properties in Chennai',
    'Property Brokerage Chennai',
  ],
  authors: [{ name: 'Maalon Realty' }],
  creator: 'Maalon Realty',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: BRAND.url,
    title: 'MAALON REALTY – Professional Real Estate Brokerage & Property Advisory',
    description:
      'We connect property owners with the right buyers across Tamil Nadu. Explore verified luxury villas, apartments, plotted developments, and commercial properties.',
    siteName: 'MAALON REALTY',
    images: [
      {
        url: BRAND.logos.horizontal,
        width: 1200,
        height: 630,
        alt: 'MAALON REALTY - Powering Growth',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MAALON REALTY – Real Estate Brokerage & Property Advisory',
    description: 'Every property has a purpose. Every buyer has a place.',
    images: [BRAND.logos.horizontal],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen flex flex-col selection:bg-brand-500 selection:text-white">
        {/* Announcement Banner if enabled */}
        {DEFAULT_SITE_SETTINGS.announcement.enabled && (
          <div className="bg-charcoal-900 text-brand-300 text-xs py-2 px-4 text-center border-b border-brand-900/50">
            <span>{DEFAULT_SITE_SETTINGS.announcement.text}</span>
          </div>
        )}

        <Navbar />

        <main className="flex-grow pt-24 sm:pt-28 lg:pt-32">{children}</main>

        <Footer />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
