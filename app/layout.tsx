import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NOJ Coffee — No Overthink Just Coffee | Cileungsi, Bogor',
  description: 'NOJ Coffee adalah kedai kopi berkonsep Jepang minimalis di Cileungsi, Bogor. Nikmati signature kopi susu, manual brew, dan makanan Jepang. Shiawase, Always! ⭐ 4.9 (230 ulasan)',
  keywords: 'NOJ Coffee, kafe Cileungsi, kopi Bogor, kopi susu, Japanese cafe, Metland Cileungsi, kafe laptop',
  openGraph: {
    title: 'NOJ Coffee — Shiawase, Always!',
    description: 'No Overthink Just Coffee. Kafe Jepang minimalis di Cileungsi dengan kopi susu terbaik.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://nojcoffee.id',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "NOJ Coffee",
    "description": "Japanese minimalist coffee shop in Cileungsi, Bogor",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cluster Magnolia, Jl. Metland Cileungsi Blok DG 2 No.13",
      "addressLocality": "Cileungsi",
      "addressRegion": "West Java",
      "postalCode": "16820",
      "addressCountry": "ID"
    },
    "telephone": "+6285179769148",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "230"
    },
    "priceRange": "Rp 20.000 - Rp 50.000",
    "servesCuisine": "Coffee, Japanese",
    "sameAs": ["https://www.instagram.com/noj.coffee/"]
  };

  return (
    <html lang="id" className={`scroll-smooth ${playfair.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#00001A] text-white selection:bg-[#F5F0E8] selection:text-[#00001A] overflow-x-hidden" suppressHydrationWarning>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
