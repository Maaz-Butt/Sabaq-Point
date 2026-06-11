import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sabaqpoint.com'),
  title: {
    default: 'SabaqPoint - Matric & Intermediate Past Papers 2026 & Solved Solutions',
    template: '%s | SabaqPoint',
  },
  description: 'Download free Matric & Intermediate (9th, 10th, 11th, 12th Class) Past Papers 2026 with fully Solved Board Solutions, guess papers, and model papers for all Pakistan boards (BISE Lahore, FBISE Federal, Karachi, Rawalpindi, etc.).',
  keywords: [
    'past papers 2026',
    'solved past papers',
    'matric past papers 2026',
    'intermediate past papers 2026',
    '9th class past papers 2026',
    '10th class past papers 2026',
    '11th class past papers 2026',
    '12th class past papers 2026',
    '1st year past papers 2026',
    '2nd year past papers 2026',
    'FSc solved papers 2026',
    'ICS past papers 2026',
    'BISE Lahore solved papers',
    'FBISE Federal board papers 2026',
    'board solutions',
    'sabaqpoint past papers',
    'solved board papers',
    'pakistan educational boards',
    'matric guess papers 2026',
    'inter guess papers 2026'
  ],
  authors: [{ name: 'SabaqPoint Team', url: 'https://sabaqpoint.com' }],
  creator: 'SabaqPoint',
  publisher: 'SabaqPoint',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SabaqPoint - Matric & Intermediate Past Papers 2026 & Solved Solutions',
    description: 'Download free Matric & Intermediate (9th, 10th, 11th, 12th Class) Past Papers 2026 with fully Solved Board Solutions for all boards.',
    url: 'https://sabaqpoint.com',
    siteName: 'SabaqPoint',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SabaqPoint Past Papers & Solved Solutions 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SabaqPoint - Matric & Intermediate Past Papers 2026 & Solved Solutions',
    description: 'Download free Matric & Intermediate Past Papers 2026 with fully Solved Board Solutions.',
    images: ['/og-image.png'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full antialiased`}>
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  } else {
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
